import React, { useEffect, useState } from 'react';
import { Download, File, AlertCircle, CheckCircle } from 'lucide-react';
import { agentService } from '../../services/agentService';

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await agentService.getDocuments();
      setDocuments(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await agentService.downloadDocument(documentId);
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download document:', error);
      setError('Failed to download document');
      setTimeout(() => setError(''), 4000);
    }
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'policy':
        return 'bg-blue-100 text-blue-800';
      case 'guide':
        return 'bg-green-100 text-green-800';
      case 'training':
        return 'bg-purple-100 text-purple-800';
      case 'compliance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <File className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-lg flex items-center gap-2 bg-red-50 text-red-800 border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading documents...</p>
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      <File className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{doc.fileName}</h3>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getDocumentTypeColor(
                            doc.documentType
                          )}`}
                        >
                          {doc.documentType}
                        </span>
                        <span className="text-xs text-gray-500">
                          Uploaded:{' '}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                        {doc.downloadCount > 0 && (
                          <span className="text-xs text-gray-500">
                            Downloads: {doc.downloadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc._id, doc.fileName)}
                    className="flex-shrink-0 p-3 ml-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <File className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 text-lg">No documents available yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Check back later for documents uploaded by the admin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
