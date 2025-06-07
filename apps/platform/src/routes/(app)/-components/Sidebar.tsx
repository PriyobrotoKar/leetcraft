import { cn } from '@/lib/utils';
import { Separator } from '@leetcraft/ui/components/separator';
import { IconFolder, IconLoader2 } from '@tabler/icons-react';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import React from 'react';
import CreateListDialog from './CreateListDialog';
import { useQuery } from '@tanstack/react-query';
import PlaylistService from '@/api/services/playlist';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '@/providers/AuthProvider';

interface NavLink {
  label: string;
  icon: React.ReactNode;
  link: string;
}

const navLinks: NavLink[] = [
  {
    label: 'Library',
    icon: <IconFolder />,
    link: '/',
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { auth } = useAuth();

  return (
    <div className="flex min-w-60 flex-col gap-4">
      <div className="flex max-w-20 gap-2 text-[1.25rem] leading-tight">
        <img src="/logo.svg" width={48} height={48} alt="Logo" />
        Leet Craft
      </div>

      <nav>
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.link;
            return (
              <li key={link.label}>
                <Link
                  to={link.link}
                  className={cn(
                    'flex items-center gap-2 rounded-md p-2',
                    isActive && 'bg-accent',
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-md text-muted-foreground">My Lists</h3>
          <CreateListDialog />
        </div>
        <Playlists />
      </div>

      <Separator />
      <ProfileMenu user={auth.user} />
    </div>
  );
}

function Playlists() {
  const params = useParams({
    strict: false,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => PlaylistService.getPlaylists(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <IconLoader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return <div>Error loading playlists</div>;
  }

  return (
    <div>
      {data.map((playlist) => {
        const isActive = params.id === playlist.id;

        return (
          <Link
            key={playlist.id}
            to="/lists/$id"
            params={{ id: playlist.id }}
            className={cn(
              'items-centers hover:bg-accent flex gap-2 rounded-md p-2',
              isActive && 'bg-accent',
            )}
          >
            {playlist.name}
          </Link>
        );
      })}
    </div>
  );
}
