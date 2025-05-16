import { useAuth } from '@/providers/AuthProvider';

interface HeaderProps {
  title: string;
  subtitle: string;
}

function Header({ title, subtitle }: HeaderProps) {
  const { auth } = useAuth();

  return (
    <header className="flex items-center justify-between">
      <div className="space-y-2">
        <h2 className="text-lg">{title}</h2>
        <p className="text-md">{subtitle}</p>
      </div>
      <div className="bg-foreground text-background flex size-10 items-center justify-center rounded-full">
        <span>{auth.user?.name.charAt(0).toUpperCase()}</span>
      </div>
    </header>
  );
}

export default Header;
