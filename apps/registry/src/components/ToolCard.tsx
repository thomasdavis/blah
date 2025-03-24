import { Tool } from '@/lib/types';
import Link from 'next/link';
import { Card } from '@repo/ui/card';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="p-4 h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <Link href={`/tools/${tool.id}`} className="text-lg font-semibold hover:underline">
          {tool.name}
        </Link>
        {tool.latest_version && (
          <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
            v{tool.latest_version}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
        {tool.description || 'No description provided'}
      </p>
      
      <div className="mt-auto">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            by {tool.author_name}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(tool.created_at).toLocaleDateString()}
          </span>
        </div>
        
        {tool.tags && tool.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tool.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
