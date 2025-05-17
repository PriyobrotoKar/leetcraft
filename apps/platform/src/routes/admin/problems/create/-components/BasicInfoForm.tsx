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
import { Difficulty } from '@leetcraft/db';

function BasicInfoForm() {
  const [preview, setPreview] = useState(false);
  const form = useForm();

  return (
    <div>
      <Form {...form}>
        <form className="space-y-4">
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
              <FormItem className="bg-card focus-within:ring-ring/50 gap-0 overflow-hidden rounded-md border focus-within:ring-1">
                <div className="bg-tertiary flex items-center justify-between border-b px-3 py-1">
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
        </form>
      </Form>
    </div>
  );
}

export default BasicInfoForm;
