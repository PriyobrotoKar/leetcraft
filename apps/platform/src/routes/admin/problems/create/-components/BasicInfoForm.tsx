import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@leetcraft/ui/components/form';
import { Input } from '@leetcraft/ui/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@leetcraft/ui/components/select';
import { useForm } from 'react-hook-form';
import MarkdownTextarea from './MarkdownTextarea';
import { Button } from '@leetcraft/ui/components/button';
import { useState } from 'react';
import { cn } from '@leetcraft/ui/lib/utils';
import TagsInput from './TagsInput';
import CodeEditor from './CodeEditor';
import TestCases from './TestCases';
import Actions from './Actions';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import ProblemService from '@/api/services/problem';
import { toast } from 'sonner';

const CreateProblemFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  tags: z.array(z.string()).nonempty(),
  structure: z.string().min(1, { message: 'Structure is required' }),
  testcases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
      }),
    )
    .nonempty(),
});

function BasicInfoForm() {
  const [preview, setPreview] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateProblemFormSchema),
    defaultValues: {
      title: '',
      description: '',
      structure: '',
      difficulty: undefined,
      tags: [],
      testcases: [],
    },
  });

  const errors = form.formState.errors;
  console.log('Form Errors:', errors);

  const watch = form.watch();

  console.log('Form Watch:', watch);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof CreateProblemFormSchema>) =>
      ProblemService.createProblem(data),
    onError: (error) => {
      console.error('Error creating problem:', error);
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Problem created successfully');
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log('Form Data:', data);
    mutate(data);
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Form {...form}>
        <Actions isPending={isPending} onSubmit={onSubmit} />
        <form className="grid flex-1 grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <FormField
              name="title"
              render={({ field }) => (
                <FormItem className="bg-card focus-within:ring-ring/50 gap-0 overflow-hidden rounded-md border focus-within:ring-1">
                  <div className="bg-tertiary border-b p-3">
                    <FormLabel>Title</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      className="rounded-none border-none focus-visible:ring-0 dark:bg-transparent"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="description"
              render={({ field }) => (
                <FormItem className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
                  <div className="bg-tertiary flex h-fit items-center justify-between border-b px-3 py-1">
                    <FormLabel>Description</FormLabel>
                    <div className="bg-background rounded-md p-1">
                      <Button
                        type="button"
                        onClick={() => setPreview(false)}
                        variant={'ghost'}
                        size={'sm'}
                        className={cn(
                          'h-fit rounded-sm border-none px-3 py-1',
                          !preview && 'bg-muted',
                        )}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setPreview(true)}
                        variant={'ghost'}
                        size={'sm'}
                        className={cn(
                          'h-fit rounded-sm border-none px-3 py-1',
                          preview && 'bg-muted',
                        )}
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                  <FormControl>
                    <MarkdownTextarea {...field} preview={preview} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose difficulty for the problem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Difficulty</SelectLabel>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEIDUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="tags"
              render={({ field }) => (
                <FormItem className="bg-card focus-within:ring-ring/50 gap-0 overflow-hidden rounded-md border focus-within:ring-1">
                  <div className="bg-tertiary border-b p-3">
                    <FormLabel>Tags</FormLabel>
                  </div>
                  <FormControl>
                    <TagsInput onTagsChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              name="structure"
              render={({ field }) => (
                <CodeEditor onChange={(value) => field.onChange(value)} />
              )}
            />
            <FormField
              name="testcases"
              render={({ field }) => <TestCases {...field} />}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

export default BasicInfoForm;
