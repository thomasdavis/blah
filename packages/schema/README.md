# `@blahai/schema`

JSON Schema and validator for blah.json configuration files. This package provides tools to validate your blah.json configurations and ensure they follow the correct structure.

## Installation

```bash
npm install @blahai/schema
```

## Usage

### As a CLI Tool

```bash
npx blah-validate ./path/to/blah.json
```

### As a Library

```typescript
import { BlahValidator } from "@blahai/schema";

const validator = new BlahValidator();

const config = {
  name: "my-blah-manifest",
  version: "1.0.0",
  // ... rest of your config
};

const result = validator.validate(config);
if (result.valid) {
  console.log("Configuration is valid!");
} else {
  console.error("Validation errors:", result.errors);
}
```

## Schema Structure

A valid blah.json configuration must include:

- `name`: Name of your blah manifest
- `version`: Version of your manifest

Optional fields include:

- `alias`: Name used when tools are listed
- `description`: Description of your manifest
- `env`: Environment variables
- `tools`: Array of tool configurations
- `flows`: Array of flow configurations
- `prompts`: Reserved for future use
- `resources`: Reserved for future use
- `tags`: Array of string tags
- `config`: Additional configuration options

See the [example configuration](./examples/sample-blah.json) for a complete example.

## License

MIT
