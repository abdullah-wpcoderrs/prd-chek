"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlHtmlViewer } from "@/components/UrlHtmlViewer";

export default function HtmlViewerTest() {
  const [testUrl, setTestUrl] = useState("https://qiviknxunhsatdhwmzdz.supabase.co/storage/v1/object/public/project-documents/2025-09-23T17-41-12-235Z.html");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEmbeddedViewerOpen, setIsEmbeddedViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleTestViewer = () => {
    setIsViewerOpen(true);
  };

  const handleTestEmbeddedViewer = () => {
    setIsEmbeddedViewerOpen(true);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>HTML Document Viewer Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test URL:</label>
            <Input
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="Enter HTML document URL"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleTestViewer}>
              Open in Full Viewer
            </Button>
            <Button variant="outline" onClick={handleTestEmbeddedViewer}>
              Open Embedded Viewer
            </Button>
            <Button variant="outline" onClick={() => window.open(testUrl, '_blank')}>
              Open in New Tab
            </Button>
          </div>

          {isEmbeddedViewerOpen && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Embedded HTML Viewer (Simple Iframe)</h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleZoomOut} disabled={zoom <= 50}>
                    Zoom Out
                  </Button>
                  <span className="text-sm">{zoom}%</span>
                  <Button size="sm" variant="outline" onClick={handleZoomIn} disabled={zoom >= 200}>
                    Zoom In
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEmbeddedViewerOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="border rounded bg-white" style={{ height: '600px' }}>
                <iframe
                  src={testUrl}
                  className="w-full h-full rounded"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    width: `${10000 / zoom}%`,
                    height: `${10000 / zoom}%`
                  }}
                  title="HTML Document Viewer"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Screen Viewer */}
      <UrlHtmlViewer
        url={testUrl}
        title="Test HTML Document"
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
}