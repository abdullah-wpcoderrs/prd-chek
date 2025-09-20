"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGeneration } from "@/lib/context/GenerationContext";
import { GenerationDocument } from "@/types";
import {
    FileText,
    Users,
    Map,
    Code,
    Layout,
    Clock,
    CheckCircle2,
    Loader2,
    XCircle,
    AlertCircle,
    Search,
    Target,
    Briefcase,
    Settings,
    Calendar
} from "lucide-react";

interface GenerationProgressV2Props {
    projectId: string;
    onComplete: (projectId: string) => void;
    onCancel: () => void;
    onClickOutside?: () => void;
}

// Enhanced document icons for V2 pipeline
const documentIconsV2 = {
    "Research_Insights": Search,
    "Vision_Strategy": Target,
    "PRD": FileText,
    "BRD": Briefcase,
    "TRD": Code,
    "Planning_Toolkit": Calendar
};

// Document icons for V2 pipeline (now the only version)

// Stage configuration for V2 pipeline
const stageConfig = {
    discovery: {
        name: "Discovery & Research",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description: "Market research and user insights"
    },
    strategy: {
        name: "Vision & Strategy",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        description: "Strategic planning and vision alignment"
    },
    planning: {
        name: "Requirements & Planning",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Detailed requirements and implementation planning"
    }
};

const statusConfig: Record<string, {
    icon: any;
    color: string;
    bgColor: string;
    label: string;
    animate?: boolean;
}> = {
    pending: {
        icon: Clock,
        color: "text-gray-400",
        bgColor: "bg-gray-100",
        label: "Waiting"
    },
    processing: {
        icon: Loader2,
        color: "text-white",
        bgColor: "bg-opacity-90",
        label: "Processing",
        animate: true
    },
    completed: {
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Complete"
    },
    failed: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
        label: "Failed"
    }
};

