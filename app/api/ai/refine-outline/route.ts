// app/api/ai/refine-outline/route.ts - Refine existing project outline

import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_CONFIG } from '@/lib/ai/openai-client';
import { REFINEMENT_PROMPT, generateRefinementPrompt } from '@/lib/ai/prompt-templates';
import { parseAIResponse, extractChanges } from '@/lib/ai/response-parser';
import { getAuthenticatedUser } from '@/lib/supabase-server';
import { ProductManagerFormData } from '@/types';

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
    const { currentOutline, userFeedback } = await request.json();

    if (!currentOutline || !userFeedback) {
      return NextResponse.json(
        { error: 'Current outline and user feedback are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Refining project outline with AI...');

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: REFINEMENT_PROMPT },
        { role: 'user', content: generateRefinementPrompt(currentOutline, userFeedback) }
      ],
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('✅ AI refinement response received');

    // Parse and validate response
    const parsed = parseAIResponse(aiResponse);

    if (!parsed.success || !parsed.data) {
      console.error('❌ Failed to parse AI response:', parsed.error);
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: parsed.error },
        { status: 500 }
      );
    }

    // Extract changes
    const changes = extractChanges(
      currentOutline as ProductManagerFormData,
      parsed.data
    );

    console.log('✅ Project outline refined successfully');
    console.log('📝 Changes:', changes);

    return NextResponse.json({
      outline: parsed.data,
      changes,
      rawResponse: aiResponse,
      success: true
    });

  } catch (error) {
    console.error('❌ Error refining outline:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to refine outline', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to refine outline' },
      { status: 500 }
    );
  }
}
