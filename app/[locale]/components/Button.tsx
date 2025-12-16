import Link from "next/link";

export default function Button({
  children,
  href,
  onClick,
  target,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  target?: string;
}) {
  const buttonBaseClass =
    "px-4 py-2 w-fit bg-muted text-muted-foreground text-sm font-bold rounded-full";

  const linkBaseClass =
    "hover:opacity-60 transition-opacity underline underline-offset-3 hover:no-underline";

  if (href)
    return (
      <Link
        href={href}
        className={linkBaseClass}
        target={target}
        onClick={onClick}
      >
        {children}
      </Link>
    );

  return (
    <button className={buttonBaseClass} onClick={onClick}>
      {children}
    </button>
  );
}
