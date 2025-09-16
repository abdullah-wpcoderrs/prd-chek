import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function POST(request: NextRequest) {
    try {
        const { documentId, extractedText, documentName } = await request.json();

        if (!documentId) {
            return NextResponse.json(
                { error: 'Document ID is required' },
                { status: 400 }
            );
        }

        if (!extractedText) {
            return NextResponse.json(
                { error: 'Extracted text is required' },
                { status: 400 }
            );
        }

        const supabase = await createSupabaseServerClient();

        // Get the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify document ownership
        const { data: document, error: docError } = await supabase
            .from('documents')
            .select('id, name, status')
            .eq('id', documentId)
            .eq('user_id', user.id)
            .single();

        if (docError || !document) {
            console.error('Document fetch error:', docError);
            return NextResponse.json(
                { error: 'Document not found or access denied' },
                { status: 404 }
            );
        }

        // Use the document name from the request or fallback to database
        const finalDocumentName = documentName || document.name || 'Document';
        
        // Convert text to Word document
        const wordDoc = await createWordDocument(extractedText, finalDocumentName);
        
        // Generate the Word file buffer
        const wordBuffer = await Packer.toBuffer(wordDoc);

        // Return the Word document
        return new NextResponse(wordBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${finalDocumentName.replace(/\.pdf$/i, '')}.docx"`,
                'Content-Length': wordBuffer.byteLength.toString(),
                'Cache-Control': 'private, no-cache',
            },
        });

    } catch (error) {
        console.error('Word conversion error:', error);
        return NextResponse.json(
            { error: 'Failed to convert document to Word format' },
            { status: 500 }
        );
    }
}



async function createWordDocument(text: string, documentName: string): Promise<Document> {
    // Clean the document name for title
    const cleanTitle = documentName.replace(/\.(pdf|PDF)$/, '').replace(/[_-]/g, ' ');
    
    // Clean and normalize the text
    const cleanedText = text
        .replace(/\r\n/g, '\n')  // Normalize line endings
        .replace(/\n{3,}/g, '\n\n')  // Replace multiple line breaks with double
        .trim();
    
    // Split text into paragraphs and process
    const paragraphs = cleanedText.split('\n\n').filter(p => p.trim().length > 0);
    
    const docParagraphs = [];
    
    // Add title
    docParagraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: cleanTitle,
                    bold: true,
                    size: 32,
                }),
            ],
            heading: HeadingLevel.TITLE,
        })
    );
    
    // Add generation date
    docParagraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Generated on ${new Date().toLocaleDateString()}`,
                    italics: true,
                    size: 20,
                }),
            ],
        })
    );
    
    // Add empty paragraph for spacing
    docParagraphs.push(new Paragraph({ children: [] }));
    
    // Process each paragraph
    for (const paragraph of paragraphs) {
        const trimmedParagraph = paragraph.trim();
        
        if (trimmedParagraph.length === 0) continue;
        
        // Handle multi-line paragraphs (split by single line breaks)
        const lines = trimmedParagraph.split('\n').filter(line => line.trim().length > 0);
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Detect if this looks like a heading
            const isHeading = detectHeading(trimmedLine);
            
            if (isHeading.isHeading) {
                docParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: trimmedLine,
                                bold: true,
                                size: isHeading.level === 1 ? 28 : isHeading.level === 2 ? 24 : 22,
                            }),
                        ],
                        heading: isHeading.level === 1 ? HeadingLevel.HEADING_1 : 
                                isHeading.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
                    })
                );
            } else if (isListItem(trimmedLine)) {
                // Handle list items
                const listText = trimmedLine.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
                docParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `• ${listText}`,
                                size: 22,
                            }),
                        ],
                        indent: {
                            left: 720, // 0.5 inch indent
                        },
                    })
                );
            } else {
                // Regular paragraph
                docParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: trimmedLine,
                                size: 22,
                            }),
                        ],
                    })
                );
            }
        }
        
        // Add spacing between sections
        if (lines.length > 1) {
            docParagraphs.push(new Paragraph({ children: [] }));
        }
    }
    
    return new Document({
        sections: [
            {
                properties: {},
                children: docParagraphs,
            },
        ],
    });
}

function isListItem(text: string): boolean {
    return /^[-•*]\s/.test(text) ||
           /^\d+\.\s/.test(text) ||
           /^[a-zA-Z]\.\s/.test(text) ||
           /^[ivxlcdm]+\.\s/i.test(text);
}

function detectHeading(text: string): { isHeading: boolean; level: number } {
    // Heading detection logic similar to the markdown converter
    const headingPatterns = [
        /^(Overview|Introduction|Summary|Conclusion|Abstract)$/i,
        /^(Frontend|Backend|Database|API|Architecture)(\s*\([^)]+\))?$/i,
        /^(Requirements?|Specifications?|Features?)$/i,
        /^(Technology|Tech|Technical)\s+(Stack|Requirements?|Specifications?)$/i,
        /^(Mobile|Web|Desktop|Server)\s+(App|Application|Development)$/i,
        /^(Framework|Library|Navigation|State Management|Forms|Offline Support|Animations|File Attachments|Accessibility)$/i,
    ];

    const isShortAndCapitalized = text.length < 50 && /^[A-Z]/.test(text) && !/[.!?]$/.test(text);
    const matchesPattern = headingPatterns.some(pattern => pattern.test(text));

    if (matchesPattern || isShortAndCapitalized) {
        // Determine heading level
        if (/^(Technology|Tech|Technical)\s+(Stack|Requirements?|Specifications?)$/i.test(text)) {
            return { isHeading: true, level: 1 };
        } else if (/^(Overview|Introduction|Summary|Abstract|Conclusion|Frontend|Backend|Database|API|Architecture)$/i.test(text)) {
            return { isHeading: true, level: 2 };
        } else {
            return { isHeading: true, level: 3 };
        }
    }

    return { isHeading: false, level: 0 };
}