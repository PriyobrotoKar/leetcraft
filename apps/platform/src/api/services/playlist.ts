import { Playlist, Prisma } from '@leetcraft/db';
import ApiClient from '../client';

export type PlaylistWithProblems = Prisma.PlaylistGetPayload<{
  include: {
    problems: {
      select: {
        id: true;
        title: true;
        difficulty: true;
        tags: true;
        solvedBy: true;
      };
    };
    creator: { select: { id: true; name: true } };
  };
}>;

class PlaylistService {
  private static apiClient: ApiClient = new ApiClient('/playlists');

  static async getPlaylists(filters?: { problemId?: string }) {
    return this.apiClient.get<Playlist[]>('/', {
      ...(filters?.problemId && { problemId: filters.problemId }),
    });
  }

  static async getPlaylistById(id: string) {
    return this.apiClient.get<PlaylistWithProblems>(`/${id}`);
  }

  static async createPlaylist(data: { name: string; description?: string }) {
    return this.apiClient.post<Playlist>('/', data);
  }

  static async addProblemToPlaylist(playlistId: string, problemId: string) {
    return this.apiClient.post(
      `/${playlistId}/problems?problemId=${problemId}`,
    );
  }

  static async removeProblemFromPlaylist(
    playlistId: string,
    problemId: string,
  ) {
    return this.apiClient.delete(
      `/${playlistId}/problems?problemId=${problemId}`,
    );
  }

  static async updatePlaylist(
    id: string,
    data: { name?: string; description?: string },
  ) {
    return this.apiClient.patch<Playlist>(`/${id}`, data);
  }

  static async deletePlaylist(id: string) {
    return this.apiClient.delete(`/${id}`);
  }
}

export default PlaylistService;
