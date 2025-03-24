"use client";

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('query') || '');
  
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newQueryString = createQueryString('query', query);
    router.push(`${pathname}?${newQueryString}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name or description..."
          className="flex-grow p-3 outline-none dark:bg-gray-800"
        />
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3"
        >
          Search
        </button>
      </div>
    </form>
  );
}
