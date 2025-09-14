'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Design } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Eye, 
  Download, 
  Edit, 
  Trash2,
  MoreHorizontal,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DesignCardProps {
  design: Design & {
    views?: number;
    downloads?: number;
    sales?: number;
    revenue?: number;
    rating?: number;
  };
  onEdit?: (designId: string) => void;
  onDelete?: (designId: string) => void;
  onToggleApproval?: (designId: string) => void;
  className?: string;
  showActions?: boolean;
}

export function DesignCard({
  design,
  onEdit,
  onDelete,
  onToggleApproval,
  className,
  showActions = true
}: DesignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Helper function to convert backend file path to accessible URL
  const getImageUrl = (imagePath: string) => {
    console.log('Processing image path:', imagePath);

    if (!imagePath) {
      console.log('No image path provided, using placeholder');
      return '/images/placeholder-design.jpg';
    }

    // Convert backslashes to forward slashes
    const normalizedPath = imagePath.replace(/\\/g, '/');
    console.log('Normalized path:', normalizedPath);

    // Extract path after 'uploads/' - handle both relative and absolute paths
    const uploadsIndex = normalizedPath.lastIndexOf('/uploads/');
    console.log('Uploads index:', uploadsIndex);

    if (uploadsIndex !== -1) {
      const relativePath = normalizedPath.substring(uploadsIndex + 1); // +1 to exclude the leading slash
      const finalUrl = `http://localhost:5000/${relativePath}`;
      console.log('Image URL constructed:', {
        originalPath: imagePath,
        normalizedPath,
        uploadsIndex,
        relativePath,
        finalUrl
      });
      return finalUrl;
    }

    // If no 'uploads/' found, assume it's already a relative path
    const finalUrl = `http://localhost:5000/${normalizedPath}`;
    console.log('Image URL constructed (fallback):', { originalPath: imagePath, finalUrl });
    return finalUrl;
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (isApproved: boolean) => {
    return isApproved ? 'Approved' : 'Pending Review';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg border-0 bg-white dark:bg-gray-900",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Design Image */}
        <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
          <Image
            src={design.images?.[0] ? getImageUrl(design.images[0]) : '/images/placeholder-design.jpg'}
            alt={design.name || 'Design'}
            fill
            className={cn(
              "object-cover transition-all duration-300",
              isHovered && "scale-105",
              imageLoading && "blur-sm"
            )}
            onLoad={() => setImageLoading(false)}
          />
          
          {/* Overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300">
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/designer/designs/${design.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                {showActions && onEdit && (
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit(design.id);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", getStatusColor(design.isApproved))}
          >
            {getStatusText(design.isApproved)}
          </Badge>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(design.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Design
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/designer/designs/${design.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                {onToggleApproval && (
                  <DropdownMenuItem onClick={() => onToggleApproval(design.id)}>
                    <Star className="mr-2 h-4 w-4" />
                    {design.isApproved ? 'Remove Approval' : 'Request Approval'}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(design.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Design
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Design Title */}
          <h3 className="font-semibold text-foreground line-clamp-1">
            {design.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {design.description}
          </p>

          {/* Tags */}
          {design.tags && design.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {design.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {design.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{design.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{design.views || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{design.downloads || 0} downloads</span>
            </div>
            {design.sales !== undefined && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>{design.sales} sales</span>
              </div>
            )}
            {design.revenue !== undefined && (
              <div className="flex items-center gap-1">
                <span className="font-medium">${design.revenue.toFixed(0)}</span>
              </div>
            )}
          </div>

          {/* Creation Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(design.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      {design.rating && (
        <CardFooter className="pt-0 px-4 pb-4">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{design.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">rating</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}