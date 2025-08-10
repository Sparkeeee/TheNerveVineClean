const https = require('https');

// Linear API script to create an issue
// You'll need to get your API key from Linear app settings

const LINEAR_API_KEY = process.env.LINEAR_API_KEY || 'YOUR_API_KEY_HERE';
const TEAM_ID = process.env.LINEAR_TEAM_ID || 'YOUR_TEAM_ID_HERE';

const issueData = {
  title: "Product Integration Automation Strategy",
  description: `## Objective
Maximize automation for product integration to achieve fastest possible implementation with maximum efficiency.

## Key Requirements
- **Speed**: Implement integration as quickly as possible
- **Automation**: Maximize automated processes
- **Scalability**: Ensure solution can handle growth
- **Reliability**: Maintain data integrity and system stability

## Technical Considerations
- API integrations and webhooks
- Automated data synchronization
- Error handling and monitoring
- Performance optimization
- Security best practices

## Success Metrics
- Time to implementation
- Level of automation achieved
- System reliability
- User adoption rate

## Priority: High
## Labels: automation, integration, product, optimization`,
  teamId: TEAM_ID,
  priority: 2, // High priority
  labels: ["automation", "integration", "product", "optimization"]
};

function createLinearIssue() {
  const postData = JSON.stringify(issueData);
  
  const options = {
    hostname: 'api.linear.app',
    port: 443,
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': `Bearer ${LINEAR_API_KEY}`
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e);
  });

  req.write(postData);
  req.end();
}

console.log('Linear Issue Creation Script');
console.log('============================');
console.log('');
console.log('To use this script:');
console.log('1. Get your Linear API key from Settings > API');
console.log('2. Get your Team ID from the Linear app');
console.log('3. Set environment variables:');
console.log('   LINEAR_API_KEY=your_key_here');
console.log('   LINEAR_TEAM_ID=your_team_id_here');
console.log('4. Run: node create-linear-issue.js');
console.log('');
console.log('Issue to be created:');
console.log('Title: Product Integration Automation Strategy');
console.log('Priority: High');
console.log('Labels: automation, integration, product, optimization');
console.log('');
console.log('Manual creation steps:');
console.log('1. Go to linear.app');
console.log('2. Click "New Issue"');
console.log('3. Use the title and description above');
console.log('4. Set priority to High');
console.log('5. Add labels: automation, integration, product, optimization');
