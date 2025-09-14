'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { designerApi } from '@/lib/api/designer';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  File,
  Check,
  AlertCircle,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
}

interface DesignMetadata {
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
}

interface DesignUploadProps {
  onUpload?: (files: UploadFile[], metadata: DesignMetadata) => Promise<void>;
  onCancel?: () => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}


const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'image/tiff': ['.tif', '.tiff']
};

export function DesignUpload({
  onUpload,
  onCancel,
  maxFiles = 10,
  acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES)
}: DesignUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [metadata, setMetadata] = useState<DesignMetadata>({
    title: '',
    description: '',
    category: '',
    tags: [],
    price: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['designer-categories'],
    queryFn: designerApi.getCategories
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading' as const,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id);
    });
  }, []);

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          return {
            ...file,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'uploading'
          };
        }
        return file;
      }));
    }, 200);

    setTimeout(() => clearInterval(interval), 3000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = ACCEPTED_FILE_TYPES[type] || [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - uploadFiles.length,
    disabled: isUploading
  });

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !metadata.tags.includes(currentTag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!metadata.title || !metadata.category || uploadFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    try {
      await onUpload?.(uploadFiles, metadata);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = metadata.title && metadata.category && uploadFiles.length > 0;
  const allFilesUploaded = uploadFiles.every(file => file.status === 'completed');

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Design Files
          </CardTitle>
          <CardDescription>
            Drag and drop your design files or click to browse. 
            Accepted formats: JPG, PNG, SVG, PDF, TIFF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50",
              isUploading && "cursor-not-allowed opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop design files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum {maxFiles} files, up to 10MB each
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Files */}
          {uploadFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Uploaded Files ({uploadFiles.length})</h4>
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {uploadFile.preview ? (
                      <Image 
                        src={uploadFile.preview} 
                        alt={uploadFile.file.name}
                        width={48}
                        height={48}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <File className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{uploadFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    {/* Progress Bar */}
                    {uploadFile.status === 'uploading' && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'completed' && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Design Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Design Information</CardTitle>
          <CardDescription>
            Provide details about your design to help customers find it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Design Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Vintage Floral Pattern"
              value={metadata.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Describe your design, inspiration, and best use cases..."
              value={metadata.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              disabled={isUploading}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              value={metadata.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
              disabled={isUploading || categoriesLoading}
              className="w-full px-3 py-2 border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                disabled={isUploading}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addTag}
                disabled={!currentTag.trim() || isUploading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={isUploading}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Suggested Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={metadata.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata(prev => ({ ...prev, price: e.target.value }))}
              disabled={isUploading}
              min="0"
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Final pricing will be reviewed by the admin team
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!isFormValid || !allFilesUploaded || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Submit for Review'}
        </Button>
      </div>
    </div>
  );
}