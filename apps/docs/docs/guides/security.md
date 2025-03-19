---
sidebar_position: 7
---

# Security Best Practices

This guide covers security best practices for developing and deploying BLAH tools and MCP servers.

## Overview

Security is a critical consideration when building tools that can be accessed by AI agents. This guide will help you:

1. Secure your MCP server
2. Protect sensitive information
3. Implement proper authentication
4. Follow best practices for tool development

## Securing Your MCP Server

### Network Security

1. **Use HTTPS**: Always use HTTPS for production MCP servers
   ```bash
   # Example with Node.js https module
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('key.pem'),
     cert: fs.readFileSync('cert.pem')
   };
   
   https.createServer(options, app).listen(443);
   ```

2. **Implement Firewall Rules**: Restrict access to your MCP server
   ```bash
   # Example iptables rules
   iptables -A INPUT -p tcp --dport 3000 -s trusted-ip-address -j ACCEPT
   iptables -A INPUT -p tcp --dport 3000 -j DROP
   ```

3. **Use a Reverse Proxy**: Place your MCP server behind a reverse proxy like Nginx
   ```nginx
   # Example Nginx configuration
   server {
     listen 443 ssl;
     server_name mcp.example.com;
     
     ssl_certificate /path/to/cert.pem;
     ssl_certificate_key /path/to/key.pem;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

### Authentication

1. **API Keys**: Implement API key authentication
   ```typescript
   // Example middleware for API key validation
   function validateApiKey(req, res, next) {
     const apiKey = req.headers['x-api-key'];
     
     if (!apiKey || !isValidApiKey(apiKey)) {
       return res.status(401).json({ error: 'Invalid API key' });
     }
     
     next();
   }
   
   app.use(validateApiKey);
   ```

2. **JWT Authentication**: Use JSON Web Tokens for more complex authentication
   ```typescript
   // Example JWT validation
   import jwt from 'jsonwebtoken';
   
   function validateJwt(req, res, next) {
     const token = req.headers.authorization?.split(' ')[1];
     
     if (!token) {
       return res.status(401).json({ error: 'No token provided' });
     }
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       return res.status(401).json({ error: 'Invalid token' });
     }
   }
   
   app.use(validateJwt);
   ```

3. **Rate Limiting**: Implement rate limiting to prevent abuse
   ```typescript
   // Example rate limiting with express-rate-limit
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests, please try again later'
   });
   
   app.use(limiter);
   ```

## Protecting Sensitive Information

### Environment Variables

1. **Never hardcode secrets**: Use environment variables for all sensitive information
   ```typescript
   // Bad
   const apiKey = 'sk-1234567890abcdef';
   
   // Good
   const apiKey = process.env.API_KEY;
   ```

2. **Use a .env file with proper gitignore**: Store environment variables locally
   ```
   # .env file
   API_KEY=sk-1234567890abcdef
   DATABASE_URL=postgres://user:password@localhost/db
   JWT_SECRET=your-secret-key
   ```
   
   ```
   # .gitignore
   .env
   *.pem
   ```

3. **Use a secrets manager for production**: Consider AWS Secrets Manager, Google Secret Manager, or HashiCorp Vault
   ```typescript
   // Example with AWS Secrets Manager
   import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
   
   async function getSecret(secretName) {
     const client = new SecretsManagerClient();
     const command = new GetSecretValueCommand({ SecretId: secretName });
     const response = await client.send(command);
     return JSON.parse(response.SecretString);
   }
   
   // Usage
   const secrets = await getSecret('mcp-server/production');
   const apiKey = secrets.API_KEY;
   ```

### Data Protection

1. **Encrypt sensitive data**: Use encryption for storing sensitive data
   ```typescript
   // Example with crypto module
   import crypto from 'crypto';
   
   function encrypt(text, key) {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
     let encrypted = cipher.update(text);
     encrypted = Buffer.concat([encrypted, cipher.final()]);
     return iv.toString('hex') + ':' + encrypted.toString('hex');
   }
   
   function decrypt(text, key) {
     const parts = text.split(':');
     const iv = Buffer.from(parts[0], 'hex');
     const encryptedText = Buffer.from(parts[1], 'hex');
     const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
     let decrypted = decipher.update(encryptedText);
     decrypted = Buffer.concat([decrypted, decipher.final()]);
     return decrypted.toString();
   }
   ```

2. **Sanitize logs**: Never log sensitive information
   ```typescript
   // Bad
   console.log(`User authenticated with token: ${token}`);
   
   // Good
   console.log('User authenticated successfully');
   ```

3. **Implement proper error handling**: Don't expose sensitive information in errors
   ```typescript
   // Bad
   try {
     // Code that might fail
   } catch (error) {
     return res.status(500).json({ error: error.message, stack: error.stack });
   }
   
   // Good
   try {
     // Code that might fail
   } catch (error) {
     console.error('Internal error:', error);
     return res.status(500).json({ error: 'An internal error occurred' });
   }
   ```

## Secure Tool Development

### Input Validation

1. **Validate all inputs**: Use JSON Schema validation
   ```typescript
   import Ajv from 'ajv';
   
   const ajv = new Ajv();
   
   const schema = {
     type: 'object',
     properties: {
       query: { type: 'string' },
       limit: { type: 'number', minimum: 1, maximum: 100 }
     },
     required: ['query'],
     additionalProperties: false
   };
   
   const validate = ajv.compile(schema);
   
   function validateInput(input) {
     if (!validate(input)) {
       throw new Error('Invalid input: ' + ajv.errorsText(validate.errors));
     }
     return input;
   }
   ```

2. **Sanitize inputs**: Prevent injection attacks
   ```typescript
   // Example sanitizing SQL inputs
   import { escape } from 'sqlstring';
   
   function querySafe(userId) {
     const safeUserId = escape(userId);
     return `SELECT * FROM users WHERE id = ${safeUserId}`;
   }
   ```

3. **Validate URLs and file paths**: Prevent path traversal and SSRF
   ```typescript
   // Example URL validation
   function validateUrl(url) {
     const parsed = new URL(url);
     const allowedDomains = ['api.example.com', 'cdn.example.com'];
     
     if (!allowedDomains.includes(parsed.hostname)) {
       throw new Error('Domain not allowed');
     }
     
     return url;
   }
   
   // Example path validation
   import path from 'path';
   
   function validatePath(userPath) {
     const normalizedPath = path.normalize(userPath);
     const basePath = '/safe/directory';
     
     if (!normalizedPath.startsWith(basePath)) {
       throw new Error('Path traversal detected');
     }
     
     return normalizedPath;
   }
   ```

### Code Security

1. **Keep dependencies updated**: Regularly update dependencies to patch vulnerabilities
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Update dependencies
   npm update
   ```

