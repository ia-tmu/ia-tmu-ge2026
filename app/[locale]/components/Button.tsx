import Link from "next/link";

export default function Button({
  children,
  href,
  onClick,
  target,
  className = "",
  linkNoUnderline = false
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  target?: string;
  className?: string
  linkNoUnderline?: boolean
}) {
  const buttonBaseClass =
    "px-4 py-2 w-fit bg-muted text-muted-foreground text-sm font-bold rounded-full";
  const buttonClass = `${buttonBaseClass} ${className}`

  const linkClass = `text-foreground hover:text-dark-blue-primary transition-colors duration-300 ${linkNoUnderline ? "" : "underline underline-offset-4 hover:no-underline"}`

  if (href)
    return (
      <div onClick={onClick}>
        <Link

          href={href}
          className={linkClass}
          target={target}
        >
          {children}
        </Link>
      </div>
    );

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}
