const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function getLinearIssues() {
  try {
    // First, let's try to get the list of issues
    const { stdout: issuesOutput } = await execAsync('linear list issues');
    console.log('Raw issues output:', issuesOutput);
    
    // Now let's try to get specific issue details
    const { stdout: detailsOutput } = await execAsync('linear get issues');
    console.log('Raw details output:', detailsOutput);
    
    // Try to parse the output
    try {
      const issues = JSON.parse(issuesOutput);
      console.log('Parsed issues:', issues);
    } catch (parseError) {
      console.error('Failed to parse issues:', parseError);
      console.log('Raw output:', issuesOutput);
    }
  } catch (error) {
    console.error('Error executing Linear CLI:', error);
  }
}

getLinearIssues();
