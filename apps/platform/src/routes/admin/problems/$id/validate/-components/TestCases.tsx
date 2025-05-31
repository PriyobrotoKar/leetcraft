import { useState } from 'react';
import { parseProblemStructure } from '@leetcraft/boilerplate-generator';

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
      <div className="space-y-3 p-3">
        <div>
          {testCases.map((_, index) => {
            return (
              <div className="text-md bg-tertiary w-fit rounded-md border px-4 py-2">
                Case {index + 1}
              </div>
            );
          })}
        </div>
        <div className="bg-background text-md whitespace-pre rounded-md border px-4 py-3 font-mono leading-relaxed">
          {inputs}
        </div>
      </div>
    </div>
  );
}

export default TestCases;
