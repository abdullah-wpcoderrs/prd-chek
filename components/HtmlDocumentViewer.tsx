"use client";

import { useState, useEffect, useRef } from "react";
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
  Minimize,
  ExternalLink
} from "lucide-react";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/use-toast";

interface HtmlDocumentViewerProps {
  document: {
    id: string;
    name: string;
    type: string;
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
  const contentRef = useRef<HTMLDivElement>(null);
  const supabase = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch HTML content when viewer opens
  useEffect(() => {
    if (isOpen && (document.downloadUrl || (document.documentId && user))) {
      fetchHtmlContent();
    } else if (!isOpen) {
      // Reset content when viewer closes
      setHtmlContent('');
      setContentError(null);
    }
  }, [isOpen, document.downloadUrl, document.documentId, user]);

  const fetchHtmlContent = async () => {
    setLoadingContent(true);
    setContentError(null);

    try {
      let fetchUrl: string | null = null;

      // First, try to use the downloadUrl if it's already provided
      if (document.downloadUrl) {
        console.log('Using provided downloadUrl:', document.downloadUrl);
        fetchUrl = document.downloadUrl;
      } else if (document.documentId && user) {
        // Fallback: Get the document record to verify ownership and get file path
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select('file_path, status, download_url')
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

        // Use download_url from database if available
        if (docData.download_url) {
          console.log('Using download_url from database:', docData.download_url);
          fetchUrl = docData.download_url;
        } else if (docData.file_path) {
          // Last resort: Generate signed URL for HTML file using the file_path
          console.log('Generating signed URL for file_path:', docData.file_path);
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from('project-documents')
            .createSignedUrl(docData.file_path, 3600); // 1 hour expiry

          if (urlError) {
            setContentError(`Failed to generate access URL: ${urlError.message}`);
            return;
          }
          fetchUrl = signedUrlData.signedUrl;
        } else {
          setContentError('No URL available for this document. The document may not have been uploaded yet.');
          return;
        }
      } else {
        setContentError('No document URL or ID provided.');
        return;
      }

      if (!fetchUrl) {
        setContentError('Unable to determine document URL.');
        return;
      }

      console.log('Fetching HTML content from:', fetchUrl);

      // Fetch HTML content from the determined URL
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setContentError(`Document not found (404). The file may have been moved or deleted.`);
        } else if (response.status === 403) {
          setContentError(`Access denied (403). You may not have permission to view this document.`);
        } else {
          setContentError(`Failed to fetch HTML content: ${response.status} ${response.statusText}`);
        }
        return;
      }

      const htmlText = await response.text();
      
      // Check if we actually got HTML content
      if (!htmlText || htmlText.trim().length === 0) {
        setContentError('Document appears to be empty');
        return;
      }

      // Check if the response contains HTML content (flexible detection)
      const lowerContent = htmlText.toLowerCase();
      const hasHtmlTags = lowerContent.includes('<html') || 
                         lowerContent.includes('<!doctype') || 
                         lowerContent.includes('<body') || 
                         lowerContent.includes('<div') ||
                         lowerContent.includes('<h1') ||
                         lowerContent.includes('<h2') ||
                         lowerContent.includes('<p') ||
                         lowerContent.includes('<span') ||
                         lowerContent.includes('<section');
      
      if (!hasHtmlTags) {
        // If it looks like an error message, show it
        if (htmlText.length < 500 && (lowerContent.includes('error') || lowerContent.includes('not found') || lowerContent.includes('access denied'))) {
          setContentError(`Server error: ${htmlText}`);
        } else {
          setContentError('The response does not appear to contain HTML content');
        }
        return;
      }

      setHtmlContent(htmlText);

    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setContentError(`Network error: Unable to reach the server. This could be due to CORS restrictions, network connectivity issues, or the server being down.`);
      } else {
        setContentError(`Failed to load document: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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
      
      toast({
        title: "Download started",
        description: `${document.name}.html has been downloaded.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Download failed",
        description: "No content available to download.",
        variant: "destructive",
      });
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

