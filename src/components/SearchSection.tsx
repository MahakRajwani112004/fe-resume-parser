import React, { useState, useCallback } from 'react';
import { Card, CardBody, Input, Button, Chip } from '@nextui-org/react';
import { Search, Database, Zap, AlertCircle } from 'lucide-react';
import { debounce } from '../utils/debounce';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  resumeCount: number;
  databaseReady: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ 
  onSearch, 
  isSearching, 
  resumeCount,
  databaseReady
}) => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 800),
    [onSearch]
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim().length > 2) {
      debouncedSearch(value);
    }
  };

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery);
    onSearch(quickQuery);
  };

  const quickSearches = [
    'React developers with 5+ years experience',
    'Python machine learning engineers',
    'Senior full-stack developers',
    'JavaScript and Node.js experts',
    'DevOps engineers with AWS experience'
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">AI-Powered Search</h2>
          <Chip 
            size="sm" 
            color={databaseReady ? "primary" : "warning"} 
            variant="flat"
          >
            <Database className="w-3 h-3 mr-1" />
            {resumeCount} resumes
          </Chip>
        </div>

        {!databaseReady && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Upload some resumes first to start searching!
              </span>
            </div>
          </div>
        )}

        <Input
          placeholder="Describe the ideal candidate (e.g., 'React developer with 3+ years experience')"
          value={query}
          onValueChange={handleQueryChange}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          size="lg"
          variant="bordered"
          className="mb-4"
          isDisabled={isSearching || !databaseReady}
        />

        {isSearching && (
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">AI agents analyzing resumes...</span>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Quick searches:</p>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((quickSearch, index) => (
              <Button
                key={index}
                variant="flat"
                size="sm"
                color="primary"
                onClick={() => handleQuickSearch(quickSearch)}
                className="text-xs"
                isDisabled={isSearching || !databaseReady}
              >
                {quickSearch}
              </Button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};