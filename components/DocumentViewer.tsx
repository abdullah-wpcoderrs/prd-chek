"use client";

import { HtmlDocumentViewer } from "./HtmlDocumentViewer";

interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    type: string;
    content?: string;
    downloadUrl?: string;
    createdAt?: string;
    documentId?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

// Simplified DocumentViewer - all documents are now HTML documents
export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  return <HtmlDocumentViewer document={document} isOpen={isOpen} onClose={onClose} />;
}