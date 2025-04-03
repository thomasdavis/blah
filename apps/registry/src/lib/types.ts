export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Tool {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  author_name: string;
  author_id?: number;
  latest_version?: string;
  versions?: ToolVersion[];
  tags?: string[];
}

export interface ToolVersion {
  id: number;
  version: string;
  published_at: string;
  deprecated: boolean;
  code?: string;
  manifest?: any;
  tool_name?: string;
  tool_description?: string;
  author_name?: string;
  providers?: ProviderConfig[];
}

export interface ProviderConfig {
  provider_name: string;
  provider_description: string;
  config: any;
}

export interface ApiKey {
  id: number;
  name: string;
  created_at: string;
  expires_at: string;
}

export interface NewTool {
  name: string;
  description: string | null;
  version: string;
  code: string;
  manifest: Record<string, any>;
  tags: string[];
  providers?: { provider: string; config: any }[];
}

export interface PublishResponse {
  success: boolean;
  toolId?: number;
  version?: string;
  error?: string;
}

// Registry Manifest (similar to package.json)
export interface RegistryManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  dependencies?: Record<string, string>;
  providers?: {
    [provider: string]: {
      entrypoint?: string;
      runtime?: string;
      env?: Record<string, string>;
      resources?: Record<string, any>;
    };
  };
  tags?: string[];
  repository?: string;
  homepage?: string;
  keywords?: string[];
  main?: string;
  files?: string[];
  scripts?: Record<string, string>;
}