// Script to initialize the database through the API
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/db-init',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer admin-api-key-for-development'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  process.exit(1);
});

req.end();

console.log('Sending request to initialize database...');