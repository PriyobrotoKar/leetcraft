import PlaylistController from '@/controllers/playlist.controller';
import { CreatePlaylistSchema } from '@/dto/playlist.dto';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';

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

playlistRouter.delete(
  '/:id/problems',
  playlistController.removeProblemFromPlaylist,
);

playlistRouter.delete('/:id', playlistController.deletePlaylist);

export default playlistRouter;
