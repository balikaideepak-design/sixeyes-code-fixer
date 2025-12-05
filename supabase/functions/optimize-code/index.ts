import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, mode, settings, messages, userQuery } = await req.json();

    const API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!API_KEY) {
      throw new Error('API Key not configured');
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    let systemPrompt = "";
    let contents = [];

    if (mode === 'general-chat') {
      systemPrompt = `You are 'SIX EYES', an expert coding assistant.
      Your goal is to help users with programming questions for languages like JavaScript, HTML, CSS, Python, C, and Java.
      
      - Answer questions concisely and accurately.
      - Provide code examples where helpful.
      - If a user asks about something non-coding related, politely steer them back to programming.
      - Use Markdown formatting for your response.`;

      if (messages && messages.length > 0) {
        // 1. Map frontend roles to Gemini roles
        let mappedMessages = messages.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

        // 2. Fix: Ensure conversation starts with a USER message
        // Remove leading model messages
        while (mappedMessages.length > 0 && mappedMessages[0].role === 'model') {
          mappedMessages.shift();
        }

        // 3. Fix: Ensure strict alternation (User -> Model -> User)
        // Gemini will error if we send User -> User or Model -> Model
        const validMessages = [];
        if (mappedMessages.length > 0) {
          validMessages.push(mappedMessages[0]);
          for (let i = 1; i < mappedMessages.length; i++) {
            if (mappedMessages[i].role !== mappedMessages[i - 1].role) {
              validMessages.push(mappedMessages[i]);
            }
          }
        }

        contents = validMessages;
      } else {
        // Fallback if no history
        contents = [{ role: "user", parts: [{ text: userQuery || "Hello" }] }];
      }

      // Final check: if after filtering we have no messages, add a default one
      if (contents.length === 0) {
        contents = [{ role: "user", parts: [{ text: userQuery || "Hello" }] }];
      }

    } else if (mode === 'execute') {
      systemPrompt = `You are a code execution engine. 
      Your task is to SIMULATE the execution of the provided code in the "${language}" programming language.
      
      CRITICAL: You MUST capture and return ALL standard output (stdout) produced by the code.
      
      Rules:
      1. Analyze the code logic step-by-step.
      2. If the code uses ANY printing function (printf, cout, console.log, print, System.out.println, etc.), you MUST include the exact output in the 'output' field.
      3. Do NOT ignore simple print statements. If the code prints "Hello", the output MUST be "Hello".
      4. IF THE CODE DOES NOT PRODUCE OUTPUT (e.g. it defines a function but doesn't call it):
         - You MUST simulate calling the Main Function or the Primary Function with reasonable example arguments.
         - Print the result of that function call in the 'output' field.
         - Format it as: "Result of [Function Name](args): [Return Value]"
      5. If there are errors (syntax or runtime), return the STDERR (Standard Error) in the 'error' field.
      6. Do not provide explanations in the output string, only the raw program output (or your simulated output).
      7. Return ONLY valid JSON.
      
      Output Format:
      {
        "output": "The actual program output...",
        "error": "Any error message (optional)"
      }`;

      contents = [{
        role: "user",
        parts: [{ text: `Code to execute (${language}):\n\n${code}` }]
      }];

    } else {
      // ... (OPTIMIZE MODE logic remains unchanged) ...
      // Construct settings context
      let focusInstructions = "Optimize for general best practices.";
      if (settings) {
        const focus = [];
        if (settings.performance) focus.push("Performance efficiency");
        if (settings.readability) focus.push("Code readability and clean style");
        if (settings.security) focus.push("Security vulnerabilities");
        if (settings.comments) focus.push("Adding detailed comments");

        if (focus.length > 0) {
          focusInstructions = `Prioritize the following aspects: ${focus.join(", ")}.`;
        }
      }

      systemPrompt = `You are a code optimization expert. Your task is two-fold:

      STEP 1: VALIDATION (CRITICAL)
      The user claims this code is written in "${language}".
      Analyze the syntax. If the code is clearly NOT "${language}" (e.g., HTML tags in a Java file, Python indentation in C, CSS rules in JavaScript), you must REJECT it.
      
      If rejected, return this JSON:
      {
        "error": "Language mismatch: The code appears to be [Detected Language] but you selected ${language}. Please select the suitable language."
      }

      STEP 2: OPTIMIZATION
      If the code matches "${language}" or is ambiguous/snippet-like:
      1. Optimize the code based on standard best practices.
      2. ${focusInstructions}
      3. Provide a list of specific improvements.
      4. Provide a short explanation.

      If accepted, return this JSON:
      {
        "optimizedCode": "the full optimized code string",
        "improvements": ["improvement 1", "improvement 2"],
        "explanation": "Summary of changes..."
      }
      
      CRITICAL: Return ONLY valid raw JSON. Do not use markdown blocks like \`\`\`json. Do not include any other text.`;

      contents = [{
        role: "user",
        parts: [{ text: `Language: ${language}\n\nCode to optimize:\n${code}` }]
      }];
    }

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      // Return a generic error to frontend but log specific one
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error('No response from AI');
    }

    if (mode !== 'general-chat') {
      aiResponseText = aiResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    let result;
    if (mode === 'general-chat') {
      result = { reply: aiResponseText };
    } else {
      try {
        result = JSON.parse(aiResponseText);
      } catch (e) {
        console.error("Failed to parse JSON:", aiResponseText);
        result = { error: "Failed to process code. AI returned invalid format." };
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});