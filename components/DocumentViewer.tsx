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
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  X,
  Loader2,
  FileCode,
  FileType
} from "lucide-react";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/use-toast";

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
  const [converting, setConverting] = useState(false);
  const [convertingToWord, setConvertingToWord] = useState(false);
  const supabase = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

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
      // Missing document or user logging removed for security
      return;
    }

    // Document fetch details logging removed for security

    setLoadingContent(true);
    setContentError(null);

    try {
      // Get the document record to verify ownership and get file path for viewing
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('file_path, download_url, status, id, project_id, type, name')
        .eq('id', document.documentId)
        .eq('user_id', user.id) // Ensure user can only access their own documents
        .single();

      // Document query result logging removed for security

      if (docError) {
        setContentError(`Failed to fetch document information: ${docError.message}`);
        return;
      }

      if (!docData) {
        setContentError('Document not found in database.');
        return;
      }

      // Document status logging removed for security

      if (!docData.file_path) {
        setContentError('Document file path not set. The document may not have been uploaded yet.');
        return;
      }

      if (docData.status !== 'completed') {
        setContentError(`Document is not ready yet. Status: ${docData.status}`);
        return;
      }

      // Use the file_path for viewing the document in the viewer
      const fileUrl = docData.file_path;
      // File path logging removed for security

      // Test if the URL is accessible
      try {
        const testResponse = await fetch(fileUrl, { method: 'HEAD' });
        // URL accessibility test logging removed for security

        if (testResponse.ok) {
          setPdfUrl(fileUrl);
        } else {
          setContentError(`Document file is not accessible (${testResponse.status}: ${testResponse.statusText})`);
        }
      } catch (fetchError) {
        setContentError(`Failed to access document file: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }

    } catch (error) {
      setContentError(`Failed to load document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingContent(false);
    }
  };

  if (!isOpen) return null;

  const handleDownload = () => {
    // Use the download_url that was passed in the document prop for downloading
    if (document.downloadUrl && !document.downloadUrl.startsWith('#')) {
      const link = window.document.createElement('a');
      link.href = document.downloadUrl;
      link.download = `${document.name}.pdf`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      // Fallback to pdfUrl if no download URL is available
      if (pdfUrl) {
        const link = window.document.createElement('a');
        link.href = pdfUrl;
        link.download = `${document.name}.pdf`;
        link.target = '_blank';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      } else {
        // Fallback for when document is not ready
        alert('Document is still being generated. Please wait for completion.');
      }
    }
  };

  // Enhanced text processing function for better markdown formatting
  const processTextItemsToMarkdown = async (textItems: any[]): Promise<string> => {
    if (!textItems || textItems.length === 0) return '';

    // Group text items by line position with detailed formatting info
    const lineGroups: {
      [key: number]: Array<{
        text: string;
        fontSize: number;
        fontName: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }>
    } = {};

    textItems.forEach((item) => {
      if (item.str && item.str.trim()) {
        const lineKey = Math.round(item.transform[5] / 3) * 3; // More precise Y grouping
        if (!lineGroups[lineKey]) lineGroups[lineKey] = [];

        lineGroups[lineKey].push({
          text: item.str,
          fontSize: item.transform[0] || 12, // Font size from transform matrix
          fontName: item.fontName || '',
          x: item.transform[4] || 0,
          y: item.transform[5] || 0,
          width: item.width || 0,
          height: item.height || 0
        });
      }
    });

    // Sort lines by Y position (top to bottom)
    const sortedLineKeys = Object.keys(lineGroups)
      .map(Number)
      .sort((a, b) => b - a); // PDF coordinates are bottom-up

    let result = '';
    let previousFontSize = 0;
    let averageFontSize = 0;

    // Calculate average font size for baseline
    const allFontSizes = sortedLineKeys.flatMap(key =>
      lineGroups[key].map(item => item.fontSize)
    );
    averageFontSize = allFontSizes.reduce((sum, size) => sum + size, 0) / allFontSizes.length;

    sortedLineKeys.forEach((lineKey, index) => {
      const lineItems = lineGroups[lineKey];

      // Sort items in line by X position (left to right)
      lineItems.sort((a, b) => a.x - b.x);

      // Combine text items in the line
      const lineText = lineItems.map(item => item.text).join('').trim();

      if (!lineText) return;

      // Get dominant font size for this line
      const lineFontSize = lineItems.reduce((sum, item) => sum + item.fontSize, 0) / lineItems.length;

      // Determine if this line is a heading based on various criteria
      const isHeading = detectHeading(lineText, lineFontSize, averageFontSize, lineItems);

      if (isHeading.isHeading) {
        // Add appropriate markdown heading syntax
        const headingLevel = Math.min(isHeading.level, 6);
        const headingPrefix = '#'.repeat(headingLevel);
        result += `${headingPrefix} ${lineText}\n\n`;
      } else {
        // Regular text - check if it should be a list item or paragraph
        if (isListItem(lineText)) {
          result += `- ${lineText.replace(/^[-•*]\s*/, '')}\n`;
        } else if (lineText.includes(':') && lineText.length < 150 && !lineText.endsWith('.')) {
          // Likely a definition or key-value pair
          const [key, ...valueParts] = lineText.split(':');
          if (valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            result += `**${key.trim()}**: ${value}\n\n`;
          } else {
            result += `${lineText}\n\n`;
          }
        } else {
          // Regular paragraph
          result += `${lineText}\n\n`;
        }
      }
    });

    // Clean up excessive line breaks and return
    return result
      .replace(/\n{3,}/g, '\n\n') // Replace 3+ line breaks with 2
      .trim();
  };

  // Function to detect if a line should be formatted as a heading
  const detectHeading = (text: string, fontSize: number, avgFontSize: number, items: any[]) => {
    let level = 2; // Default to h2
    let isHeading = false;

    // Criteria for heading detection:

    // 1. Font size significantly larger than average
    if (fontSize > avgFontSize * 1.2) {
      isHeading = true;
      if (fontSize > avgFontSize * 1.5) level = 1;
      else if (fontSize > avgFontSize * 1.3) level = 2;
      else level = 3;
    }

    // 2. Text characteristics that suggest headings
    const headingPatterns = [
      /^(Overview|Introduction|Summary|Conclusion|Abstract)$/i,
      /^(Frontend|Backend|Database|API|Architecture)(\s*\([^)]+\))?$/i,
      /^(Requirements?|Specifications?|Features?)$/i,
      /^(Technology|Tech|Technical)\s+(Stack|Requirements?|Specifications?)$/i,
      /^(Mobile|Web|Desktop|Server)\s+(App|Application|Development)$/i,
      /^(Framework|Library|Navigation|State Management|Forms|Offline Support|Animations|File Attachments|Accessibility)$/i,
      /^(UI Library|State Management|Forms & Validation|File Attachments)$/i,
      /^(Chapter|Section|Part)\s+\d+/i,
      /^[A-Z][A-Za-z\s&()]+$/,
    ];

    const isShortAndCapitalized = text.length < 50 && /^[A-Z]/.test(text) && !/[.!?]$/.test(text);
    const matchesPattern = headingPatterns.some(pattern => pattern.test(text));

    if (matchesPattern || isShortAndCapitalized) {
      isHeading = true;

      // Determine level based on text content and structure
      if (/^(Overview|Introduction|Summary|Abstract|Conclusion)$/i.test(text)) level = 2;
      else if (/^(Frontend|Backend|Database|API|Architecture)(\s*\([^)]+\))?$/i.test(text)) level = 2;
      else if (/^(Technology|Tech|Technical)\s+(Stack|Requirements?|Specifications?)$/i.test(text)) level = 1;
      else if (/^(Framework|Library|Navigation|State Management|Forms|Offline Support|Animations|File Attachments|Accessibility)$/i.test(text)) level = 3;
      else if (text.includes(':') && text.length < 100 && !text.endsWith('.')) level = 4;
      else if (isShortAndCapitalized && text.length < 30) level = 2;
      else if (isShortAndCapitalized && text.length < 60) level = 3;
      else level = 3;
    }

    // 3. Standalone lines (not part of a paragraph)
    if (text.length < 80 && !text.endsWith('.') && !text.includes(',') && /^[A-Z]/.test(text)) {
      isHeading = true;
      level = Math.max(level, 3);
    }

    return { isHeading, level };
  };

  // Function to detect list items
  const isListItem = (text: string): boolean => {
    return /^[-•*]\s/.test(text) ||
      /^\d+\.\s/.test(text) ||
      /^[a-zA-Z]\.\s/.test(text) ||
      /^[ivxlcdm]+\.\s/i.test(text);
  };

  // Function to process positioned text and maintain structure
  const processPositionedTextToStructured = async (extractedContent: any[]): Promise<string> => {
    let result = '';

    for (const page of extractedContent) {
      // Group text items by line position with detailed formatting info
      const lineGroups: {
        [key: number]: Array<{
          text: string;
          fontSize: number;
          fontName: string;
          x: number;
          y: number;
          width: number;
          height: number;
        }>
      } = {};

      page.items.forEach((item: any) => {
        if (item.text && item.text.trim()) {
          const lineKey = Math.round(item.y / 3) * 3; // Group by Y position
          if (!lineGroups[lineKey]) lineGroups[lineKey] = [];

          lineGroups[lineKey].push({
            text: item.text,
            fontSize: item.fontSize,
            fontName: item.fontName,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height
          });
        }
      });

      // Sort lines by Y position (top to bottom)
      const sortedLineKeys = Object.keys(lineGroups)
        .map(Number)
        .sort((a, b) => b - a); // PDF coordinates are bottom-up

      // Detect document type and structure
      const hasTreeStructure = sortedLineKeys.some(lineKey => {
        const lineItems = lineGroups[lineKey];
        const lineText = lineItems.map(item => item.text).join('').trim();
        return /[├└│─┌┐┘┴┬┤┼]/.test(lineText);
      });

      if (hasTreeStructure) {
        // Process as tree structure document (like sitemap)
        for (const lineKey of sortedLineKeys) {
          const lineItems = lineGroups[lineKey];
          lineItems.sort((a, b) => a.x - b.x);

          const minX = Math.min(...lineItems.map(item => item.x));
          const lineText = lineItems.map(item => item.text).join('').trim();
          
          if (!lineText) continue;

          const isTreeItem = /[├└│─┌┐┘┴┬┤┼]/.test(lineText);
          
          if (isTreeItem) {
            const baseIndent = Math.floor(minX / 15);
            const treeIndent = '  '.repeat(Math.max(0, baseIndent));
            result += `${treeIndent}${lineText}\n`;
          } else {
            const indent = '  '.repeat(Math.max(0, Math.floor(minX / 20)));
            result += `${indent}${lineText}\n`;
          }
        }
      } else {
        // Process as regular document with paragraphs
        let currentParagraph = '';
        let lastY = null;
        let lastFontSize = null;
        let lastIndent = null;

        for (const lineKey of sortedLineKeys) {
          const lineItems = lineGroups[lineKey];
          lineItems.sort((a, b) => a.x - b.x);

          const minX = Math.min(...lineItems.map(item => item.x));
          const avgFontSize = lineItems.reduce((sum, item) => sum + item.fontSize, 0) / lineItems.length;
          const lineText = lineItems.map(item => item.text).join('').trim();
          
          if (!lineText) {
            // Empty line - end current paragraph
            if (currentParagraph.trim()) {
              result += currentParagraph.trim() + '\n\n';
              currentParagraph = '';
            }
            continue;
          }

          const currentIndent = Math.floor(minX / 20);
          const isHeading = detectHeadingFromText(lineText, avgFontSize);
          const isListItem = /^[-•*]\s/.test(lineText) || /^\d+\.\s/.test(lineText);

          // Check if this should start a new paragraph
          const shouldStartNewParagraph = 
            isHeading ||
            isListItem ||
            (lastIndent !== null && currentIndent !== lastIndent) ||
            (lastFontSize !== null && Math.abs(avgFontSize - lastFontSize) > 2) ||
            (lastY !== null && Math.abs(lineKey - lastY) > 20); // Large gap between lines

          if (shouldStartNewParagraph && currentParagraph.trim()) {
            result += currentParagraph.trim() + '\n\n';
            currentParagraph = '';
          }

          // Add indentation for the line
          const indent = '  '.repeat(Math.max(0, currentIndent));
          
          if (isHeading || isListItem || shouldStartNewParagraph) {
            result += `${indent}${lineText}\n`;
            if (!isListItem) result += '\n'; // Add extra space after headings
          } else {
            // Continue current paragraph
            if (currentParagraph) {
              currentParagraph += ' ' + lineText;
            } else {
              currentParagraph = `${indent}${lineText}`;
            }
          }

          lastY = lineKey;
          lastFontSize = avgFontSize;
          lastIndent = currentIndent;
        }

        // Add any remaining paragraph
        if (currentParagraph.trim()) {
          result += currentParagraph.trim() + '\n\n';
        }
      }
      
      result += '\n'; // Add page break
    }

    return result;
  };

  // Helper function to detect headings
  const detectHeadingFromText = (text: string, fontSize: number): boolean => {
    // Check if text looks like a heading
    const headingPatterns = [
      /^(Overview|Introduction|Summary|Conclusion|Abstract|Background|Context|Objective|Goal|Scope|Features?|Requirements?|Specifications?)$/i,
      /^(Document Control|Version History|In-Scope|Out-of-Scope)$/i,
      /^[A-Z][A-Za-z\s&()]+$/,
    ];

    const isShortAndCapitalized = text.length < 80 && /^[A-Z]/.test(text) && !text.endsWith('.');
    const matchesPattern = headingPatterns.some(pattern => pattern.test(text));
    const isLargerFont = fontSize > 12; // Assuming base font is 12pt

    return (matchesPattern || isShortAndCapitalized) && (isLargerFont || text.length < 50);
  };

  const handleConvertToWord = async () => {
    if (!user) {
      alert('You must be logged in to convert documents.');
      return;
    }

    if (!document.documentId) {
      alert('Document ID is required for conversion.');
      return;
    }

    setConvertingToWord(true);

    try {
      // First, extract text from the PDF using the same logic as markdown conversion
      let conversionUrl = null;

      // Get the PDF URL (same logic as markdown conversion)
      if (document.downloadUrl && !document.downloadUrl.startsWith('#') && document.downloadUrl !== '') {
        conversionUrl = document.downloadUrl;
      } else if (document.documentId && user) {
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select('download_url, file_path, status')
          .eq('id', document.documentId)
          .eq('user_id', user.id)
          .single();

        if (docError) {
          throw new Error(`Failed to fetch document: ${docError.message}`);
        }

        if (docData?.download_url) {
          conversionUrl = docData.download_url;
        } else if (docData?.file_path) {
          conversionUrl = docData.file_path;
        }
      } else if (pdfUrl) {
        conversionUrl = pdfUrl;
      }

      if (!conversionUrl) {
        alert('No PDF document available to convert. Please ensure the document has been generated and try again.');
        return;
      }

      // Extract text using PDF.js (client-side)
      let pdfjsLib;
      try {
        let pdfjsLibModule;
        try {
          pdfjsLibModule = await import('pdfjs-dist');
        } catch {
          pdfjsLibModule = await import('pdfjs-dist/build/pdf.mjs');
        }

        pdfjsLib = pdfjsLibModule.default || pdfjsLibModule;
      } catch (importError) {
        throw new Error(`Failed to load PDF processing library: ${importError instanceof Error ? importError.message : 'Unknown error'}`);
      }

      // Set the worker path for PDF.js
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        try {
          const workerModule = await import('pdfjs-dist/build/pdf.worker.mjs');
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default || workerModule;
        } catch (workerError) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js';
        }
      }

      // Fetch PDF via API endpoint
      const apiUrl = `/api/documents/download?documentId=${document.documentId}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,*/*',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength === 0) {
        throw new Error('PDF file is empty or could not be downloaded');
      }

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 0,
        isEvalSupported: false,
        disableFontFace: false,
      });

      const pdf = await loadingTask.promise;
      if (!pdf || pdf.numPages === 0) {
        throw new Error('PDF document is empty or invalid');
      }

      // Extract text from all pages with positioning information
      let extractedContent = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Process text items with positioning information
        const pageItems = textContent.items.map((item: any) => ({
          text: item.str,
          x: item.transform[4] || 0,
          y: item.transform[5] || 0,
          fontSize: item.transform[0] || 12,
          fontName: item.fontName || '',
          width: item.width || 0,
          height: item.height || 0
        }));

        extractedContent.push({
          pageNumber: i,
          items: pageItems
        });
      }

      // Convert positioned text to structured format
      const structuredText = await processPositionedTextToStructured(extractedContent);

      if (!structuredText.trim()) {
        throw new Error('No text could be extracted from the PDF');
      }

      // Send extracted text to Word conversion API
      const wordResponse = await fetch('/api/documents/convert-to-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document.documentId,
          extractedText: structuredText,
          documentName: document.name,
        }),
      });

      if (!wordResponse.ok) {
        const errorData = await wordResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Conversion failed: ${wordResponse.status}`);
      }

      // Get the Word document as a blob
      const blob = await wordResponse.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.name.replace(/\.pdf$/i, '')}.docx`;
      link.style.display = 'none';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success toast
      toast({
        variant: "success",
        title: "✅ Conversion Complete!",
        description: `Successfully converted "${document.name}" to Word document and downloaded.`,
      });

    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      let suggestions = '';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Provide helpful suggestions based on error type
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network error')) {
          errorMessage = 'Network error - Unable to download the PDF file.';
          suggestions = '\n\nPossible solutions:\n• Check your internet connection\n• Try again in a few moments\n• The document might still be processing';
        } else if (errorMessage.includes('Invalid PDF') || errorMessage.includes('corrupted')) {
          errorMessage = 'The PDF file appears to be invalid or corrupted.';
          suggestions = '\n\nPossible solutions:\n• Try regenerating the document\n• Contact support if the issue persists';
        } else if (errorMessage.includes('empty')) {
          errorMessage = 'The PDF file is empty or could not be downloaded.';
          suggestions = '\n\nThe document might still be generating. Please wait and try again.';
        }
      }

      const fullMessage = `Failed to convert to Word document:\n\n${errorMessage}${suggestions}`;
      alert(fullMessage);
    } finally {
      setConvertingToWord(false);
    }
  };

  const handleConvertToMarkdown = async () => {

    // Validate prerequisites
    if (!user) {
      alert('You must be logged in to convert documents.');
      return;
    }

    setConverting(true);

    try {
      // First, ensure we have a valid document URL
      let conversionUrl = null;

      // Priority 1: Use download_url from database if available and valid
      if (document.downloadUrl && !document.downloadUrl.startsWith('#') && document.downloadUrl !== '') {
        conversionUrl = document.downloadUrl;
        // Download URL logging removed for security
      }
      // Priority 2: Fetch fresh download_url from database
      else if (document.documentId && user) {
        // Database fetch logging removed for security
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select('download_url, file_path, status')
          .eq('id', document.documentId)
          .eq('user_id', user.id)
          .single();

        if (docError) {
          throw new Error(`Failed to fetch document: ${docError.message}`);
        }

        if (docData?.download_url) {
          conversionUrl = docData.download_url;
          // Fresh download URL logging removed for security
        } else if (docData?.file_path) {
          conversionUrl = docData.file_path;
          // File path fallback logging removed for security
        }
      }
      // Priority 3: Use pdfUrl as last resort
      else if (pdfUrl) {
        conversionUrl = pdfUrl;
        // PDF URL fallback logging removed for security
      }

      if (!conversionUrl) {
        alert('No PDF document available to convert. Please ensure the document has been generated and try again.');
        return;
      }

      // Dynamically import PDF.js to avoid SSR issues
      let pdfjsLib;

      try {
        // Try different import paths for better compatibility
        let pdfjsLibModule;
        try {
          pdfjsLibModule = await import('pdfjs-dist');
        } catch {
          pdfjsLibModule = await import('pdfjs-dist/build/pdf.mjs');
        }

        pdfjsLib = pdfjsLibModule.default || pdfjsLibModule;
      } catch (importError) {
        throw new Error(`Failed to load PDF processing library: ${importError instanceof Error ? importError.message : 'Unknown error'}`);
      }

      // Set the worker path for PDF.js
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        try {
          // Try to use the bundled worker first
          const workerModule = await import('pdfjs-dist/build/pdf.worker.mjs');
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default || workerModule;
          console.log('✅ Debug: PDF.js worker configured with bundled worker');
        } catch (workerError) {
          console.warn('⚠️ Debug: Bundled worker failed, using CDN fallback:', workerError);
          // Fallback to CDN worker with correct version
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js';
          console.log('✅ Debug: PDF.js worker configured with CDN fallback');
        }
      }

      // Use our API endpoint to avoid CORS issues

      let response;
      try {
        // Use our server-side API to fetch the PDF and avoid CORS issues
        const apiUrl = `/api/documents/download?documentId=${document.documentId}`;
        // API URL logging removed for security

        response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf,*/*',
          },
          credentials: 'same-origin', // Safe to use credentials for same-origin requests
        });

        // API response logging removed for security

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
        }
      } catch (fetchError) {
        throw new Error(`Failed to download PDF via API: ${fetchError instanceof Error ? fetchError.message : 'Unknown network error'}`);
      }

      // Validate content type from API response
      const contentType = response.headers.get('content-type');
      // Content type logging removed for security

      if (contentType && !contentType.includes('application/pdf')) {
        // This might be an error response, let's check
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(`API returned error: ${errorData.error || 'Unknown error'}`);
        }
      }

      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength === 0) {
        throw new Error('PDF file is empty or could not be downloaded');
      }

      // Load the PDF document with proper error handling
      let pdf;
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          // Add additional options for better compatibility
          verbosity: 0, // Reduce console noise
          isEvalSupported: false, // Disable eval for security
          disableFontFace: false, // Allow font loading
        });

        pdf = await loadingTask.promise;
      } catch (pdfError) {
        throw new Error(`Invalid PDF format or corrupted file: ${pdfError instanceof Error ? pdfError.message : 'Unknown PDF error'}`);
      }

      if (!pdf || pdf.numPages === 0) {
        throw new Error('PDF document is empty or invalid');
      }

      // Create a clean document title
      const cleanTitle = document.name.replace(/\.(pdf|PDF)$/, '').replace(/[_-]/g, ' ');
      let markdownContent = `# ${cleanTitle}\n\n`;
      markdownContent += `**PRDChek** - *Generated from PDF on ${new Date().toLocaleDateString()}*\n\n`;
      markdownContent += `---\n\n`;

      // Extract text from each page with better error handling
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          // Convert text items to markdown with intelligent formatting
          const textItems = textContent.items as any[];

          // Enhanced text processing with formatting detection
          const processedLines = await processTextItemsToMarkdown(textItems);

          if (processedLines.trim()) {
            // Only add page header if there's actual content and it's not the first page
            if (i > 1) {
              markdownContent += `\n---\n\n`;
            }
            markdownContent += `${processedLines}\n\n`;
          } else {
            markdownContent += `## Page ${i}\n\n*[No readable text content]*\n\n`;
          }

        } catch (pageError) {
          markdownContent += `## Page ${i}\n\n*[Error extracting text from this page]*\n\n`;
        }
      }

      // Create and download the markdown file
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.name.replace(/[^a-zA-Z0-9\s-]/g, '')}.md`;
      link.style.display = 'none';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      // Markdown download success logging removed for security

      // Show success toast notification
      toast({
        variant: "success",
        title: "✅ Conversion Complete!",
        description: `Successfully converted "${document.name}" to Markdown and downloaded.`,
      });

    } catch (error) {

      // Provide more specific and helpful error messages
      let errorMessage = 'Unknown error occurred';
      let suggestions = '';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Categorize errors and provide helpful suggestions
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network error')) {
          errorMessage = 'Network error - Unable to download the PDF file.';
          suggestions = '\n\nPossible solutions:\n• Check your internet connection\n• Try again in a few moments\n• The document might still be processing';
        } else if (errorMessage.includes('Invalid PDF') || errorMessage.includes('corrupted')) {
          errorMessage = 'The PDF file appears to be invalid or corrupted.';
          suggestions = '\n\nPossible solutions:\n• Try regenerating the document\n• Contact support if the issue persists';
        } else if (errorMessage.includes('workerSrc') || errorMessage.includes('worker')) {
          errorMessage = 'PDF processing library configuration error.';
          suggestions = '\n\nThis is a technical issue. Please try refreshing the page.';
        } else if (errorMessage.includes('empty')) {
          errorMessage = 'The PDF file is empty or could not be downloaded.';
          suggestions = '\n\nThe document might still be generating. Please wait and try again.';
        } else if (errorMessage.includes('Failed to load PDF processing')) {
          errorMessage = 'Could not load PDF processing libraries.';
          suggestions = '\n\nPlease refresh the page and try again.';
        }
      }

      // Show user-friendly error dialog
      const fullMessage = `Failed to convert PDF to Markdown:\n\n${errorMessage}${suggestions}`;
      alert(fullMessage);

      // Also log detailed error for debugging
      // Detailed error logging removed for security
    } finally {
      setConverting(false);
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
        // Share cancelled
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`bg-white rounded-md shadow-sm flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-md">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" style={{ color: 'var(--steel-blue-600)' }} />
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
                  onClick={handleConvertToMarkdown}
                  disabled={converting || !document.documentId}
                >
                  {converting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileCode className="w-4 h-4 mr-2" />
                      To Markdown
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-sans"
                  onClick={handleConvertToWord}
                  disabled={convertingToWord || !document.documentId}
                >
                  {convertingToWord ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileType className="w-4 h-4 mr-2" />
                      To Word
                    </>
                  )}
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