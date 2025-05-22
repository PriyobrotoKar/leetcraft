import Editor, { OnChange, useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import NightOwl from 'monaco-themes/themes/Night Owl.json';

interface CodeEditorProps {
  onChange: OnChange;
}

function CodeEditor({ onChange }: CodeEditorProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    monaco.editor.defineTheme('night-owl', {
      ...NightOwl,
      base: 'vs-dark',
      colors: {
        ...NightOwl.colors,
        'editor.background': '#110F13',
        'editor.lineHighlightBackground': '#1A1A1A',
      },
    });

    monaco.editor.setTheme('night-owl');
  }, [monaco]);

  return (
    <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 rounded-md border focus-within:ring-1">
      <div className="bg-tertiary text-md flex gap-6 border-b p-3">
        <div>Structure</div>
        <div className="text-muted-foreground">yaml</div>
      </div>
      <div className="flex-1">
        <Editor
          onChange={onChange}
          defaultLanguage="yaml"
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