2. **Use security linters**: Implement security-focused linting
   ```bash
   # Install ESLint security plugins
   npm install eslint-plugin-security
   
   # Add to .eslintrc
   {
     "plugins": ["security"],
     "extends": ["plugin:security/recommended"]
   }
   ```

3. **Implement Content Security Policy**: Protect against XSS in web interfaces
   ```typescript
   // Example with Helmet for Express
   import helmet from 'helmet';
   
   app.use(helmet.contentSecurityPolicy({
     directives: {
       defaultSrc: ["'self'"],
       scriptSrc: ["'self'", "'unsafe-inline'"],
       styleSrc: ["'self'", "'unsafe-inline'"],
       imgSrc: ["'self'", 'data:']
     }
   }));
   ```

## Deployment Security

### Container Security

If deploying with Docker:

1. **Use official base images**: Start with trusted base images
   ```dockerfile
   # Good
   FROM node:18-alpine
   
   # Bad
   FROM unknown-registry/node:latest
   ```

2. **Run as non-root user**: Reduce privileges
   ```dockerfile
   # Create a non-root user
   RUN addgroup -g 1001 -S appuser && \
       adduser -u 1001 -S appuser -G appuser
   
   # Switch to non-root user
   USER appuser
   ```

3. **Scan container images**: Check for vulnerabilities
   ```bash
   # Using Docker Scan
   docker scan your-image:tag
   ```

### Cloud Security

1. **Use IAM roles with least privilege**: Restrict permissions
   ```json
   // Example AWS IAM policy with minimal permissions
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket/your-prefix/*"
       }
     ]
   }
   ```

2. **Enable audit logging**: Track all access and changes
   ```bash
   # Example enabling AWS CloudTrail
   aws cloudtrail create-trail \
     --name mcp-server-trail \
     --s3-bucket-name your-logging-bucket \
     --is-multi-region-trail
   ```

3. **Use private networking**: Isolate your services
   ```bash
   # Example creating a VPC in AWS
   aws ec2 create-vpc --cidr-block 10.0.0.0/16
   ```

## Security Monitoring

### Logging and Monitoring

1. **Implement structured logging**: Use a consistent format
   ```typescript
   // Example with Winston
   import winston from 'winston';
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     defaultMeta: { service: 'mcp-server' },
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **Set up alerts**: Get notified of suspicious activity
   ```typescript
   // Example alert on multiple failed authentication attempts
   function checkAuthFailures(userId, failures) {
     if (failures > 5) {
       sendAlert(`Multiple authentication failures for user ${userId}`);
     }
   }
   ```

3. **Regular security audits**: Schedule periodic reviews
   ```
   # Security audit checklist
   1. Review access logs
   2. Check for outdated dependencies
   3. Verify proper configuration
   4. Test authentication mechanisms
   5. Review error handling
   ```

## Security Checklist

Use this checklist to ensure you've covered the key security aspects:

- [ ] HTTPS enabled for all production endpoints
- [ ] Authentication implemented for all API endpoints
- [ ] Rate limiting configured
- [ ] Input validation for all parameters
- [ ] No hardcoded secrets or credentials
- [ ] Dependencies regularly updated
- [ ] Error handling that doesn't leak sensitive information
- [ ] Logging configured (without sensitive data)
- [ ] Proper access controls implemented
- [ ] Security headers configured
- [ ] Regular security testing

## Additional Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Web Security Academy](https://portswigger.net/web-security)

## Next Steps

- [Troubleshooting Guide](./troubleshooting.md)
- [API Integration](./api-integration.md)
- [Hosting Guide](./hosting.md)
