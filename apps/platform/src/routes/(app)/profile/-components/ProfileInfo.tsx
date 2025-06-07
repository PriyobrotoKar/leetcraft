import AuthService from '@/api/services/auth';
import { isValidURL } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@leetcraft/ui/components/avatar';
import { Button } from '@leetcraft/ui/components/button';
import { Separator } from '@leetcraft/ui/components/separator';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconEdit,
  IconGlobe,
  IconLoader2,
  IconLocation,
  IconMapPin,
  IconWorld,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';

type Social = {
  type: SocialType;
  value: string;
};

type SocialType = 'Location' | 'Website' | 'GitHub' | 'LinkedIn';

const socials: Social[] = [
  {
    type: 'Location',
    value: 'Kolkata, WB, India',
  },
  {
    type: 'Website',
    value: 'https://leetcraft.dev',
  },
  {
    type: 'GitHub',
    value: 'https://github.com/@leetcraft',
  },
  {
    type: 'LinkedIn',
    value: 'http://linkedin.com/in/leetcraft',
  },
];

const SocialIconMap: Record<SocialType, ReactNode> = {
  Location: <IconMapPin />,
  Website: <IconWorld />,
  GitHub: <IconBrandGithub />,
  LinkedIn: <IconBrandLinkedin />,
};

function ProfileInfo() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['self'],
    queryFn: async () => AuthService.getMe(),
  });

  if (isLoading) {
    return (
      <div className="flex h-full min-w-80 items-center justify-center">
        <IconLoader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return <div>Error loading profile information.</div>;
  }

  return (
    <div className="relative max-w-80 space-y-6 overflow-hidden rounded-md border p-4 pb-8 pt-20">
      <div className="from-border absolute left-0 top-0 h-28 w-full bg-gradient-to-b"></div>
      <div className="relative z-10 flex items-end gap-4">
        <Avatar className="size-12">
          <AvatarImage src={data.avatar ?? ''} alt={data.name} />
          <AvatarFallback className="text-xl">
            {data.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="text-base-ui-medium">{data.name}</div>
          <div className="text-muted-foreground text-sm">{data.email}</div>
        </div>
      </div>
      <p className="relative z-10 line-clamp-3 text-sm leading-normal">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore beatae
        impedit odit voluptate, dolor maxime vero deserunt dolorem sunt esse?
      </p>
      <Button className="w-full" variant={'secondary'}>
        <IconEdit />
        Edit Profile
      </Button>

      <Separator />

      <h3>Basic Information</h3>
      <div className="text-md space-y-2">
        {socials.map((social) => (
          <div key={social.type} className="flex items-center gap-2">
            <span className="text-muted-foreground font-semibold">
              {SocialIconMap[social.type]}
            </span>
            <a
              href={social.value}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              {isValidURL(social.value) ? social.value.slice(8) : social.value}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileInfo;
