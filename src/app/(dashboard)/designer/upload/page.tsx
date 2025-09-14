// src/app/(dashboard)/designer/upload/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { DesignUpload } from '@/components/designer/design-upload';
import { designerApi } from '@/lib/api/designer';
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
      const designData = {
        title: metadata.title,
        description: metadata.description,
        categoryId: metadata.category, // This should be mapped to category ID
        tags: metadata.tags,
        price: parseFloat(metadata.price) || 0,
        designImages: files.map(f => f.file)
      };

      await designerApi.createDesign(designData);

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
