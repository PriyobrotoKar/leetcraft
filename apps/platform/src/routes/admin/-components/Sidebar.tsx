import { cn } from '@/lib/utils';
import {
  IconFolder,
  IconLayoutDashboard,
  IconListCheck,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import React from 'react';

interface NavLink {
  label: string;
  icon: React.ReactNode;
  link: string;
}

const navLinks: NavLink[] = [
  {
    label: 'Dashboard',
    icon: <IconLayoutDashboard />,
    link: '/admin/dashboard',
  },
  {
    label: 'Problems',
    icon: <IconFolder />,
    link: '/admin/problems',
  },
  {
    label: 'Users',
    icon: <IconUsers />,
    link: '/admin/users',
  },
  {
    label: 'Submissions',
    icon: <IconListCheck />,
    link: '/admin/submissions',
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <div className="min-w-60 space-y-6">
      <Link to="/" className="flex max-w-20 gap-2 text-[1.25rem] leading-tight">
        <img src="/logo.svg" width={48} height={48} alt="Logo" />
        Leet Craft
      </Link>

      <nav>
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.link);
            return (
              <li key={link.label}>
                <Link
                  to={link.link}
                  className={cn(
                    'flex items-center gap-2 p-2',
                    isActive && 'bg-accent rounded-md',
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
    </div>
  );
}
