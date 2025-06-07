interface HeaderProps {
  title: string;
  subtitle: string;
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="space-y-2">
        <h2 className="text-lg">{title}</h2>
        <p className="text-md">{subtitle}</p>
      </div>
    </header>
  );
}

export default Header;
