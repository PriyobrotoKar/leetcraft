import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@leetcraft/ui/components/dialog';
import { IconPlus } from '@tabler/icons-react';
import { Label } from '@leetcraft/ui/components/label';
import { Textarea } from '@leetcraft/ui/components/textarea';
import { Button } from '@leetcraft/ui/components/button';

interface TestCase {
  input: string;
  output: string;
}

interface TestCaseProps {
  value?: TestCase[];
  onChange?: (value: TestCase[]) => void;
}

function TestCases({ value = [], onChange }: TestCaseProps) {
  const [testCases, setTestCases] = useState<TestCase[]>(value);

  useEffect(() => {
    if (onChange) {
      onChange(testCases);
    }
  }, [testCases]);

  return (
    <div className="bg-card focus-within:ring-ring/50 flex h-72 grow-0 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
      <div className="bg-tertiary text-md border-b p-3">Test Cases</div>
      <div className="overflow-auto">
        <div className="grid flex-1 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3 p-3">
          <TestCaseDialog setTestCases={setTestCases} />
          {testCases.map((testCase, index) => {
            return (
              <div
                key={testCase + String(index)}
                className="space-y-4 rounded-md border p-4"
              >
                <div>Case {index + 1}</div>
                <div className="flex gap-4">
                  <div className="text-muted-foreground line-clamp-3 flex-1 text-sm">
                    <div>Input</div>
                    <div className="whitespace-pre">{testCase.input}</div>
                  </div>
                  <div className="text-muted-foreground line-clamp-3 flex-1 text-sm">
                    <div>Output</div>
                    <div>{testCase.output}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TestCases;

function TestCaseDialog({
  setTestCases,
}: {
  setTestCases: Dispatch<SetStateAction<TestCase[]>>;
}) {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleAddTestcase = () => {
    if (!input || !output) {
      return;
    }

    setTestCases((prev) => [...prev, { input, output }]);
    setInput('');
    setOutput('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-muted-foreground h-36 space-y-2 rounded-md border p-4 text-center">
        <IconPlus className="mx-auto size-9" />
        <div className="text-sm">Add Testcase</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Create New Testcase</DialogTitle>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Input</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-40 resize-none"
            />
          </div>
          <div className="space-y-3">
            <Label>Output</Label>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="h-20 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddTestcase}
            variant={'secondary'}
            className="w-full"
          >
            Add Testcase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
