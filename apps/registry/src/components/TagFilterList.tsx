"use client";

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface TagFilterListProps {
  availableTags: string[];
}

export default function TagFilterList({ availableTags }: TagFilterListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const activeTags = searchParams.get('tags')?.split(',') || [];
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  const toggleTag = (tag: string) => {
    let newTags: string[];
    
    if (activeTags.includes(tag)) {
      newTags = activeTags.filter(t => t !== tag);
    } else {
      newTags = [...activeTags, tag];
    }
    
    const newTagsString = newTags.length > 0 ? newTags.join(',') : '';
    const newQueryString = createQueryString('tags', newTagsString);
    
    router.push(`${pathname}?${newQueryString}`);
  };

  if (!availableTags || availableTags.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Filter by Tag</h3>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${activeTags.includes(tag) 
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
