// src/app/(dashboard)/designer/upload/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { DesignUpload } from '@/components/designer/design-upload';
import { toast } from 'sonner';

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

export default function DesignUploadPage() {
  const router = useRouter();

  const handleUpload = async (files: UploadFile[], metadata: DesignMetadata) => {
    try {
      // TODO: Replace with actual API call
      console.log('Uploading design:', { files, metadata });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Design uploaded successfully! It will be reviewed by our team.');
      router.push('/designer/portfolio');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload design. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/designer/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Upload New Design</h1>
        <p className="text-muted-foreground mt-2">
          Share your creative work with our community of fashion enthusiasts
        </p>
      </div>

      <DesignUpload
        onUpload={handleUpload}
        onCancel={handleCancel}
        maxFiles={5}
      />
    </div>
  );
}
