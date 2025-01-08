'use client'
import React, { useState } from 'react';
import {
    Typography,
    Box,
  } from "utils/genericExports/theme-imports";
  import { FileText, Image, File, FileType, Code } from 'lucide-react';

interface FilePreviewProps {
    file: File;
  }
  
  const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
    const [_, setPreview] = useState<string | null>(null);
  
    React.useEffect(() => {
      if (!file) return;
  
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            setPreview(result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }, [file]);
  
    const getFileIcon = () => {
      if (file.type.startsWith('image/')) {
        return <Image className="w-4 h-4 text-blue-500" />;
      } else if (file.type === 'application/pdf') {
        return <FileType className="w-4 h-4 text-red-500" />;
      } else if (file.type.startsWith('text/')) {
        return <FileText className="w-4 h-4 text-gray-500" />;
      } else if (file.type.includes('javascript') || file.type.includes('json') || file.type.includes('html')) {
        return <Code className="w-4 h-4 text-green-500" />;
      }
      return <File className="w-4 h-4 text-gray-500" />;
    };
  
    const getFileSize = () => {
      const bytes = file.size;
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
  
    return (
      <Box className="p-2 border rounded-lg bg-gray-50">
        <Box className="flex items-center space-x-2">
        Selected File:
          {getFileIcon()}
          <Box className="flex-1">
 
            <Typography className="font-semibold text-sm text-gray-900">
              {file.name}
            </Typography>
            <Typography className="text-xs text-gray-500">
              {getFileSize()} • {file.type || 'Unknown type'}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  
export default FilePreview;