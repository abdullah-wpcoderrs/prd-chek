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
    
    // Split text into lines and process
    const lines = text.split('\n').filter(line => line.length > 0);
    
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
    
    // Detect document type
    const hasTreeStructure = lines.some(line => /[├└│─┌┐┘┴┬┤┼╭╮╯╰╱╲╳]/.test(line));
    
    if (hasTreeStructure) {
        // Process as tree structure document
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.length === 0) {
                docParagraphs.push(new Paragraph({ children: [] }));
                continue;
            }
            
            const leadingSpaces = line.length - line.trimStart().length;
            const indentLevel = Math.floor(leadingSpaces / 2);
            const isTreeItem = /[├└│─┌┐┘┴┬┤┼╭╮╯╰╱╲╳]/.test(trimmedLine);
            const isMainSection = !leadingSpaces && !isTreeItem && trimmedLine.length < 100 && /^[A-Z]/.test(trimmedLine);
            
            if (isMainSection) {
                docParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: trimmedLine,
                                bold: true,
                                size: 26,
                                color: "2F5496",
                            }),
                        ],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 240, after: 120 },
                    })
                );
            } else if (isTreeItem) {
                // Tree structure formatting
                const textRuns = [];
                let currentText = '';
                let isTreeChar = false;
                
                for (const char of trimmedLine) {
                    if (/[├└│─┌┐┘┴┬┤┼╭╮╯╰╱╲╳]/.test(char)) {
                        if (currentText && !isTreeChar) {
                            textRuns.push(new TextRun({
                                text: currentText,
                                size: 20,
                                font: "Consolas",
                            }));
                            currentText = '';
                        }
                        currentText += char;
                        isTreeChar = true;
                    } else {
                        if (currentText && isTreeChar) {
                            textRuns.push(new TextRun({
                                text: currentText,
                                size: 20,
                                font: "Consolas",
                                color: "70AD47",
                            }));
                            currentText = '';
                        }
                        currentText += char;
                        isTreeChar = false;
                    }
                }
                
                if (currentText) {
                    textRuns.push(new TextRun({
                        text: currentText,
                        size: 20,
                        font: isTreeChar ? "Consolas" : "Calibri",
                        color: isTreeChar ? "70AD47" : "000000",
                    }));
                }
                
                docParagraphs.push(
                    new Paragraph({
                        children: textRuns,
                        indent: { left: indentLevel * 360 },
                        spacing: { line: 240 },
                    })
                );
            } else {
                const isSubHeading = indentLevel === 0 && trimmedLine.length < 80 && /^[A-Z]/.test(trimmedLine) && !trimmedLine.endsWith('.');
                
                if (isSubHeading) {
                    docParagraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: trimmedLine,
                                    bold: true,
                                    size: 22,
                                    color: "44546A",
                                }),
                            ],
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 180, after: 60 },
                        })
                    );
                } else {
                    docParagraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: trimmedLine,
                                    size: 20,
                                }),
                            ],
                            indent: { left: indentLevel * 360 },
                        })
                    );
                }
            }
        }
    } else {
        // Process as regular document with proper paragraphs
        let i = 0;
        while (i < lines.length) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            if (trimmedLine.length === 0) {
                // Skip empty lines but add spacing
                docParagraphs.push(new Paragraph({ children: [] }));
                i++;
                continue;
            }
            
            const leadingSpaces = line.length - line.trimStart().length;
            const indentLevel = Math.floor(leadingSpaces / 2);
            
            // Detect headings
            const isHeading = detectHeading(trimmedLine);
            const isListItem = /^[-•*]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine);
            
            if (isHeading.isHeading) {
                docParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: trimmedLine,
                                bold: true,
                                size: isHeading.level === 1 ? 28 : isHeading.level === 2 ? 24 : 22,
                                color: isHeading.level === 1 ? "2F5496" : "44546A",
                            }),
                        ],
                        heading: isHeading.level === 1 ? HeadingLevel.HEADING_1 : 
                                isHeading.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
                        spacing: {
                            before: isHeading.level === 1 ? 240 : 180,
                            after: isHeading.level === 1 ? 120 : 60,
                        },
                    })
                );
            } else if (isListItem) {
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
                        indent: { left: (indentLevel + 1) * 360 },
                        spacing: { after: 60 },
                    })
                );
            } else {
                // Regular paragraph - combine consecutive lines
                let paragraphText = trimmedLine;
                let j = i + 1;
                
                // Look ahead to combine lines that belong to the same paragraph
                while (j < lines.length) {
                    const nextLine = lines[j];
                    const nextTrimmed = nextLine.trim();
                    
                    if (nextTrimmed.length === 0) break; // Empty line ends paragraph
                    
                    const nextLeadingSpaces = nextLine.length - nextLine.trimStart().length;
                    const nextIndentLevel = Math.floor(nextLeadingSpaces / 2);
                    const nextIsHeading = detectHeading(nextTrimmed);
                    const nextIsListItem = /^[-•*]\s/.test(nextTrimmed) || /^\d+\.\s/.test(nextTrimmed);
                    
                    // Stop if next line is a heading, list item, or has different indentation
                    if (nextIsHeading.isHeading || nextIsListItem || nextIndentLevel !== indentLevel) {
                        break;
                    }
                    
                    paragraphText += ' ' + nextTrimmed;
                    j++;
                }
                
                docParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: paragraphText,
                                size: 22,
                            }),
                        ],
                        indent: { left: indentLevel * 360 },
                        spacing: { after: 120 }, // Space after paragraphs
                        alignment: "left",
                    })
                );
                
                i = j - 1; // Skip the lines we've already processed
            }
            
            i++;
        }
    }
    
    return new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1440,    // 1 inch
                            right: 1440,  // 1 inch
                            bottom: 1440, // 1 inch
                            left: 1440,   // 1 inch
                        },
                    },
                },
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