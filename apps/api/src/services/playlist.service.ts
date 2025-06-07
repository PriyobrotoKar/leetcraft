import { CreatePlaylistDto, UpdatePlaylistDto } from '@/dto/playlist.dto';
import { BadRequestError } from '@/lib/ApiError';
import { CurrentUser } from '@/types/auth';
import { db } from '@leetcraft/db';
import ProblemService from './problem.service';

class PlaylistService {
  problemService: ProblemService;

  constructor() {
    this.problemService = new ProblemService();
  }

  async createPlaylist(dto: CreatePlaylistDto, currentUser: CurrentUser) {
    //check if playlist with the same name already exists for the user
    const existingPlaylist = await db.playlist.findUnique({
      where: {
        name_creatorId: {
          name: dto.name,
          creatorId: currentUser.id,
        },
      },
    });

    if (existingPlaylist) {
      throw new BadRequestError('Playlist with this name already exists');
    }

    // Create the playlist
    const playlist = await db.playlist.create({
      data: {
        ...dto,
        creatorId: currentUser.id,
      },
    });

    return playlist;
  }

  async getPlaylistsByUser(currentUser: CurrentUser, problemId?: string) {
    const playlists = await db.playlist.findMany({
      where: {
        creatorId: currentUser.id,
        ...(problemId && {
          problems: {
            some: {
              id: problemId,
            },
          },
        }),
      },
    });

    return playlists;
  }

  async deletePlaylist(playlistId: string, currentUser: CurrentUser) {
    // Check if the playlist exists and belongs to the user
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        creatorId: currentUser.id,
      },
    });

    if (!playlist) {
      throw new BadRequestError('Playlist not found or does not belong to you');
    }

    // Delete the playlist
    await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    return { message: 'Playlist deleted successfully' };
  }

  async getPlaylistById(playlistId: string, currentUser: CurrentUser) {
    // Check if the playlist exists and belongs to the user
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        creatorId: currentUser.id,
      },
      include: {
        problems: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            tags: true,
            solvedBy: {
              where: {
                id: currentUser.id,
              },
            },
          },
        },
      },
    });

    if (!playlist) {
      throw new BadRequestError('Playlist not found or does not belong to you');
    }

    return playlist;
  }

  async addProblemToPlaylist(
    playlistId: string,
    problemId: string,
    currentUser: CurrentUser,
  ) {
    // Check if the playlist exists and belongs to the user
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        creatorId: currentUser.id,
      },
    });

    if (!playlist) {
      throw new BadRequestError('Playlist not found or does not belong to you');
    }

    // Check if the problem exists
    const problem = await this.problemService.getProblemById(problemId);

    // Check if the problem is already in the playlist
    const existInPlaylist =
      ((
        await db.playlist
          .findUnique({
            where: {
              id: playlistId,
            },
          })
          .problems({
            where: {
              id: problemId,
            },
          })
      )?.length ?? 0) > 0;

    if (existInPlaylist) {
      throw new BadRequestError('Problem already exists in the playlist');
    }

    // Add the problem to the playlist
    await db.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        problems: {
          connect: {
            id: problem.id,
          },
        },
      },
    });

    return { message: 'Problem added to playlist successfully' };
  }

  async updatePlaylist(
    playlistId: string,
    dto: UpdatePlaylistDto,
    currentUser: CurrentUser,
  ) {
    // Check if the playlist exists and belongs to the user
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        creatorId: currentUser.id,
      },
    });

    if (!playlist) {
      throw new BadRequestError('Playlist not found or does not belong to you');
    }

    // Update the playlist
    const updatedPlaylist = await db.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        ...dto,
      },
    });

    return updatedPlaylist;
  }

  async removeProblemFromPlaylist(
    playlistId: string,
    problemId: string,
    currentUser: CurrentUser,
  ) {
    // Check if the playlist exists and belongs to the user
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        creatorId: currentUser.id,
      },
    });

    if (!playlist) {
      throw new BadRequestError('Playlist not found or does not belong to you');
    }

    // Check if the problem is not in the playlist
    const existInPlaylist =
      ((
        await db.playlist
          .findUnique({
            where: {
              id: playlistId,
            },
          })
          .problems({
            where: {
              id: problemId,
            },
          })
      )?.length ?? 0) > 0;

    if (!existInPlaylist) {
      throw new BadRequestError('Problem does not exist in the playlist');
    }

    // Remove the problem from the playlist
    await db.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        problems: {
          disconnect: {
            id: problemId,
          },
        },
      },
    });

    return { message: 'Problem removed from playlist successfully' };
  }
}

export default PlaylistService;
