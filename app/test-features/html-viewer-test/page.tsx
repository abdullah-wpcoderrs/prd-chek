"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UrlHtmlViewer } from "@/components/UrlHtmlViewer";

export default function HtmlViewerTest() {
  const [testUrl, setTestUrl] = useState("");
  const [testUrls] = useState([
    "https://qiviknxunhsatdhwmzdz.supabase.co/storage/v1/object/public/project-documents/2025-09-23T17-41-12-235Z.html",
    "https://example.com/sample.html",
    "https://httpbin.org/html",
    "data:text/html,<html><body><h1>Test HTML</h1><p>This is a test HTML document.</p></body></html>"
  ]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEmbeddedViewerOpen, setIsEmbeddedViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [debugInfo, setDebugInfo] = useState<{
    url: string;
    status?: number;
    statusText?: string;
    error?: string;
    errorType?: string;
    responseTime?: number;
    contentLength?: number;
    contentType?: string;
    isHtml?: boolean;
    corsHeaders?: Record<string, string>;
    headers?: Record<string, string>;
    contentPreview?: string;
  } | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);

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

  const handleDebugUrl = async () => {
    if (!testUrl) return;
    
    setIsDebugging(true);
    setDebugInfo(null);
    
    try {
      console.log('Debug: Testing URL:', testUrl);
      
      const startTime = Date.now();
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        mode: 'cors',
      });
      const endTime = Date.now();
      
      const responseText = await response.text();
      
      setDebugInfo({
        url: testUrl,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseTime: endTime - startTime,
        contentLength: responseText.length,
        contentPreview: responseText.substring(0, 500),
        isHtml: responseText.toLowerCase().includes('<html') || 
                responseText.toLowerCase().includes('<!doctype') ||
                responseText.toLowerCase().includes('<body') ||
                responseText.toLowerCase().includes('<div') ||
                responseText.toLowerCase().includes('<h1') ||
                responseText.toLowerCase().includes('<p'),
        contentType: response.headers.get('content-type') || undefined,
        corsHeaders: {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin') || '',
          'access-control-allow-methods': response.headers.get('access-control-allow-methods') || '',
          'access-control-allow-headers': response.headers.get('access-control-allow-headers') || '',
        }
      });
    } catch (error) {
      setDebugInfo({
        url: testUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name || 'Unknown',
      });
    } finally {
      setIsDebugging(false);
    }
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
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Quick test URLs:</p>
              {testUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setTestUrl(url)}
                  className="block text-xs text-blue-600 hover:text-blue-800 truncate w-full text-left"
                >
                  {index === 0 ? "Original Supabase URL" : 
                   index === 1 ? "Example.com HTML" :
                   index === 2 ? "HTTPBin HTML" : "Data URL HTML"}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleTestViewer} disabled={!testUrl}>
              Open in Full Viewer
            </Button>
            <Button variant="outline" onClick={handleTestEmbeddedViewer} disabled={!testUrl}>
              Open Embedded Viewer
            </Button>
            <Button variant="outline" onClick={() => window.open(testUrl, '_blank')} disabled={!testUrl}>
              Open in New Tab
            </Button>
            <Button variant="secondary" onClick={handleDebugUrl} disabled={!testUrl || isDebugging}>
              {isDebugging ? 'Debugging...' : 'Debug URL'}
            </Button>
          </div>

          {debugInfo && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Debug Information
                  <Badge variant={debugInfo.error ? "destructive" : debugInfo.status === 200 ? "default" : "secondary"}>
                    {debugInfo.error ? "Error" : `${debugInfo.status} ${debugInfo.statusText}`}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>URL:</strong> <code className="text-sm bg-gray-100 px-1 rounded">{debugInfo.url}</code>
                </div>
                
                {debugInfo.error ? (
                  <div>
                    <strong>Error:</strong> <span className="text-red-600">{debugInfo.error}</span>
                    <br />
                    <strong>Type:</strong> {debugInfo.errorType}
                  </div>
                ) : (
                  <>
                    <div>
                      <strong>Response Time:</strong> {debugInfo.responseTime}ms
                    </div>
                    <div>
                      <strong>Content Length:</strong> {debugInfo.contentLength} bytes
                    </div>
                    <div>
                      <strong>Content Type:</strong> <code className="text-sm bg-gray-100 px-1 rounded">{debugInfo.contentType || 'Not specified'}</code>
                    </div>
                    <div>
                      <strong>Contains HTML:</strong> {debugInfo.isHtml ? "✅ Yes" : "❌ No"}
                    </div>
                    <div>
                      <strong>CORS Headers:</strong>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(debugInfo.corsHeaders, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <strong>All Headers:</strong>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto max-h-32">
                        {JSON.stringify(debugInfo.headers, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <strong>Content Preview:</strong>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto max-h-32">
                        {debugInfo.contentPreview}
                      </pre>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

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