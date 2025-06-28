'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Scan, 
  FileText, 
  XCircle,
  Download,
  Camera,
  AlertCircle
} from 'lucide-react';

interface ScanResult {
  id: string;
  filename: string;
  extractedData: {
    vendorName?: string;
    totalAmount?: number;
    date?: string;
    items?: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    taxAmount?: number;
    confidence: number;
  };
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export function BillScanner() {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const scanBillMutation = useMutation({
    mutationFn: async (file: File): Promise<ScanResult> => {
      const formData = new FormData();
      formData.append('bill', file);
      
      const response = await apiClient.post('/admin/bill-scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (result) => {
      setScanResults(prev => [result, ...prev]);
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error('Bill scan failed:', error);
      setIsProcessing(false);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsProcessing(true);
      scanBillMutation.mutate(acceptedFiles[0]);
    }
  }, [scanBillMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const getStatusBadge = (status: ScanResult['status']) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportToCSV = (result: ScanResult) => {
    const csvContent = [
      ['Field', 'Value'],
      ['Vendor', result.extractedData.vendorName || 'N/A'],
      ['Total Amount', result.extractedData.totalAmount?.toString() || 'N/A'],
      ['Date', result.extractedData.date || 'N/A'],
      ['Tax Amount', result.extractedData.taxAmount?.toString() || 'N/A'],
      ['Confidence', `${result.extractedData.confidence}%`],
      ['Items', ''],
      ...(result.extractedData.items?.map(item => [
        item.description, 
        `Qty: ${item.quantity}, Price: $${item.price}`
      ]) || [])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bill-scan-${result.id}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Bill Scanner</h1>
          <p className="text-gray-600 mt-2">
            Upload bill images for automatic data extraction using Google Vision AI
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Bill Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop the bill here' : 'Drag & drop a bill image'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse (JPEG, PNG, PDF - max 10MB)
                </p>
              </div>
              <Button variant="outline" type="button">
                <FileText className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
          {isProcessing && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-blue-700 font-medium">
                  Processing bill with AI... This may take a few moments.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Scan Results ({scanResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanResults.map((result) => (
                <div
                  key={result.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{result.filename}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(result.status)}
                      <Button variant="ghost" size="sm" onClick={() => exportToCSV(result)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {result.status === 'completed' && result.extractedData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">Basic Information</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vendor:</span>
                            <span className="font-medium">
                              {result.extractedData.vendorName || 'Not detected'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">
                              {result.extractedData.date || 'Not detected'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-medium">
                              ${result.extractedData.totalAmount?.toFixed(2) || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span className="font-medium">
                              ${result.extractedData.taxAmount?.toFixed(2) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">AI Confidence</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.extractedData.confidence >= 80
                                  ? 'bg-green-500'
                                  : result.extractedData.confidence >= 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${result.extractedData.confidence}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${getConfidenceColor(result.extractedData.confidence)}`}>
                            {result.extractedData.confidence}%
                          </span>
                        </div>
                        {result.extractedData.confidence < 60 && (
                          <div className="flex items-center space-x-1 text-yellow-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>Low confidence - manual review recommended</span>
                          </div>
                        )}
                      </div>

                      {result.extractedData.items && result.extractedData.items.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-700">
                            Items ({result.extractedData.items.length})
                          </h4>
                          <div className="max-h-32 overflow-y-auto text-sm space-y-1">
                            {result.extractedData.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span className="truncate pr-2">{item.description}</span>
                                <span className="text-gray-600 whitespace-nowrap">
                                  {item.quantity}x ${item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {result.status === 'failed' && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <XCircle className="h-4 w-4" />
                      <span>Failed to process bill. Please try with a clearer image.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {scanResults.length === 0 && !isProcessing && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scan className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scans yet</h3>
            <p className="text-gray-500">
              Upload your first bill image to get started with AI-powered data extraction.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
