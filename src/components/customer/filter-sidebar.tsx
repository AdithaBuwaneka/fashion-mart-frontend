'use client';

import { useState } from 'react';
import { ProductFilters, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  className?: string;
}

export function FilterSidebar({
  categories,
  filters,
  onFiltersChange,
  className
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    size: true,
    color: true
  });

  const priceRange = filters.priceRange || [0, 500];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Purple', hex: '#8B5CF6' }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? categoryName : undefined
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: value as [number, number]
    });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const currentSizes = filters.sizes || [];
    const newSizes = checked
      ? [...currentSizes, size]
      : currentSizes.filter(s => s !== size);
    
    onFiltersChange({
      ...filters,
      sizes: newSizes.length > 0 ? newSizes : undefined
    });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const currentColors = filters.colors || [];
    const newColors = checked
      ? [...currentColors, color]
      : currentColors.filter(c => c !== color);
    
    onFiltersChange({
      ...filters,
      colors: newColors.length > 0 ? newColors : undefined
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && 
      value !== null && 
      value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: string; 
    children: React.ReactNode;
  }) => (
    <Card>
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => toggleSection(section)}
      >
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {title}
          {expandedSections[section] ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CardTitle>
      </CardHeader>
      {expandedSections[section] && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category" section="category">
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`category-${category.id}`}
                name="category"
                checked={filters.category === category.name}
                onChange={(e) => 
                  handleCategoryChange(category.name, e.target.checked)
                }
                className="w-4 h-4 text-blue-600"
              />
              <Label 
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-4">
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Size" section="size">
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`size-${size}`}
                checked={filters.sizes?.includes(size) || false}
                onChange={(e) => 
                  handleSizeChange(size, e.target.checked)
                }
                className="w-4 h-4 text-blue-600"
              />
              <Label 
                htmlFor={`size-${size}`}
                className="text-sm font-normal cursor-pointer"
              >
                {size}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Color" section="color">
        <div className="grid grid-cols-4 gap-2">
          {availableColors.map((color) => (
            <div key={color.name} className="flex flex-col items-center space-y-1">
              <button
                onClick={() => handleColorChange(color.name, !filters.colors?.includes(color.name))}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all",
                  filters.colors?.includes(color.name)
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
              <span className="text-xs text-gray-600">{color.name}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Additional Filters */}
      <FilterSection title="Availability" section="availability">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="in-stock"
              checked={filters.inStock || false}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <Label 
              htmlFor="in-stock"
              className="text-sm font-normal cursor-pointer"
            >
              In Stock Only
            </Label>
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
