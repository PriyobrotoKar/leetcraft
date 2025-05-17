import { Textarea } from '@leetcraft/ui/components/textarea';
import MarkdownPreview from '@uiw/react-markdown-preview';
import React from 'react';
import remarkBreak from 'remark-breaks';
import { useFormContext } from 'react-hook-form';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preview?: boolean;
}

function MarkdownTextarea({ preview, ...props }: TextareaProps) {
  const value = useFormContext();

  const markdown = value.getValues('description');

  if (preview) {
    return (
      <div className="h-40 overflow-auto px-3 py-2">
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
    <div>
      <Textarea
        className="h-40 resize-none rounded-none border-none focus-visible:ring-0 dark:bg-transparent"
        {...props}
        placeholder='Markdown supported. Use triple backticks for code blocks. Example: ```python\nprint("Hello World")\n```'
      />
    </div>
  );
}

export default MarkdownTextarea;
