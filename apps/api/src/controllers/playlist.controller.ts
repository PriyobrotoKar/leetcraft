import { CreatePlaylistDto, UpdatePlaylistDto } from '@/dto/playlist.dto';
import PlaylistService from '@/services/playlist.service';
import { HandleRequest } from '@/types/request';

class PlaylistController {
  private readonly playlistService;

  constructor() {
    this.playlistService = new PlaylistService();
  }

  createPlaylist: HandleRequest<CreatePlaylistDto> = async (req, res) => {
    const playlist = await this.playlistService.createPlaylist(
      req.body,
      req.user,
    );
    res.status(201).json(playlist);
  };

  getPlaylistsByUser: HandleRequest<never, never, { problemId?: string }> =
    async (req, res) => {
      const playlists = await this.playlistService.getPlaylistsByUser(
        req.user,
        req.query.problemId,
      );
      res.status(200).json(playlists);
    };

  getPlaylistById: HandleRequest<never, { id: string }> = async (req, res) => {
    const playlist = await this.playlistService.getPlaylistById(
      req.params.id,
      req.user,
    );
    res.status(200).json(playlist);
  };

  addProblemToPlaylist: HandleRequest<
    never,
    { id: string },
    { problemId: string }
  > = async (req, res) => {
    const result = await this.playlistService.addProblemToPlaylist(
      req.params.id,
      req.query.problemId,
      req.user,
    );
    res.status(200).json(result);
  };

  removeProblemFromPlaylist: HandleRequest<
    never,
    { id: string },
    { problemId: string }
  > = async (req, res) => {
    const result = await this.playlistService.removeProblemFromPlaylist(
      req.params.id,
      req.query.problemId,
      req.user,
    );
    res.status(200).json(result);
  };

  updatePlaylist: HandleRequest<UpdatePlaylistDto, { id: string }> = async (
    req,
    res,
  ) => {
    const updatedPlaylist = await this.playlistService.updatePlaylist(
      req.params.id,
      req.body,
      req.user,
    );
    res.status(200).json(updatedPlaylist);
  };

  deletePlaylist: HandleRequest<never, { id: string }> = async (req, res) => {
    const result = await this.playlistService.deletePlaylist(
      req.params.id,
      req.user,
    );
    res.status(200).json(result);
  };
}

export default PlaylistController;
