import { Textarea } from '@leetcraft/ui/components/textarea';
import MarkdownPreview from '@uiw/react-markdown-preview';
import React from 'react';
import remarkBreak from 'remark-breaks';
import { useFormContext } from 'react-hook-form';
import { Problem } from '@leetcraft/db';
import { cn, getDifficultyColor } from '@/lib/utils';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  defaultValue?: string;
  preview?: boolean;
  problem?: Problem;
}

function MarkdownTextarea({
  preview,
  problem,
  defaultValue,
  ...props
}: TextareaProps) {
  const value = useFormContext();

  const markdown = defaultValue ?? value.getValues('description');

  if (preview) {
    return (
      <div className="flex-1 basis-0 space-y-4 overflow-auto px-3 pt-2">
        {problem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">{problem?.title}</h2>
              <div
                className={cn(
                  'rounded-md px-2 py-1 text-sm',
                  getDifficultyColor(problem.difficulty),
                )}
              >
                {problem.difficulty.at(0)?.toUpperCase() +
                  problem.difficulty.slice(1).toLowerCase()}
              </div>
            </div>

            <div className="flex gap-2">
              {problem.tags.map((tag, index) => {
                return (
                  <span
                    key={index}
                    className="bg-border inline-flex items-center gap-2 rounded-sm px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        <MarkdownPreview
          remarkPlugins={[remarkBreak]}
          style={{
            backgroundColor: 'transparent',
            fontSize: 'var(--text-md)',
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)',
          }}
          source={markdown || 'Nothing to preview'}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <Textarea
        className="min-h-0 flex-1 resize-none overflow-y-auto rounded-none border-none focus-visible:ring-0 dark:bg-transparent"
        {...props}
        placeholder='Markdown supported. Use triple backticks for code blocks. Example: ```python\nprint("Hello World")\n```'
      />
    </div>
  );
}

export default MarkdownTextarea;
