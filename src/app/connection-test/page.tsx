'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  response?: unknown;
}

export default function ConnectionTestPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const apiTests = [
    {
      name: 'Backend Health Check',
      url: '/api/health',
      description: 'Test basic backend connectivity'
    },
    {
      name: 'Products API',
      url: '/api/products',
      description: 'Test public products endpoint'
    },
    {
      name: 'Categories API',
      url: '/api/categories',
      description: 'Test categories endpoint'
    }
  ];

  const runTest = async (test: typeof apiTests[0]): Promise<TestResult> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const fullUrl = `${apiUrl}${test.url.replace('/api', '')}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          name: test.name,
          status: 'success',
          message: `✅ ${test.name} passed`,
          response: data
        };
      } else {
        return {
          name: test.name,
          status: 'error',
          message: `❌ ${test.name} failed: ${data.message || response.statusText}`,
          response: data
        };
      }
    } catch (error) {
      return {
        name: test.name,
        status: 'error',
        message: `❌ ${test.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        response: null
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Initialize tests with pending status
    const initialTests = apiTests.map(test => ({
      name: test.name,
      status: 'pending' as const,
      message: `🔄 Running ${test.name}...`
    }));
    setTests(initialTests);

    // Run tests sequentially
    for (let i = 0; i < apiTests.length; i++) {
      const test = apiTests[i];
      const result = await runTest(test);
      
      setTests(prev => prev.map((t, index) => 
        index === i ? result : t
      ));
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Running</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  useEffect(() => {
    // Run tests automatically when component mounts
    const runInitialTests = async () => {
      setIsRunning(true);
      setTests([]);

      const testsToRun = [
        {
          name: 'Backend Health Check',
          url: '/api/health',
          description: 'Test basic backend connectivity'
        },
        {
          name: 'Products API',
          url: '/api/products',
          description: 'Test public products endpoint'
        },
        {
          name: 'Categories API',
          url: '/api/categories',
          description: 'Test categories endpoint'
        }
      ];

      // Initialize tests with pending status
      const initialTests = testsToRun.map(test => ({
        name: test.name,
        status: 'pending' as const,
        message: `🔄 Running ${test.name}...`
      }));
      setTests(initialTests);

      // Run tests sequentially
      for (let i = 0; i < testsToRun.length; i++) {
        const test = testsToRun[i];
        
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const fullUrl = `${apiUrl}${test.url.replace('/api', '')}`;
          
          const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          const result = response.ok ? {
            name: test.name,
            status: 'success' as const,
            message: `✅ ${test.name} passed`,
            response: data
          } : {
            name: test.name,
            status: 'error' as const,
            message: `❌ ${test.name} failed: ${data.message || response.statusText}`,
            response: data
          };

          setTests(prev => prev.map((t, index) => 
            index === i ? result : t
          ));
        } catch (error) {
          const result = {
            name: test.name,
            status: 'error' as const,
            message: `❌ ${test.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            response: null
          };

          setTests(prev => prev.map((t, index) => 
            index === i ? result : t
          ));
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setIsRunning(false);
    };

    runInitialTests();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Backend Connection Test</h1>
        <p className="text-gray-600">
          Testing connectivity between frontend and backend services.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Current API configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
            </div>
            <div>
              <strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
            </div>
            <div>
              <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Tests</CardTitle>
              <CardDescription>Testing backend API endpoints</CardDescription>
            </div>
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="ml-4"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Tests'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiTests.map((test, index) => {
              const result = tests[index];
              return (
                <div key={test.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {result ? getStatusIcon(result.status) : <AlertCircle className="h-5 w-5 text-gray-400" />}
                      <div>
                        <h3 className="font-semibold">{test.name}</h3>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                    </div>
                    {result && getStatusBadge(result.status)}
                  </div>
                  
                  {result && (
                    <div className="mt-2">
                      <p className="text-sm">{result.message}</p>
                      {result.response && (
                        <details className="mt-2">
                          <summary className="text-sm text-gray-600 cursor-pointer">
                            View Response
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(result.response, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tests.filter(t => t.status === 'success').length}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {tests.filter(t => t.status === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {tests.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Running</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
