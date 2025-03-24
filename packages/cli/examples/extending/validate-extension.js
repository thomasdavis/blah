#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

// Check if a file path was provided
if (process.argv.length < 3) {
  console.error('Usage: node validate-extension.js <path-to-blah.json>');
  process.exit(1);
}

// Get the file path from command line args
const configPath = process.argv[2];

// Ensure the file exists
if (!fs.existsSync(configPath)) {
  console.error(`Error: File not found at ${configPath}`);
  process.exit(1);
}

// Read the file
try {
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configContent);
  
  console.log('Successfully parsed configuration file');
  
  // Check if the config has an extends property
  if (!config.extends || typeof config.extends !== 'object') {
    console.error('❌ No extends property found in the configuration');
    process.exit(1);
  }
  
  console.log(`✅ Found extends property with ${Object.keys(config.extends).length} extensions`);
  
  // Get the base directory for resolving relative paths
  const baseDir = path.dirname(path.resolve(configPath));
  
  // Check each extension
  for (const [name, extPath] of Object.entries(config.extends)) {
    console.log(`\nChecking extension: ${name} => ${extPath}`);
    
    if (!extPath || typeof extPath !== 'string') {
      console.error(`❌ Invalid extension path for ${name}`);
      continue;
    }
    
    // Skip URL paths
    if (extPath.startsWith('http://') || extPath.startsWith('https://')) {
      console.log(`✅ Valid URL path: ${extPath}`);
      console.log('ℹ️ Note: Cannot verify remote extension files');
      continue;
    }
    
    // Resolve relative paths
    const resolvedPath = path.resolve(baseDir, extPath);
    console.log(`Resolved path: ${resolvedPath}`);
    
    // Check if the extension file exists
    if (!fs.existsSync(resolvedPath)) {
      console.error(`❌ Extension file not found: ${resolvedPath}`);
      continue;
    }
    
    try {
      // Try to parse the extension file
      const extContent = fs.readFileSync(resolvedPath, 'utf-8');
      const extConfig = JSON.parse(extContent);
      
      console.log(`✅ Successfully parsed extension: ${name}`);
      
      // Check for basic properties
      if (!extConfig.name) {
        console.warn(`⚠️ Extension is missing 'name' property`);
      }
      
      if (!extConfig.version) {
        console.warn(`⚠️ Extension is missing 'version' property`);
      }
      
      // Check tools
      if (!Array.isArray(extConfig.tools)) {
        console.warn(`⚠️ Extension has no tools array`);
      } else {
        console.log(`ℹ️ Extension contains ${extConfig.tools.length} tools`);
        
        // Check for tool validity
        let validTools = 0;
        let invalidTools = 0;
        
        for (const tool of extConfig.tools) {
          if (!tool || typeof tool !== 'object') {
            invalidTools++;
            continue;
          }
          
          if (!tool.name) {
            console.warn(`⚠️ Tool missing 'name' property`);
            invalidTools++;
          } else {
            validTools++;
          }
        }
        
        console.log(`ℹ️ Valid tools: ${validTools}, Invalid tools: ${invalidTools}`);
      }
      
      // Check for circular extensions
      if (extConfig.extends && typeof extConfig.extends === 'object') {
        console.warn(`⚠️ Extension '${name}' has its own extends property, which may lead to circular references`);
      }
      
    } catch (error) {
      console.error(`❌ Error parsing extension ${name}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Extension validation complete');
  
} catch (error) {
  console.error(`Error parsing configuration: ${error.message}`);
  process.exit(1);
}