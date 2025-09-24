import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Button } from './ui/button';

const AuthTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testAuthHeader = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      console.log('🧪 Testing authorization header...');
      
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      console.log('Token in localStorage:', token ? 'Exists' : 'Not found');
      
      // Make a test request (you can change this endpoint to any protected endpoint)
      const response = await apiClient.get('/orders?page=0&size=1');
      
      setTestResult(`✅ Request successful! Status: ${response.status}`);
      console.log('✅ Test request successful:', response);
      
    } catch (error: any) {
      console.error('❌ Test request failed:', error);
      
      if (error.response) {
        setTestResult(`❌ Request failed! Status: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        setTestResult('❌ No response received from server');
      } else {
        setTestResult(`❌ Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found:', token.substring(0, 20) + '...');
      setTestResult(`Token found: ${token.substring(0, 20)}...`);
    } else {
      console.log('No token found');
      setTestResult('No token found in localStorage');
    }
  };

  const setTestToken = () => {
    // Set a dummy token for testing
    const testToken = 'test-token-123456789';
    localStorage.setItem('token', testToken);
    setTestResult(`Test token set: ${testToken}`);
    console.log('Test token set:', testToken);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Authorization Header Test</h3>
      
      <div className="space-y-2 mb-4">
        <Button onClick={checkToken} variant="outline" size="sm">
          Check Token
        </Button>
        
        <Button onClick={setTestToken} variant="outline" size="sm">
          Set Test Token
        </Button>
        
        <Button 
          onClick={testAuthHeader} 
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? 'Testing...' : 'Test API Request'}
        </Button>
      </div>
      
      {testResult && (
        <div className="p-3 bg-white border rounded text-sm">
          <pre>{testResult}</pre>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-600">
        <p>📝 Instructions:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open browser DevTools (F12)</li>
          <li>Go to Console tab to see logs</li>
          <li>Go to Network tab to inspect requests</li>
          <li>Click "Test API Request" and check the request headers</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthTest;