'use client';

import { useEffect, useState } from 'react';
import { Book, Code, ExternalLink, Shield, Zap, CheckCircle } from 'lucide-react';

export default function APIDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load API spec:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">API Documentation</h1>
                <p className="text-sm text-gray-500">RemoteInbound API v1.0.0</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>OpenAPI Spec</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              RemoteInbound API Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive REST API for managing virtual events, users, speakers, and registrations. 
              Built with security, validation, and developer experience in mind.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Authenticated</h3>
              <p className="text-gray-600 text-sm">
                Protected with NextAuth.js and role-based access control
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Validated & Robust</h3>
              <p className="text-gray-600 text-sm">
                Input validation with Zod schemas and comprehensive error handling
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Developer Friendly</h3>
              <p className="text-gray-600 text-sm">
                Clear documentation, consistent responses, and detailed examples
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Start</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Base URL</h4>
                <code className="bg-gray-800 text-green-400 px-3 py-1 rounded text-sm">
                  {spec?.servers?.[0]?.url || 'http://localhost:3000'}
                </code>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Authentication</h4>
                <p className="text-gray-600 text-sm mb-2">
                  The API uses session-based authentication. Include your session cookie or bearer token:
                </p>
                <code className="bg-gray-800 text-green-400 px-3 py-1 rounded text-sm block">
                  Authorization: Bearer your-jwt-token
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h2>
          
          {spec && (
            <div className="space-y-8">
              {Object.entries(spec.paths || {}).map(([path, methods]: [string, any]) => (
                <div key={path} className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{path}</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(methods).map(([method, details]: [string, any]) => (
                      <div key={method} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded uppercase ${
                            method === 'get' ? 'bg-green-100 text-green-800' :
                            method === 'post' ? 'bg-blue-100 text-blue-800' :
                            method === 'put' ? 'bg-yellow-100 text-yellow-800' :
                            method === 'delete' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {method}
                          </span>
                          <h4 className="font-medium text-gray-900">{details.summary}</h4>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{details.description}</p>
                        
                        {details.requestBody && (
                          <div className="mb-3">
                            <h5 className="font-medium text-gray-800 text-sm mb-2">Request Body</h5>
                            <div className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                              <pre>{JSON.stringify(details.requestBody.content['application/json']?.schema, null, 2)}</pre>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h5 className="font-medium text-gray-800 text-sm mb-2">Responses</h5>
                          <div className="space-y-2">
                            {Object.entries(details.responses || {}).map(([status, response]: [string, any]) => (
                              <div key={status} className="flex items-center space-x-2 text-sm">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                  status.startsWith('2') ? 'bg-green-100 text-green-800' :
                                  status.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                                  status.startsWith('5') ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {status}
                                </span>
                                <span className="text-gray-600">{response.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Examples Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Example Requests</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Create a User</h3>
              <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre>{`curl -X POST ${spec?.servers?.[0]?.url || 'http://localhost:3000'}/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "company": "Tech Corp",
    "jobTitle": "Developer"
  }'`}</pre>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Get All Events</h3>
              <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre>{`curl -X GET ${spec?.servers?.[0]?.url || 'http://localhost:3000'}/api/events \\
  -H "Content-Type: application/json"`}</pre>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Update a User</h3>
              <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre>{`curl -X PUT ${spec?.servers?.[0]?.url || 'http://localhost:3000'}/api/users/{id} \\
  -H "Content-Type: application/json" \\
  -d '{
    "fullName": "John Smith",
    "jobTitle": "Senior Developer"
  }'`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Handling</h2>
          
          <p className="text-gray-600 mb-4">
            The API returns consistent error responses with detailed information to help you debug issues.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Validation Error (400)</h3>
              <div className="bg-gray-800 text-red-400 p-4 rounded-lg overflow-x-auto">
                <pre>{`{
  "error": "Validation failed",
  "details": {
    "validationErrors": [
      {
        "field": "email",
        "message": "Invalid email address"
      },
      {
        "field": "fullName",
        "message": "Full name is required"
      }
    ]
  }
}`}</pre>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Not Found Error (404)</h3>
              <div className="bg-gray-800 text-red-400 p-4 rounded-lg overflow-x-auto">
                <pre>{`{
  "error": "User not found"
}`}</pre>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Conflict Error (409)</h3>
              <div className="bg-gray-800 text-red-400 p-4 rounded-lg overflow-x-auto">
                <pre>{`{
  "error": "User with this email already exists"
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}