import { useState } from 'react';
import { parseProblemStructure } from '@leetcraft/boilerplate-generator';
import { cn } from '@/lib/utils';

interface TestCasesProps {
  structure: string;
  testCases: {
    input: string;
    output: string;
  }[];
}

function TestCases({ testCases, structure }: TestCasesProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { params } = parseProblemStructure(structure);

  const inputs = testCases[activeIndex]?.input
    .split('\n')
    .map((line, i) => `${params[i]?.name}: ${line}`)
    .join('\n');

  return (
    <div className="bg-card focus-within:ring-ring/50 flex grow-0 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
      <div className="bg-tertiary text-md border-b p-3">Test Cases</div>
      <div className="max-h-48 space-y-3 overflow-auto p-3">
        <div className="overflow-auto">
          <div className="flex flex-wrap gap-2">
            {testCases.map((_, index) => {
              return (
                <div
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'text-md hover:bg-border text-muted-foreground bg-tertiary w-fit cursor-pointer rounded-md border px-4 py-2 transition-colors',
                    activeIndex === index && 'bg-border text-foreground',
                  )}
                >
                  Case {index + 1}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-background text-md whitespace-pre rounded-md border px-4 py-3 font-mono leading-relaxed">
          {inputs}
        </div>
      </div>
    </div>
  );
}

export default TestCases;