  const handleOpenInNewTab = () => {
    // Try to get the URL that was used to fetch the content
    let urlToOpen = document.downloadUrl;
    
    if (!urlToOpen && document.documentId && user) {
      // If no direct URL, we could construct one or show a message
      toast({
        title: "Unable to open",
        description: "No direct URL available for this document.",
        variant: "destructive",
      });
      return;
    }
    
    if (urlToOpen) {
      window.open(urlToOpen, '_blank');
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop itself, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 lg:px-12 lg:py-4'}`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-xl flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh] max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] lg:max-h-[90vh]'}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 font-sans truncate">{document.name}</h3>
              <p className="text-sm text-gray-500 font-sans truncate">
                {document.type}
                {document.createdAt && ` • ${new Date(document.createdAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white rounded border flex-shrink-0">
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

            {/* Action Buttons - Responsive layout */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!htmlContent}
                className="font-sans text-xs sm:text-sm px-2 sm:px-3"
              >
                <Download className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Download</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="font-sans text-xs sm:text-sm px-2 sm:px-3"
              >
                <Share2 className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Share</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                disabled={!document.downloadUrl}
                className="font-sans text-xs sm:text-sm px-2 sm:px-3"
              >
                <ExternalLink className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Open</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="font-sans px-2 sm:px-3"
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
                className="text-gray-500 hover:text-gray-700 px-2 sm:px-3"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
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
            <div className="h-full overflow-auto bg-white">
              <style dangerouslySetInnerHTML={{
                __html: `
                  .html-document-content {
                    font-family: "Geist", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
                    line-height: 1.6;
                    color: #1f2937;
                  }
                  .html-document-content h1 {
                    font-size: 2.0rem;
                    font-weight: 800;
                    margin: 2rem 0 1.5rem 0;
                    color: #111827;
                    line-height: 1.2;
                  }
                  .html-document-content h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 2rem 0 1rem 0;
                    color: #111827;
                    line-height: 1.3;
                  }
                  .html-document-content h3 {
                    font-size: 1.35rem;
                    font-weight: 600;
                    margin: 1.5rem 0 0.75rem 0;
                    color: #111827;
                    line-height: 1.4;
                  }
                  .html-document-content h4 {
                    font-size: 1.25rem;
                    font-weight: 500;
                    margin: 1.25rem 0 0.5rem 0;
                    color: #111827;
                  }
                  .html-document-content h5 {
                    font-size: 1.125rem;
                    font-weight: 500;
                    margin: 1rem 0 0.5rem 0;
                    color: #111827;
                  }
                  .html-document-content h6 {
                    font-size: 1rem;
                    font-weight: 500;
                    margin: 1rem 0 0.5rem 0;
                    color: #111827;
                  }
                  .html-document-content p {
                    margin: 1rem 0;
                    line-height: 1.7;
                  }
                  .html-document-content ul, .html-document-content ol {
                    margin: 1rem 0;
                    padding-left: 2rem;
                  }
                  .html-document-content li {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                  }
                  .html-document-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                    border: 1px solid #e5e7eb;
                  }
                  .html-document-content th, .html-document-content td {
                    padding: 0.75rem;
                    text-align: left;
                    border: 1px solid #e5e7eb;
                    vertical-align: top;
                  }
                  .html-document-content th {
                    background-color: #f9fafb;
                    font-weight: 600;
                  }
                  .html-document-content blockquote {
                    margin: 1.5rem 0;
                    padding: 1rem 1.5rem;
                    border-left: 4px solid #3b82f6;
                    background-color: #f8fafc;
                    font-style: italic;
                  }
                  .html-document-content code {
                    background-color: #f1f5f9;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 0.875em;
                  }
                  .html-document-content pre {
                    background-color: #1e293b;
                    color: #e2e8f0;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                  }
                  .html-document-content pre code {
                    background-color: transparent;
                    padding: 0;
                    color: inherit;
                  }
                  .html-document-content a {
                    color: #3b82f6;
                    text-decoration: underline;
                  }
                  .html-document-content a:hover {
                    color: #1d4ed8;
                  }
                  .html-document-content strong, .html-document-content b {
                    font-weight: 600;
                  }
                  .html-document-content em, .html-document-content i {
                    font-style: italic;
                  }
                  .html-document-content hr {
                    margin: 2rem 0;
                    border: none;
                    border-top: 1px solid #e5e7eb;
                  }
                  .html-document-content img {
                    max-width: 100%;
                    height: auto;
                    margin: 1rem 0;
                  }
                  .html-document-content div, .html-document-content section {
                    margin: 0.5rem 0;
                  }
                `
              }} />
              <div
                ref={contentRef}
                className="html-document-content p-8"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top left',
                  maxWidth: zoom === 100 ? '800px' : 'none',
                  margin: '0 auto',
                  minHeight: 'fit-content'
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
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