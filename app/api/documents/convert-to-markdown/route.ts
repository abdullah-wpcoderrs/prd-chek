import { NextRequest, NextResponse } from 'next/server';
import TurndownService from 'turndown';

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, documentName } = await request.json();

    if (!htmlContent) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Initialize Turndown service for HTML to Markdown conversion
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    });

    // Convert HTML to Markdown
    const markdown = turndownService.turndown(htmlContent);

    // Generate filename
    const filename = documentName 
      ? `${documentName.replace(/\.[^/.]+$/, '')}.md`
      : 'document.md';

    return NextResponse.json({
      markdown,
      filename,
    });
  } catch (error) {
    console.error('Markdown conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert to markdown' },
      { status: 500 }
    );
  }
}
