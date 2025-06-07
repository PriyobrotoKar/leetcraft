import PlaylistController from '@/controllers/playlist.controller';
import { CreatePlaylistSchema, UpdatePlaylistSchema } from '@/dto/playlist.dto';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';
import z from 'zod';

const playlistRouter: Router = Router();

const playlistController = new PlaylistController();

playlistRouter.post(
  '/',
  validateSchema({ body: CreatePlaylistSchema }),
  playlistController.createPlaylist,
);

playlistRouter.get('/', playlistController.getPlaylistsByUser);

playlistRouter.get('/:id', playlistController.getPlaylistById);

playlistRouter.post('/:id/problems', playlistController.addProblemToPlaylist);

playlistRouter.patch(
  '/:id',
  validateSchema({
    body: UpdatePlaylistSchema,
    param: z.object({ id: z.string() }),
  }),
  playlistController.updatePlaylist,
);

playlistRouter.delete(
  '/:id/problems',
  playlistController.removeProblemFromPlaylist,
);

playlistRouter.delete('/:id', playlistController.deletePlaylist);

export default playlistRouter;
