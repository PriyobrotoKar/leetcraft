import z from 'zod';

export const CreatePlaylistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type CreatePlaylistDto = z.infer<typeof CreatePlaylistSchema>;

export const UpdatePlaylistSchema = CreatePlaylistSchema.partial();

export type UpdatePlaylistDto = z.infer<typeof UpdatePlaylistSchema>;
