"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { useToast } from "@/lib/hooks/use-toast";

interface UrlHtmlViewerProps {
    url: string;
    title?: string;
    isOpen: boolean;
    onClose: () => void;
}

export function UrlHtmlViewer({ url, title = "HTML Document", isOpen, onClose }: UrlHtmlViewerProps) {
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [loadingContent, setLoadingContent] = useState(false);
    const [contentError, setContentError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // This useEffect will be defined after fetchHtmlContent

    const fetchHtmlContent = useCallback(async () => {
        if (!url) return;

        setLoadingContent(true);
        setContentError(null);

        try {
            console.log('Fetching from URL:', url);
            
            // Handle data URLs directly
            if (url.startsWith('data:')) {
                const htmlText = decodeURIComponent(url.split(',')[1] || '');
                if (htmlText) {
                    setHtmlContent(htmlText);
                    return;
                } else {
                    setContentError('Invalid data URL format');
                    return;
                }
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                },
                mode: 'cors', // Explicitly set CORS mode
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                if (response.status === 404) {
                    setContentError(`Document not found (404). The file may have been moved or deleted.`);
                } else if (response.status === 403) {
                    setContentError(`Access denied (403). You may not have permission to view this document.`);
                } else if (response.status === 0) {
                    setContentError(`Network error. This may be due to CORS restrictions or the server being unreachable.`);
                } else {
                    setContentError(`Failed to fetch HTML content: ${response.status} ${response.statusText}`);
                }
                return;
            }

            const htmlText = await response.text();
            console.log('Response content length:', htmlText.length);
            console.log('Response content preview:', htmlText.substring(0, 200));
            
            // Check if we actually got HTML content
            if (!htmlText || htmlText.trim().length === 0) {
                setContentError('Document appears to be empty');
                return;
            }

            // Check if the response contains HTML content (more flexible detection)
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
                setContentError(`Failed to load document: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
            }
        } finally {
            setLoadingContent(false);
        }
    }, [url]);

    // Fetch HTML content when viewer opens
    useEffect(() => {
        if (isOpen && url) {
            fetchHtmlContent();
        } else if (!isOpen) {
            // Reset content when viewer closes
            setHtmlContent('');
            setContentError(null);
        }
    }, [isOpen, url, fetchHtmlContent]);

    const handleFallbackDownload = async () => {
        // Fallback method: Create a new window with print styles and trigger print
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('Could not open print window');
        }

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    @page {
                        margin: 20mm;
                        size: A4;
                    }
                    body {
                        font-family: "Geist", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
                        line-height: 1.6;
                        color: #1f2937;
                        margin: 0;
                        padding: 0;
                    }
                    h1 { font-size: 2rem; font-weight: 800; margin: 2rem 0 1.5rem 0; color: #111827; line-height: 1.2; }
                    h2 { font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem 0; color: #111827; line-height: 1.3; }
                    h3 { font-size: 1.35rem; font-weight: 600; margin: 1.5rem 0 0.75rem 0; color: #111827; line-height: 1.4; }
                    h4 { font-size: 1.25rem; font-weight: 500; margin: 1.25rem 0 0.5rem 0; color: #111827; }
                    h5 { font-size: 1.125rem; font-weight: 500; margin: 1rem 0 0.5rem 0; color: #111827; }
                    h6 { font-size: 1rem; font-weight: 500; margin: 1rem 0 0.5rem 0; color: #111827; }
                    p { margin: 1rem 0; line-height: 1.7; }
                    ul, ol { margin: 1rem 0; padding-left: 2rem; }
                    li { margin: 0.5rem 0; line-height: 1.6; }
                    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border: 1px solid #e5e7eb; }
                    th, td { padding: 0.75rem; text-align: left; border: 1px solid #e5e7eb; vertical-align: top; }
                    th { background-color: #f9fafb; font-weight: 600; }
                    strong, b { font-weight: 600; }
                    em, i { font-style: italic; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load then trigger print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);

        toast({
            title: "Print dialog opened",
            description: "Please use your browser's print dialog to save as PDF.",
            variant: "default",
        });
    };

    const handleDownload = async () => {
        if (!contentRef.current || !htmlContent) {
            toast({
                title: "Download failed",
                description: "No content available to download.",
                variant: "destructive",
            });
            return;
        }

        setIsDownloading(true);

        try {
            console.log('Starting PDF generation...');

            // Dynamic import of html2canvas and jsPDF
            const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                import('html2canvas'),
                import('jspdf')
            ]);

            console.log('Libraries loaded successfully');

            // Get the content element
            const element = contentRef.current;
            console.log('Element dimensions:', {
                scrollWidth: element.scrollWidth,
                scrollHeight: element.scrollHeight,
                offsetWidth: element.offsetWidth,
                offsetHeight: element.offsetHeight
            });

            // Temporarily reset zoom for capture
            const originalTransform = element.style.transform;
            const originalMaxWidth = element.style.maxWidth;
            element.style.transform = 'scale(1)';
            element.style.maxWidth = 'none';

            console.log('Starting canvas capture...');

            // Capture the content as canvas with minimal options
            const canvas = await html2canvas(element, {
                useCORS: false, // Disable CORS to avoid security issues
                allowTaint: false, // Disable taint to avoid security issues
            });

            console.log('Canvas captured:', {
                width: canvas.width,
                height: canvas.height
            });

            // Restore original styles
            element.style.transform = originalTransform;
            element.style.maxWidth = originalMaxWidth;

            // Validate canvas
            if (canvas.width === 0 || canvas.height === 0) {
                throw new Error('Canvas has zero dimensions');
            }

            // Create PDF
            console.log('Creating PDF...');
            const imgData = canvas.toDataURL('image/png');

            if (!imgData || imgData === 'data:,') {
                throw new Error('Failed to convert canvas to image data');
            }

            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit page
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Calculate scaling to fit the page while maintaining aspect ratio
            const widthRatio = pdfWidth / (imgWidth * 0.264583);
            const heightRatio = (pdfHeight - 20) / (imgHeight * 0.264583); // Leave 20mm margin
            const ratio = Math.min(widthRatio, heightRatio);

            const scaledWidth = imgWidth * 0.264583 * ratio;
            const scaledHeight = imgHeight * 0.264583 * ratio;

            // Center the image
            const x = (pdfWidth - scaledWidth) / 2;
            const y = (pdfHeight - scaledHeight) / 2;

            console.log('PDF dimensions:', {
                pdfWidth,
                pdfHeight,
                scaledWidth,
                scaledHeight,
                x,
                y
            });

            // Add image to PDF
            pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

            // Save the PDF
            const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
            pdf.save(fileName);

            console.log('PDF saved successfully');

            toast({
                title: "Download successful",
                description: "PDF has been downloaded successfully.",
                variant: "default",
            });

        } catch (error) {
            console.error('PDF generation failed:', error);

            // Fallback: Try to create a simple HTML-to-PDF using print styles
            try {
                console.log('Attempting fallback method...');
                await handleFallbackDownload();
            } catch (fallbackError) {
                console.error('Fallback method also failed:', fallbackError);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                toast({
                    title: "Download failed",
                    description: `Failed to generate PDF: ${errorMessage}`,
                    variant: "destructive",
                });
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this document: ${title}`,
                url: url
            });
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(url);
            toast({
                title: "Link copied",
                description: "Document URL has been copied to your clipboard.",
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
        <div className={`fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'px-12 py-4'}`}>
            <div className={`bg-white rounded-lg shadow-xl flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900 font-sans">{title}</h3>
                            <p className="text-sm text-gray-500 font-sans">
                                HTML Document
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
                            disabled={isDownloading || !htmlContent}
                            className="font-sans"
                        >
                            {isDownloading ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 mr-1" />
                            )}
                            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
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
                            onClick={() => window.open(url, '_blank')}
                            className="font-sans"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Open
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
                                <p className="text-gray-600 font-sans">Loading document content...</p>
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
                                <div className="flex gap-2 justify-center">
                                    <Button onClick={fetchHtmlContent} className="font-sans">
                                        Try Again
                                    </Button>
                                </div>
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
                                <p className="text-gray-500 font-sans">No content loaded</p>
                                <Button onClick={fetchHtmlContent} className="mt-2 font-sans">
                                    Load Content
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}