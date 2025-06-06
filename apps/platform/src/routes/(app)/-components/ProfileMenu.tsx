import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@leetcraft/ui/components/dropdown-menu';
import { Avatar, AvatarFallback } from '@leetcraft/ui/components/avatar';
import { CurrentUser } from '@/providers/AuthProvider';
import { IconLogout, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

interface ProfileMenuProps {
  user: CurrentUser | null;
}

function ProfileMenu({ user }: ProfileMenuProps) {
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
                <div className="text-muted-foreground text-sm">
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
          <Link to="/">
            <DropdownMenuItem>
              <IconSettings />
              Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconLogout />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProfileMenu;
