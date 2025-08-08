import { useEffect, useState } from 'react';

export default function LinearIssuesPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mcp = new Worker(new URL('mcp-worker.ts', import.meta.url));

    mcp.onmessage = (event) => {
      if (event.data.type === 'issues') {
        setIssues(event.data.issues);
      } else if (event.data.type === 'error') {
        setError(event.data.error);
      }
    };

    mcp.postMessage({
      type: 'connect',
      config: {
        url: 'https://mcp.linear.app/sse',
        command: 'npx',
        args: ['-y', 'mcp-remote', 'https://mcp.linear.app/sse']
      }
    });

    return () => {
      mcp.terminate();
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Linear Issues</h1>
      {issues.length > 0 ? (
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>
              <h2>{issue.title}</h2>
              <p>{issue.description}</p>
              <p>Status: {issue.state}</p>
              <p>Priority: {issue.priority}</p>
              <p>Created: {new Date(issue.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading issues...</p>
      )}
    </div>
  );
}
