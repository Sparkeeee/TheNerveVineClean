self.onmessage = async (event) => {
  if (event.data.type === 'connect') {
    try {
      const { url, command, args } = event.data.config;
      
      // Create a new process for the MCP connection
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      // Start the MCP connection
      const result = await execAsync(`${command} ${args.join(' ')}`);
      
      // Send the result back to the main thread
      self.postMessage({
        type: 'connection',
        result: result.stdout
      });

      // Listen for issues
      self.postMessage({
        type: 'issues',
        issues: [] // We'll need to implement the actual issue fetching logic
      });
    } catch (error) {
      self.postMessage({
        type: 'error',
        error: error.message
      });
    }
  }
};
