"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          "relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-50",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);
Code.displayName = "Code";

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
}

const Pre = React.forwardRef<HTMLPreElement, PreProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "mb-4 mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-800",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  }
);
Pre.displayName = "Pre";

export { Code, Pre };