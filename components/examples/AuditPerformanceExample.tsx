/**
 * Example React component showing how to use the Audit Performance API
 * 
 * This is a sample implementation that you can adapt for your needs.
 */

'use client';

import { useState } from 'react';

interface AuditResult {
  overall_score: number;
  overall_grade: string;
  performance_level: string;
  sections: Record<string, any>;
  audit_meta: {
    url: string;
    timestamp: number;
    runtime_sec: number;
  };
}

export default function AuditPerformanceExample() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/audit/run-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          selected_topics: [
            'Brand Messaging',
            'Website SEO',
            'Content Marketing',
            'Social Media',
          ],
          debug: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Audit failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async () => {
    if (!url) return;

    try {
      const response = await fetch(`/api/audit/history?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.success) {
        console.log('Audit history:', data.audits);
        alert(`Found ${data.count} previous audits for this URL`);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Audit Performance</h1>

      <div className="space-y-4">
        {/* Input Section */}
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={loading}
          />
          <button
            onClick={runAudit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Audit...' : 'Run Audit'}
          </button>
          <button
            onClick={getHistory}
            disabled={loading || !url}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            History
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing website... This may take 30-60 seconds.</p>
          </div>
        )}

        {/* Results Display */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold">{result.overall_score}</span>
                <div>
                  <div className="text-2xl font-semibold">{result.overall_grade}</div>
                  <div className="text-lg opacity-90">{result.performance_level}</div>
                </div>
              </div>
              <div className="mt-4 text-sm opacity-90">
                Analyzed in {result.audit_meta?.runtime_sec}s
              </div>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-bold mb-4">Section Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.sections || {}).map(([key, section]: [string, any]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold capitalize">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      <span className="text-2xl font-bold text-blue-600">
                        {section.score}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Confidence: {section.confidence}
                    </div>
                    {section.findings && section.findings.length > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Top Finding:</span>
                        <p className="text-gray-600 mt-1">{section.findings[0].title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <a
                href={`/api/audit/download/json?filename=${result.audit_meta?.url?.replace(/[^a-z0-9]/gi, '_')}.json`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                download
              >
                Download JSON
              </a>
              <a
                href={`/api/audit/download/md?filename=${result.audit_meta?.url?.replace(/[^a-z0-9]/gi, '_')}.md`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                download
              >
                Download Report
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
