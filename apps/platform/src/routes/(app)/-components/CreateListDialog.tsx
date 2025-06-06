import PlaylistService from '@/api/services/playlist';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@leetcraft/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@leetcraft/ui/components/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from '@leetcraft/ui/components/form';
import { Input } from '@leetcraft/ui/components/input';
import { Textarea } from '@leetcraft/ui/components/textarea';
import { IconPlus } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const createListSchema = z.object({
  name: z.string().min(1, 'List name is required'),
  description: z.string().optional(),
});

interface CreateListDialogProps {
  trigger?: React.ReactNode;
}

function CreateListDialog({ trigger }: CreateListDialogProps) {
  const navigate = useNavigate({
    from: '/',
  });
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createListSchema>>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof createListSchema>) =>
      PlaylistService.createPlaylist(data),
    onSuccess: async (data) => {
      setOpen(false);
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ['playlists'] });
      navigate({ to: `/lists/${data.id}` });
    },
    onError: (error) => {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    },
  });

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={!!trigger}>
        {trigger || <IconPlus />}
      </DialogTrigger>
      <DialogContent className="gap-8">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input {...field} placeholder="Enter a list name" />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...field}
                    className="field-sizing-content max-h-40 resize-none"
                    placeholder="Describe your list"
                  />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  form.reset();
                  setOpen(false);
                }}
                type="button"
                variant={'tertiary'}
                size={'sm'}
              >
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                onClick={(e) => e.stopPropagation()}
                size={'sm'}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateListDialog;
