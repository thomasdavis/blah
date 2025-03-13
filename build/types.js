// Type guard for search arguments
export function isValidSearchArgs(args) {
    return (typeof args === "object" &&
        args !== null &&
        "query" in args &&
        typeof args.query === "string" &&
        (args.numResults === undefined || typeof args.numResults === "number"));
}
