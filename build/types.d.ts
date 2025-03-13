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
export interface SearchArgs {
    query: string;
    numResults?: number;
}
export declare function isValidSearchArgs(args: any): args is SearchArgs;
export interface CachedSearch {
    query: string;
    response: ExaSearchResponse;
    timestamp: string;
}
//# sourceMappingURL=types.d.ts.map