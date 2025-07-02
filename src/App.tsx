import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';
import { AgentStatus } from './components/AgentStatus';

const API_BASE_URL = 'http://localhost:8000/api';

interface SearchResult {
  agent_used: string;
  answer: string;
  matched_candidates: string[];
}

function App() {
  const [resumeList, setResumeList] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState<{
    chunks: number;
  }>({ chunks: 0 });

  useEffect(() => {
    fetchStatus();
    fetchAllResumes();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (response.ok) {
        const status = await response.json();
        setDatabaseStatus(status);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const fetchAllResumes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes`);
      if (response.ok) {
        const data = await response.json();
        setResumeList(data.resumes || []);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    setIsProcessing(false);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Upload successful');
        setIsProcessing(true);

        // Poll for processing status
        const pollInterval = 2000;
        const maxRetries = 15;
        let attempts = 0;

        const pollStatus = async () => {
          attempts++;
          const statusRes = await fetch(`${API_BASE_URL}/status`);
          if (statusRes.ok) {
            const status = await statusRes.json();
            setDatabaseStatus(status);

            if (status.chunks > 0) {
              setIsProcessing(false);
              await fetchAllResumes();
              return;
            }
          }

          if (attempts < maxRetries) {
            setTimeout(pollStatus, pollInterval);
          } else {
            setIsProcessing(false);
            alert('Processing timed out. Please refresh and try again.');
          }
        };

        pollStatus();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }

    if (databaseStatus.chunks === 0) {
      alert('Please upload some resumes first!');
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setSearchResult(result);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert(`Search failed: ${error.message}`);
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {isProcessing && (
          <div className="text-center text-lg text-blue-600 font-semibold animate-pulse">
            ⏳ Processing uploaded resumes...
          </div>
        )}

        <AgentStatus 
          selectedAgent={searchResult?.agent_used || 'general_analyzer'} 
          isSearching={isSearching}
          databaseStatus={{
            status: isProcessing ? 'processing' : (databaseStatus.chunks > 0 ? 'ready' : 'empty'),
            total_resumes: resumeList.length,
            database_ready: databaseStatus.chunks > 0
          }}
        />
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <UploadSection 
              onUpload={handleUpload} 
              isUploading={isUploading}
            />
            <SearchSection 
              onSearch={handleSearch} 
              isSearching={isSearching}
              resumeCount={resumeList.length}
              databaseReady={databaseStatus.chunks > 0}
            />
          </div>
          
          <div>
            <ResultsSection 
              searchResult={searchResult}
              isSearching={isSearching}
              databaseReady={databaseStatus.chunks > 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
