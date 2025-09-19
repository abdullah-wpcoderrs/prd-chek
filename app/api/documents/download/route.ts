import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');

        if (!documentId) {
            return NextResponse.json(
                { error: 'Document ID is required' },
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

        // Get document info from database
        const { data: document, error: docError } = await supabase
            .from('documents')
            .select('download_url, file_path, name, type, status')
            .eq('id', documentId)
            .eq('user_id', user.id)
            .single();

        if (docError || !document) {
            console.error('Document fetch error:', docError);
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        if (document.status !== 'completed') {
            return NextResponse.json(
                { error: 'Document is not ready yet' },
                { status: 400 }
            );
        }

        // Determine the URL to fetch from
        const fetchUrl = document.download_url || document.file_path;

        if (!fetchUrl) {
            return NextResponse.json(
                { error: 'Document file not available' },
                { status: 404 }
            );
        }

        // Document fetch URL logging removed for security

        // Fetch the PDF file
        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'PRDGen-Server/1.0',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch document:', response.status, response.statusText);
            return NextResponse.json(
                { error: `Failed to fetch document: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        // Get the PDF content
        const pdfBuffer = await response.arrayBuffer();

        if (pdfBuffer.byteLength === 0) {
            return NextResponse.json(
                { error: 'Document file is empty' },
                { status: 404 }
            );
        }

        console.log('✅ Document fetched successfully, size:', pdfBuffer.byteLength);

        // Return the PDF with proper headers
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': pdfBuffer.byteLength.toString(),
                'Cache-Control': 'private, max-age=3600',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}