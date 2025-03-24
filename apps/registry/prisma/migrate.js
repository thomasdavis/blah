// Script to run the initial migration
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Running Prisma migration...');

try {
  // Make sure the .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      console.log('⚠️ .env file not found, copying from .env.example');
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env file created from example');
    } else {
      console.error('❌ No .env or .env.example file found.');
      console.error('Please create a .env file with your database connection information.');
      process.exit(1);
    }
  }
  
  // Run Prisma generate
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Run Prisma migrate
  console.log('Running initial migration...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('✅ Migration completed successfully!');
  console.log('\nTo seed default providers, run:');
  console.log('  curl -X GET http://localhost:3000/api/db-init -H "Authorization: Bearer YOUR_ADMIN_API_KEY"');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}