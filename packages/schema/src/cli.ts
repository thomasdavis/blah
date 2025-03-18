#!/usr/bin/env node
import { Command } from 'commander';
import { BlahValidator } from './index';
import { readFileSync } from 'fs';
import path from 'path';

const program = new Command();

program
  .name('blah-validate')
  .description('Validate blah.json configuration files')
  .argument('<file>', 'Path to blah.json file')
  .action((file) => {
    try {
      const validator = new BlahValidator();
      const filePath = path.resolve(file);
      const content = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      const result = validator.validate(data);
      
      if (result.valid) {
        console.log('✅ Configuration is valid');
        process.exit(0);
      } else {
        console.error('❌ Configuration is invalid:');
        console.error(JSON.stringify(result.errors, null, 2));
        process.exit(1);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
      process.exit(1);
    }
  });

program.parse();
