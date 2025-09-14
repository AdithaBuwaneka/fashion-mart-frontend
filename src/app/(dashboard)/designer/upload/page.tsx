// src/app/(dashboard)/designer/upload/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const handleUpload = async (files: UploadFile[], metadata: DesignMetadata) => {
    try {
      console.log('Starting design upload...');
      const designData = {
        title: metadata.title,
        description: metadata.description,
        categoryId: metadata.category, // This should be mapped to category ID
        tags: metadata.tags,
        price: parseFloat(metadata.price) || 0,
        designImages: files.map(f => f.file)
      };

      console.log('Calling createDesign API...');
      const result = await designerApi.createDesign(designData);
      console.log('Design creation successful:', result);

      // Invalidate and refetch the designs list
      await queryClient.invalidateQueries({ queryKey: ['designer-designs'] });

      toast.success('Design uploaded successfully! It will be reviewed by our team.');
      console.log('Toast sent, navigating to portfolio...');
      router.push('/designer/portfolio');
    } catch (error: unknown) {
      console.error('Upload failed:', error);

      // Show specific error message if available
      let errorMessage = 'Failed to upload design. Please try again.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 400) {
          errorMessage = 'Invalid design data. Please check all fields and try again.';
        } else if (axiosError.response?.status === 413) {
          errorMessage = 'File(s) too large. Please reduce file size and try again.';
        }
      }

      toast.error(errorMessage);
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
