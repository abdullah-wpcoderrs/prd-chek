"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Sparkles } from "lucide-react";
import { ProductManagerFormData } from "@/types";
import { ProjectOutlinePreview } from "./ProjectOutlinePreview";
import { useToast } from "@/lib/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  outline?: ProductManagerFormData;
}

interface PromptInterfaceProps {
  onApprove: (formData: ProductManagerFormData) => void;
  isSubmitting?: boolean;
}

export function PromptInterface({ onApprove, isSubmitting = false }: PromptInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentOutline, setCurrentOutline] = useState<ProductManagerFormData | null>(null);
  const [changes, setChanges] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (currentOutline) {
        // Refine existing outline
        const response = await fetch('/api/ai/refine-outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentOutline,
            userFeedback: userMessage
          })
        });

        if (!response.ok) {
          throw new Error('Failed to refine outline');
        }

        const data = await response.json();
        
        setCurrentOutline(data.outline);
        setChanges(data.changes || []);
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've updated your project outline based on your feedback. ${data.changes?.length > 0 ? `Changes made: ${data.changes.join(', ')}` : ''}`,
          outline: data.outline
        }]);

      } else {
        // Generate initial outline
        const response = await fetch('/api/ai/generate-outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userPrompt: userMessage })
        });

        if (!response.ok) {
          throw new Error('Failed to generate outline');
        }

        const data = await response.json();
        
        setCurrentOutline(data.outline);
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I've analyzed your project and created a comprehensive outline. Review the details below and let me know if you'd like to make any changes.",
          outline: data.outline
        }]);
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your request",
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (currentOutline) {
      onApprove(currentOutline);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Project Assistant</h2>
        </div>
        <p className="text-gray-600">
          Describe your project idea and I&apos;ll help you create a comprehensive outline.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px]">
        {messages.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Let&apos;s get started!
            </h3>
            <p className="text-gray-600 mb-4">
              Tell me about your project. Include details like:
            </p>
            <ul className="text-left text-sm text-gray-600 space-y-1 max-w-md mx-auto">
              <li>• What problem are you solving?</li>
              <li>• Who are your target users?</li>
              <li>• What makes your solution unique?</li>
              <li>• What are the key features?</li>
            </ul>
          </Card>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.outline && (
                <div className="mt-4">
                  <ProjectOutlinePreview
                    outline={message.outline}
                    changes={index === messages.length - 1 ? changes : []}
                    onApprove={handleApprove}
                    onReiterate={() => {
                      // Focus on input
                      document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
                    }}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-gray-600">Analyzing your project...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentOutline
                ? "Tell me what you'd like to change..."
                : "Describe your project idea..."
            }
            className="flex-1 min-h-[100px] resize-none"
            disabled={isLoading || isSubmitting}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isSubmitting}
            className="self-end"
            style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
