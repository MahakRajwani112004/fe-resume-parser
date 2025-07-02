import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardBody, Button, Progress, Chip } from '@nextui-org/react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, isUploading }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploadProgress(0);
    setProcessedFiles([]);

    try {
      // Simulate progress for UI feedback
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(acceptedFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setProcessedFiles(acceptedFiles.map(f => f.name));
      
      // Reset after showing success
      setTimeout(() => {
        setUploadProgress(0);
        setProcessedFiles([]);
      }, 3000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
      setProcessedFiles([]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    disabled: isUploading
  });

  return (
    <Card className="shadow-lg border-0">
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Upload Resumes</h2>
          {isUploading && (
            <Chip size="sm" color="primary" variant="flat">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Processing...
            </Chip>
          )}
        </div>
        
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : isUploading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <FileText className={`w-12 h-12 mx-auto mb-4 ${
            isDragActive ? 'text-blue-500' : 
            isUploading ? 'text-gray-400' : 'text-gray-400'
          }`} />
          
          {isUploading ? (
            <div>
              <p className="text-gray-600 font-medium mb-2">Processing resumes with AI...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the PDF files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop PDF resumes here, or{' '}
                <span className="text-blue-600 font-medium">click to browse</span>
              </p>
              <p className="text-sm text-gray-500">Supports multiple PDF files</p>
            </div>
          )}
        </div>

        {(isUploading || uploadProgress > 0) && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {isUploading ? 'Processing with AI agents...' : 'Upload complete!'}
              </span>
              <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress 
              value={uploadProgress} 
              color="primary" 
              size="sm"
              className="max-w-full"
            />
            
            {processedFiles.length > 0 && (
              <div className="space-y-1">
                {processedFiles.map((filename, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{filename}</span>
                    <Chip size="sm" color="success" variant="flat">Processed</Chip>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};