// Exa API Types
export interface ExaSearchRequest {
  query: string;
  type: string;
  numResults: number;
  contents: {
    text: boolean;
  };
}

export interface ExaSearchResult {
  score: number;
  title: string;
  id: string;
  url: string;
  publishedDate: string;
  author: string;
  text: string;
  image?: string;
  favicon?: string;
}

export interface ExaSearchResponse {
  requestId: string;
  autopromptString: string;
  resolvedSearchType: string;
  results: ExaSearchResult[];
}

// Tool Types
export interface SearchArgs {
  query: string;
  numResults?: number;
}

// Type guard for search arguments
export function isValidSearchArgs(args: any): args is SearchArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "query" in args &&
    typeof args.query === "string" &&
    (args.numResults === undefined || typeof args.numResults === "number")
  );
}

// Recent searches cache type
export interface CachedSearch {
  query: string;
  response: ExaSearchResponse;
  timestamp: string;
}