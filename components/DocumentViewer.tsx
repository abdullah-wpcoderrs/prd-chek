"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  FileText, 
  Share2, 
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  X,
  Loader2
} from "lucide-react";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { useAuth } from "@/lib/hooks/useAuth";

// Extended StorageError interface to include runtime properties
interface ExtendedStorageError {
  message: string;
  statusCode?: string | number;
  error?: string;
}

interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: string;
    content?: string;
    downloadUrl?: string;
    createdAt?: string;
    documentId?: string; // Add document ID for fetching real content
  };
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const supabase = useSupabase();
  const { user } = useAuth();

  // Fetch document content when viewer opens
  useEffect(() => {
    if (isOpen && document.documentId && user) {
      fetchDocumentContent();
    } else if (!isOpen) {
      // Reset content when viewer closes
      setDocumentContent(null);
      setContentError(null);
      setPdfUrl(null);
    }
  }, [isOpen, document.documentId, user]);

  const fetchDocumentContent = async () => {
    if (!document.documentId || !user) {
      console.log('🚫 Missing documentId or user:', { documentId: document.documentId, userId: user?.id });
      return;
    }
    
    console.log('🔍 Starting document fetch for:', {
      documentId: document.documentId,
      userId: user.id,
      documentName: document.name,
      documentType: document.type
    });
    
    setLoadingContent(true);
    setContentError(null);
    
    try {
      // Get the document record to verify ownership and get file path
      console.log('📊 Querying documents table...');
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('file_path, status, id, project_id, type, name')
        .eq('id', document.documentId)
        .eq('user_id', user.id)
        .single();

      console.log('📊 Document query result:', { docData, docError });

      if (docError) {
        console.error('❌ Error fetching document:', docError);
        setContentError(`Failed to fetch document information: ${docError.message}`);
        return;
      }

      if (!docData) {
        console.error('❌ No document data found');
        setContentError('Document not found in database.');
        return;
      }

      console.log('📄 Document status check:', {
        status: docData.status,
        file_path: docData.file_path,
        hasFilePath: !!docData.file_path
      });

      if (!docData.file_path) {
        console.warn('⚠️ No file path found for document');
        setContentError('Document file path not set. The document may not have been uploaded yet.');
        return;
      }

      if (docData.status !== 'completed') {
        console.warn('⚠️ Document not completed:', docData.status);
        setContentError(`Document is not ready yet. Status: ${docData.status}`);
        return;
      }

      // Use the file_path directly as the public URL without any modifications
      const fileUrl = docData.file_path;
      console.log('🔗 Using file_path directly as URL:', fileUrl);
      
      // Test if the URL is accessible
      try {
        const testResponse = await fetch(fileUrl, { method: 'HEAD' });
        console.log('🔍 URL accessibility test:', {
          url: fileUrl,
          status: testResponse.status,
          statusText: testResponse.statusText,
          contentType: testResponse.headers.get('content-type')
        });
        
        if (testResponse.ok) {
          console.log('✅ File URL is accessible, setting as PDF URL');
          setPdfUrl(fileUrl);
        } else {
          console.error('❌ File URL not accessible:', testResponse.status, testResponse.statusText);
          setContentError(`Document file is not accessible (${testResponse.status}: ${testResponse.statusText})`);
        }
      } catch (fetchError) {
        console.error('❌ Error testing file URL:', fetchError);
        setContentError(`Failed to access document file: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('❌ Unexpected error accessing document:', error);
      setContentError(`Failed to load document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingContent(false);
    }
  };


  
  if (!isOpen) return null;

  const handleDownload = () => {
    if (pdfUrl) {
      // Use the same PDF URL that's being displayed
      const link = window.document.createElement('a');
      link.href = pdfUrl;
      link.download = `${document.name}.pdf`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else if (document.downloadUrl && !document.downloadUrl.startsWith('#')) {
      // Fallback to original download URL if available
      const link = window.document.createElement('a');
      link.href = document.downloadUrl;
      link.download = `${document.name}.pdf`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      // Fallback for when document is not ready
      alert('Document is still being generated. Please wait for completion.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.name,
          text: `Check out this document: ${document.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`bg-white rounded-md shadow-sm flex flex-col ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-md">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" style={{color: 'var(--steel-blue-600)'}} />
            <div>
              <h2 className="font-semibold text-gray-900 font-sans">{document.name}</h2>
              <p className="text-sm text-gray-600 font-sans">
                {document.type} • {document.size}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="font-sans"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-600 px-2 font-sans">{zoom}%</span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="font-sans"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="font-sans"
            >
              <Maximize className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="font-sans"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="font-sans"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="font-sans"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main PDF Viewer Area */}
          <div className="flex-1 overflow-hidden bg-gray-100 p-4">
            {loadingContent ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600 mr-3" />
                <span className="text-gray-600">Loading PDF document...</span>
              </div>
            ) : contentError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Document Unavailable</h3>
                  <p className="text-gray-600 mb-4">{contentError}</p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={fetchDocumentContent}
                      variant="outline"
                      className="font-sans"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            ) : pdfUrl ? (
              <div className="h-full w-full">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0 rounded-md"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    width: `${100 / (zoom / 100)}%`,
                    height: `${100 / (zoom / 100)}%`
                  }}
                  title={document.name}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No PDF Available</h3>
                  <p className="text-gray-600">Document content is not ready yet.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-64 border-l bg-white p-4 space-y-4 overflow-y-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-sans">Document Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-sans">Type:</span>
                  <Badge variant="outline" className="font-sans">{document.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-sans">Size:</span>
                  <span className="font-sans">{document.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-sans">Created:</span>
                  <span className="font-sans">
                    {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-sans">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-sans"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-sans"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-sans"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-center p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-500 font-sans">
            Generated by PRDGen • {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}