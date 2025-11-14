// app/api/ai/generate-outline/route.ts - Generate initial project outline

import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_CONFIG } from '@/lib/ai/openai-client';
import { SYSTEM_PROMPT, generateUserPrompt } from '@/lib/ai/prompt-templates';
import { parseAIResponse } from '@/lib/ai/response-parser';
import { getAuthenticatedUser } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const userId = await getAuthenticatedUser();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { userPrompt } = await request.json();

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    console.log('🤖 Generating project outline with AI...');

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: generateUserPrompt(userPrompt) }
      ],
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('✅ AI response received');

    // Parse and validate response
    const parsed = parseAIResponse(aiResponse);

    if (!parsed.success || !parsed.data) {
      console.error('❌ Failed to parse AI response:', parsed.error);
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: parsed.error },
        { status: 500 }
      );
    }

    console.log('✅ Project outline generated successfully');

    return NextResponse.json({
      outline: parsed.data,
      rawResponse: aiResponse,
      success: true
    });

  } catch (error) {
    console.error('❌ Error generating outline:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to generate outline', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
}
