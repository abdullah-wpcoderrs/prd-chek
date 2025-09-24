"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  Loader2,
  FileText,
  Minimize
} from "lucide-react";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/use-toast";

interface HtmlDocumentViewerProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: string;
    downloadUrl?: string;
    createdAt?: string;
    documentId?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function HtmlDocumentViewer({ document, isOpen, onClose }: HtmlDocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const supabase = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch HTML content when viewer opens
  useEffect(() => {
    if (isOpen && document.documentId && user) {
      fetchHtmlContent();
    } else if (!isOpen) {
      // Reset content when viewer closes
      setHtmlContent('');
      setContentError(null);
    }
  }, [isOpen, document.documentId, user]);

  const fetchHtmlContent = async () => {
    if (!document.documentId || !user) {
      return;
    }

    setLoadingContent(true);
    setContentError(null);

    try {
      // Get the document record to verify ownership and get file path
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('file_path, status')
        .eq('id', document.documentId)
        .eq('user_id', user.id)
        .single();

      if (docError) {
        setContentError(`Failed to fetch document information: ${docError.message}`);
        return;
      }

      if (!docData) {
        setContentError('Document not found in database.');
        return;
      }

      if (docData.status !== 'completed') {
        setContentError(`Document is not ready yet. Status: ${docData.status}`);
        return;
      }

      if (!docData.file_path) {
        setContentError('Document file path not set. The document may not have been uploaded yet.');
        return;
      }

      // Generate signed URL for HTML file using the same file_path
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('project-documents')
        .createSignedUrl(docData.file_path, 3600); // 1 hour expiry

      if (urlError) {
        setContentError(`Failed to generate access URL: ${urlError.message}`);
        return;
      }

      // Fetch HTML content from signed URL
      const response = await fetch(signedUrlData.signedUrl);
      if (!response.ok) {
        setContentError(`Failed to fetch HTML content: ${response.statusText}`);
        return;
      }

      const htmlText = await response.text();
      setHtmlContent(htmlText);

    } catch (error) {
      setContentError(`Failed to load document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleDownload = () => {
    if (htmlContent) {
      // Create downloadable HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.name}.html`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = () => {
    if (navigator.share && htmlContent) {
      navigator.share({
        title: document.name,
        text: `Check out this document: ${document.name}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Document link has been copied to your clipboard.",
        variant: "default",
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white rounded-lg shadow-xl flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 font-sans">{document.name}</h3>
              <p className="text-sm text-gray-500 font-sans">
                {document.type} • {document.size}
                {document.createdAt && ` • ${new Date(document.createdAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white rounded border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="px-2 py-1 h-8"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="px-2 text-sm font-medium font-sans min-w-[50px] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="px-2 py-1 h-8"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!htmlContent}
              className="font-sans"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="font-sans"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="font-sans"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loadingContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600 font-sans">Loading document...</p>
              </div>
            </div>
          ) : contentError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">!</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                  Unable to Load Document
                </h3>
                <p className="text-gray-600 mb-4 font-sans">{contentError}</p>
                <Button onClick={fetchHtmlContent} className="font-sans">
                  Try Again
                </Button>
              </div>
            </div>
          ) : htmlContent ? (
            <div 
              className="h-full overflow-auto bg-white"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                width: `${10000 / zoom}%`,
                height: `${10000 / zoom}%`
              }}
            >
              <div 
                className="document-content p-8"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  lineHeight: '1.6',
                  color: '#1f2937',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-sans">No content available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}