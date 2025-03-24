# CLAUDE.md - Agent Guidelines for BLAH Playground

## Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
- `pnpm check-types` - Check typescript types

## Code Style Guidelines
- **Imports**: Group imports as React → external packages → internal modules with '@/' aliases
- **Components**: Use functional components with explicit return types
- **Types**: Define interfaces for props and state, prefer explicit typing over 'any'
- **Error Handling**: Use try/catch with specific error types, provide user-friendly messages
- **Naming**: PascalCase for components, camelCase for functions/variables, lowercase-hyphen for files
- **File Structure**: Place components in src/components, pages in src/app
- **State Management**: Use React hooks (useState, useEffect) for component state
- **CSS**: Use Tailwind utility classes for styling

## Project Structure
- Next.js application with TypeScript and Tailwind CSS
- UI components from shared @repo/ui workspace package
- AI functionality from @repo/ai package
- Integration with @blahai/cli and @blahai/schema packages

## Important Notes
- ALWAYS use our wrapped packages (@repo/ai) instead of importing direct dependencies
- ALWAYS use the latest versions of libraries (ai v4.2.1, @ai-sdk/openai v1.3.0)
- The @repo/ai package is purely for making client-side calls to AI tools - it does not contain server components
- Dependencies should be kept clean - only include what is actually used

## Project Notes
This playground allows testing blah.json configurations with an MCP server:
1. Configure OpenAI API key and blah.json in the Monaco editor
2. Start the MCP server with STDIO communication
3. View and interact with tools provided by the MCP server
4. Uses the @repo/ai package which provides OpenAI and MCP-STDIO integrations