import Editor, { OnMount } from '@monaco-editor/react';
import { useState } from 'react';
import NightOwl from 'monaco-themes/themes/Night Owl.json';
import {
  SupportedLanguage,
  supportedLanguages,
} from '@leetcraft/boilerplate-generator';
import { Boilerplate } from '@leetcraft/db';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@leetcraft/ui/components/select';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  onChange: (value: string | undefined, language: SupportedLanguage) => void;
  value?: string;
  readOnly?: boolean;
  language?: SupportedLanguage | 'yaml';
  boilerplates?: Boilerplate[];
  title: string;
}

function CodeEditor({
  onChange,
  value,
  readOnly = false,
  language,
  boilerplates,
  title,
}: CodeEditorProps) {
  const [editorReady, setEditorReady] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    supportedLanguages[0].language,
  );
  const getBoilerplateForLang = (language: SupportedLanguage) =>
    boilerplates?.find((b) => b.language === language)?.shortCode || '';

  const handleEditorDidMount: OnMount = (editor, monaco) => {
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

    setEditorReady(true);
  };

  return (
    <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 rounded-md border focus-within:ring-1">
      <div className="bg-tertiary text-md flex items-center gap-4 border-b px-3 py-1">
        <div>{title}</div>
        <div className="text-muted-foreground">
          {language ? (
            <div className="px-2 py-1.5 text-sm">{language}</div>
          ) : (
            <Select
              value={currentLanguage}
              onValueChange={(value: SupportedLanguage) => {
                setCurrentLanguage(value);
                onChange(getBoilerplateForLang(value), value);
              }}
            >
              <SelectTrigger size="sm" className="border-none">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => {
                  return (
                    <SelectItem value={lang.language}>
                      {lang.language}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className={cn('h-full opacity-0', editorReady && 'opacity-100')}>
          <Editor
            height="100%"
            width="100%"
            className={readOnly ? 'hide-cursor pointer-events-none' : ''}
            onChange={(value) => onChange(value, currentLanguage)}
            value={value ?? getBoilerplateForLang(currentLanguage)}
            language={language ?? currentLanguage}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              readOnly,
              fontSize: 14,
              minimap: {
                enabled: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
