import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, extractedText, healthConcerns, productName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing ingredients:', { query, extractedText, healthConcerns, productName });

    // Build the system prompt for ingredient analysis
    const systemPrompt = `You are an expert nutritionist and food scientist AI assistant called "Ingredient Co-Pilot". Your role is to analyze food ingredients and provide personalized health insights.

IMPORTANT GUIDELINES:
1. Always be factual and cite scientific evidence when possible
2. Consider the user's health concerns: ${healthConcerns?.join(', ') || 'None specified'}
3. Provide balanced perspectives - mention both benefits and risks
4. Rate your confidence as LOW, MEDIUM, or HIGH
5. Suggest healthier alternatives when appropriate
6. Flag potential allergens and interactions
7. Use clear, non-technical language

RESPONSE FORMAT:
You MUST respond with valid JSON in this exact structure:
{
  "productName": "Name of the product",
  "healthScore": 1-10 (10 being healthiest),
  "summary": "Brief 2-3 sentence summary",
  "concerns": ["List of flagged health concerns based on user profile"],
  "insights": [
    {
      "name": "Ingredient name",
      "explanation": "What this ingredient is",
      "healthImpact": "positive" | "neutral" | "concern" | "warning",
      "impacts": ["Impact 1", "Impact 2"],
      "tradeoffs": "Balanced perspective on this ingredient",
      "alternatives": ["Alternative 1", "Alternative 2"],
      "confidence": "low" | "medium" | "high"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "allergenAlerts": ["List any allergens detected"],
  "drugInteractions": ["Potential drug-food interactions if user is on medications"]
}`;

    const userMessage = `Analyze the following food product:

${productName ? `Product: ${productName}` : ''}
${query ? `User Query: ${query}` : ''}
${extractedText ? `Ingredients/Label Text: ${extractedText}` : ''}

User's Health Profile:
- Health Concerns: ${healthConcerns?.join(', ') || 'None specified'}

Provide a comprehensive analysis focusing on their specific health needs. Be thorough but conversational.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log('AI response:', content);

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: create a basic response
      analysis = {
        productName: productName || "Unknown Product",
        healthScore: 5,
        summary: content,
        concerns: [],
        insights: [],
        recommendations: ["Unable to parse detailed analysis. Please try again."],
        allergenAlerts: [],
        drugInteractions: []
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in analyze-ingredients:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Analysis failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
