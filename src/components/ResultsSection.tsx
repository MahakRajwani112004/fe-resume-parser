import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Chip, Button, Divider, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react';
import { User, Star, Eye, Upload, Bot, FileText, ExternalLink } from 'lucide-react';

interface PreviewUrl {
  name: string;
  resume_url: string;
}

interface SearchResult {
  agent_used: string;
  answer: string;
  matched_candidates: string[];
  preview_urls?: PreviewUrl[];
}

interface ResultsSectionProps {
  searchResult: SearchResult | null;
  isSearching: boolean;
  databaseReady: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  searchResult, 
  isSearching, 
  databaseReady
}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedPreview, setSelectedPreview] = useState<PreviewUrl | null>(null);

const cleanAIAnswer = (text: string): string => {
  return text
    .replace(/[*_`#~>]/g, '')                          // Remove markdown symbols
    .replace(/^\s*[-*+] /gm, '')                       // Remove bullet points
    .replace(/^\s*\d+\.\s+/gm, '')                     // Remove numbered lists
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')                // Replace markdown links with text
    .replace(/\n{2,}/g, '\n\n')                        // Normalize multiple newlines
    .trim();
};


  const getAgentColor = (agent: string) => {
    const colors = {
      skill_matcher: 'success',
      experience_analyzer: 'warning', 
      relevancy_scorer: 'secondary',
      seniority_detector: 'primary',
      general_analyzer: 'default'
    };
    return colors[agent as keyof typeof colors] || 'default';
  };

  const formatAgentName = (agent: string) => {
    return agent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const ensurePDFPreviewUrl = (url: string): string => {
  // Add .pdf at the end if not present (rare case)
  if (!url.endsWith(".pdf")) {
    return url + ".pdf";
  }
  return url;
};


  // Extract actual candidates mentioned in the AI answer
 const extractCandidatesFromAnswer = (answer: string): string[] => {
  const candidates: string[] = [];

  const patterns: RegExp[] = [
    // **1. Nadia Delgado**
    /\*\*(?:\d+\.\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\*\*/g,

    // *Name:* Nadia Delgado
    /\*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+):\*/g,

    // Name: Nadia Delgado
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+):/gm,

    // Bulleted list: - Nadia Delgado or * Nadia Delgado
    /^[*-]\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gm,

    // Bold name without number: **Nadia Delgado**
    /\*\*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\*\*/g,

    // Numbered list with name (not bold): 1. Nadia Delgado
    /^\d+\.\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gm,

    // Uppercase names (e.g., ANTHONY KRASANO)
    /\b([A-Z]{2,}(?:\s+[A-Z]{2,})+)\b/g,

    // Fallback: simple First Last inside sentence
  ];

  const seen = new Set<string>();

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(answer)) !== null) {
      let name = match[1].trim();

      // Normalize name: Title Case (optional)
      name = name
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      if (name.length > 2 && !seen.has(name)) {
        candidates.push(name);
        seen.add(name);
      }
    }
  });

  return candidates;
};


  const handlePreview = (previewUrl: PreviewUrl) => {
    setSelectedPreview(previewUrl);
    onOpen();
  };

  if (isSearching) {
    return (
      <Card className="shadow-lg border-0 h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">AI agents processing your query...</p>
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-500">Analyzing resumes with AI</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!databaseReady) {
    return (
      <Card className="shadow-lg border-0 h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <Upload className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="text-gray-600">Upload resumes to get started</p>
            <p className="text-sm text-gray-500">Our AI agents will analyze and index them for intelligent searching</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!searchResult) {
    return (
      <Card className="shadow-lg border-0 h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <User className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="text-gray-600">Start searching to find matching candidates</p>
            <p className="text-sm text-gray-500">Our AI agents will analyze resumes for the best matches</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Extract actual candidates from AI answer
  const actualCandidates = extractCandidatesFromAnswer(searchResult.answer);
  const candidateCount = actualCandidates.length;

  return (
    <>
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-800">AI Analysis Results</h2>
              <Chip size="sm" color="primary" variant="flat">
                {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
              </Chip>
            </div>
            <Chip 
              color={getAgentColor(searchResult.agent_used)} 
              variant="flat"
              size="sm"
            >
              {formatAgentName(searchResult.agent_used)}
            </Chip>
          </div>
        </CardHeader>
        
        <CardBody className="pt-0 max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {/* AI Analysis */}
            <Card className="border border-blue-200 bg-blue-50/50">
              <CardBody className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">AI Agent Analysis</h3>
                    <p className="text-xs text-blue-600">
                      Analyzed by {formatAgentName(searchResult.agent_used)}
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {cleanAIAnswer(searchResult.answer)}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Divider />

            {/* Matched Candidates with Preview */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Matched Candidates ({candidateCount})
              </h3>
              
              <div className="space-y-3">
                {actualCandidates.map((candidate, index) => {
                  // Find matching preview URL for this candidate
                  const previewUrl = searchResult.preview_urls?.find(
                    p => p.name.toLowerCase().includes(candidate.toLowerCase()) || 
                         candidate.toLowerCase().includes(p.name.toLowerCase())
                  );

                  return (
                    <Card key={index} className="border border-gray-200">
                      <CardBody className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {candidate.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {candidate}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {previewUrl ? 'Resume available' : 'Candidate match'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {previewUrl ? (
                              <Button 
                                size="sm" 
                                variant="flat" 
                                color="primary" 
                                startContent={<Eye className="w-3 h-3" />}
                                onClick={() => handlePreview(previewUrl)}
                              >
                                Preview Resume
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="flat" 
                                color="default" 
                                startContent={<FileText className="w-3 h-3" />}
                                disabled
                              >
                                No Preview
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
                
                {candidateCount === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No specific candidates identified in this analysis</p>
                  </div>
                )}
              </div>

              {/* Show preview URLs that don't match extracted candidates */}
              {searchResult.preview_urls && searchResult.preview_urls.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">Additional Resume Previews:</h4>
                  <div className="space-y-2">
                    {searchResult.preview_urls.map((previewUrl, index) => (
                      <Card key={index} className="border border-gray-100">
                        <CardBody className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {previewUrl.name}
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="flat" 
                              color="secondary" 
                              startContent={<ExternalLink className="w-3 h-3" />}
                              onClick={() => handlePreview(previewUrl)}
                            >
                              View
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Resume Preview Modal */}
     <Modal 
  isOpen={isOpen} 
  onOpenChange={onOpenChange}
  size="5xl"
  scrollBehavior="inside"
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">
          <h3>Resume Preview: {selectedPreview?.name}</h3>
        </ModalHeader>
        <ModalBody className="p-0">
          {selectedPreview?.resume_url ? (
            <div className="w-full h-[80vh]">
              <iframe 
                src={ensurePDFPreviewUrl(selectedPreview.resume_url)}
                title={`Resume of ${selectedPreview.name}`}
                width="100%" 
                height="100%" 
                className="border-0"
              />
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>⚠️ Sorry, no preview available for this resume.</p>
            </div>
          )}
        </ModalBody>
      </>
    )}
  </ModalContent>
</Modal>

    </>
  );
};