export function GenerationProgressV2({
    projectId,
    onComplete,
    onCancel,
    onClickOutside
}: GenerationProgressV2Props) {
    const { getGenerationStatus, addGeneration } = useGeneration();
    const modalRef = useRef<HTMLDivElement>(null);

    // Get status from context
    const progress = getGenerationStatus(projectId);

    // All projects are now V2
    const isV2Project = true;

    // The progress data should come from real-time Supabase updates via useRealtimeProjects
    // No need to initialize mock data here since updateGenerationFromProject handles real data

    // Handle completion
    useEffect(() => {
        if (progress?.status === 'completed') {
            setTimeout(() => onComplete(projectId), 2000);
        }
    }, [progress?.status, projectId, onComplete]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClickOutside?.();
            }
        };

        if (onClickOutside) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [onClickOutside]);

    // Fallback if no progress data
    if (!progress) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-3xl shadow-sm" ref={modalRef}>
                    <CardContent className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--steel-blue-600)' }} />
                        <p className="text-gray-600 font-sans">Initializing enhanced generation...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatTime = (ms: number) => {
        const seconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
    };

    // Group documents by stage for V2 projects
    const groupedDocuments = isV2Project ? {
        discovery: progress.documents.filter((doc: GenerationDocument) => doc.stage === 'discovery'),
        strategy: progress.documents.filter((doc: GenerationDocument) => doc.stage === 'strategy'),
        planning: progress.documents.filter((doc: GenerationDocument) => doc.stage === 'planning')
    } : null;

    // Calculate stage progress for V2
    const calculateStageProgress = (stageDocs: GenerationDocument[]) => {
        if (stageDocs.length === 0) return 0;
        const completed = stageDocs.filter(doc => doc.status === 'completed').length;
        return Math.round((completed / stageDocs.length) * 100);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl shadow-sm max-h-[90vh] overflow-y-auto" ref={modalRef}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 font-sans">
                                {progress.status === 'processing' && <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--steel-blue-600)' }} />}
                                {progress.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                {progress.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                                {progress.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}

                                {progress.status === 'pending' && "Preparing Generation..."}
                                {progress.status === 'processing' && "Generating Enhanced Documentation Suite"}
                                {progress.status === 'completed' && "Generation Complete!"}
                                {progress.status === 'failed' && "Generation Failed"}
                            </CardTitle>

                            <p className="text-sm text-gray-600 mt-1 font-sans">
                                {progress.currentStep}
                            </p>

                            <Badge variant="outline" className="mt-2 text-xs">
                                Enhanced Pipeline • 6 Documents • 3 Stages
                            </Badge>
                        </div>

                        {progress.status !== 'completed' && (
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                className="font-sans"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Overall Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-700 font-sans">Overall Progress</span>
                            <span className="text-gray-600 font-sans">{Math.round(progress.progress)}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-3" />
                        {progress.estimatedTime && progress.estimatedTime > 0 && (
                            <p className="text-xs text-gray-500 font-sans">
                                Estimated time remaining: {formatTime(progress.estimatedTime)}
                            </p>
                        )}
                    </div>

                    {/* Stage-based Progress */}
                    {groupedDocuments && (
                        <div className="space-y-6">
                            <h3 className="font-medium text-gray-900 font-sans">Generation Pipeline</h3>

                            {Object.entries(groupedDocuments).map(([stageKey, stageDocs]) => {
                                const stage = stageConfig[stageKey as keyof typeof stageConfig];
                                const stageProgress = calculateStageProgress(stageDocs);
                                const isStageActive = stageDocs.some(doc => doc.status === 'processing');
                                const isStageComplete = stageDocs.every(doc => doc.status === 'completed');

                                return (
                                    <div key={stageKey} className="border rounded-lg p-4 space-y-4">
                                        {/* Stage Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stage.bgColor}`}>
                                                    {isStageComplete ? (
                                                        <CheckCircle2 className={`w-4 h-4 ${stage.color}`} />
                                                    ) : isStageActive ? (
                                                        <Loader2 className={`w-4 h-4 ${stage.color} animate-spin`} />
                                                    ) : (
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className={`font-medium ${stage.color} font-sans`}>{stage.name}</h4>
                                                    <p className="text-xs text-gray-500 font-sans">{stage.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-700 font-sans">{stageProgress}%</div>
                                                <div className="text-xs text-gray-500 font-sans">{stageDocs.length} document{stageDocs.length !== 1 ? 's' : ''}</div>
                                            </div>
                                        </div>

                                        {/* Stage Progress Bar */}
                                        <Progress value={stageProgress} className="h-2" />

                                        {/* Stage Documents */}
                                        <div className="grid gap-2 ml-11">
                                            {stageDocs.map((doc, index) => {
                                                const IconComponent = documentIconsV2[doc.type as keyof typeof documentIconsV2] || FileText;
                                                const config = statusConfig[doc.status];
                                                const StatusIcon = config.icon;

                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 border rounded-sm bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <IconComponent className="w-4 h-4 text-gray-600" />
                                                            <div>
                                                                <div className="font-medium text-sm text-gray-900 font-sans">
                                                                    {doc.name}
                                                                </div>
                                                                {doc.size && (
                                                                    <div className="text-xs text-gray-500 font-sans">
                                                                        {doc.size}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <Badge
                                                            variant="outline"
                                                            className={`${config.color} border-current font-sans text-xs`}
                                                        >
                                                            <StatusIcon className={`w-3 h-3 mr-1 ${config.animate === true ? 'animate-spin' : ''}`} />
                                                            {config.label}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Success Message */}
                    {progress.status === 'completed' && (
                        <div className="bg-green-50 border border-green-200 rounded-sm p-4">
                            <div className="flex items-center gap-2 text-green-800 mb-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-semibold font-sans">Success!</span>
                            </div>
                            <p className="text-sm text-green-700 font-sans">
                                Your enhanced documentation suite has been generated successfully.
                                You'll be redirected to your projects dashboard in a moment.
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {progress.status === 'failed' && (
                        <div className="bg-red-50 border border-red-200 rounded-sm p-4">
                            <div className="flex items-center gap-2 text-red-800 mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-semibold font-sans">Generation Failed</span>
                            </div>
                            <p className="text-sm text-red-700 mb-3 font-sans">
                                Something went wrong during the generation process. Please try again.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="font-sans"
                                >
                                    Close
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white font-sans"
                                >
                                    Retry Generation
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default GenerationProgressV2;