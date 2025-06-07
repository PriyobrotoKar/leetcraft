import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@leetcraft/ui/components/dropdown-menu';
import { Avatar, AvatarFallback } from '@leetcraft/ui/components/avatar';
import { CurrentUser, useAuth } from '@/providers/AuthProvider';
import {
  IconDashboard,
  IconLayout,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import AuthService from '@/api/services/auth';
import { toast } from 'sonner';

interface ProfileMenuProps {
  user: CurrentUser | null;
}

function ProfileMenu({ user }: ProfileMenuProps) {
  const { setAuth } = useAuth();

  const navigate = useNavigate({
    from: '/',
  });

  const mutation = useMutation({
    mutationFn: async () => await AuthService.logout(),
    onSuccess: () => {
      setAuth({ user: null });
      navigate({
        to: '/login',
      });
    },
    onError: () => {
      console.error('Logout failed');
      toast.error('Logout failed');
    },
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="hover:bg-card flex items-center gap-2.5 rounded-lg px-4 py-2">
            <Avatar>
              <AvatarFallback>
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <div>{user?.name}</div>
              <div className="text-muted-foreground text-sm">{user?.email}</div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end">
          <DropdownMenuLabel>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <div>{user?.name}</div>
                <div className="text-muted-foreground line-clamp-1 text-sm">
                  {user?.email}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to="/profile">
            <DropdownMenuItem>
              <IconUserCircle />
              Profile
            </DropdownMenuItem>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin/dashboard">
              <DropdownMenuItem>
                <IconLayout />
                Dashboard
              </DropdownMenuItem>
            </Link>
          )}
          <Link to="/">
            <DropdownMenuItem>
              <IconSettings />
              Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={() => mutation.mutate()}
            variant="destructive"
          >
            <IconLogout />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProfileMenu;
