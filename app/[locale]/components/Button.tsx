import Link from "next/link";

export default function Button({
  children,
  href,
  onClick,
  target,
  className = ""
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  target?: string;
  className?: string
}) {
  const buttonBaseClass =
    "px-4 py-2 w-fit bg-muted text-muted-foreground text-sm font-bold rounded-full";
  const buttonClass = `${buttonBaseClass} ${className}`

  const linkBaseClass =
    "hover:opacity-60 transition-opacity underline underline-offset-3 hover:no-underline";
  const linkClass = `${linkBaseClass} ${className}`

  if (href)
    return (
      <Link
        href={href}
        className={linkClass}
        target={target}
        onClick={onClick}
      >
        {children}
      </Link>
    );

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}
