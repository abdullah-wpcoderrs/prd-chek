import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('🔔 DOCUMENT STATUS UPDATE RECEIVED');
        // Request body logging removed for security

        const {
            documentId,
            projectId,
            userId,
            documentType,
            status,
            filePath,
            fileSize,
            downloadUrl
        } = body;

        // Validate required fields
        if (!documentId && (!projectId || !userId || !documentType)) {
            return NextResponse.json({
                error: 'Either documentId or (projectId + userId + documentType) is required'
            }, { status: 400 });
        }

        if (!status) {
            return NextResponse.json({
                error: 'Status is required'
            }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();

        // Build update data
        const updateData: Record<string, unknown> = { status };
        if (filePath) updateData.file_path = filePath;
        if (fileSize) updateData.file_size = fileSize;
        if (downloadUrl) updateData.download_url = downloadUrl;

        let query = supabase.from('documents').update(updateData);

        // Use documentId if provided, otherwise use projectId + userId + documentType
        if (documentId) {
            query = query.eq('id', documentId);
        } else {
            query = query
                .eq('project_id', projectId)
                .eq('user_id', userId)
                .eq('type', documentType);
        }

        const { data, error } = await query.select();

        if (error) {
            console.error('❌ Error updating document status:', error);
            return NextResponse.json({
                error: `Failed to update document: ${error.message}`
            }, { status: 500 });
        }

        if (!data || data.length === 0) {
            console.error('❌ No document found to update');
            return NextResponse.json({
                error: 'Document not found'
            }, { status: 404 });
        }

        console.log('✅ Document status updated successfully');

        return NextResponse.json({
            success: true,
            message: 'Document status updated successfully',
            document: data[0]
        });

    } catch (error) {
        console.error('❌ Document status update error:', error);
        return NextResponse.json({
            error: 'Failed to process document status update'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Document status update endpoint is active',
        timestamp: new Date().toISOString()
    });
}