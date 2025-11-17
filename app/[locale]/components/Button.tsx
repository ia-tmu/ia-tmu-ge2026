import Link from "next/link"

export default function Button({
  children, href, onClick
}: {
  children: React.ReactNode,
  href?: string,
  onClick?: () => void
}) {
  const baseClass = "px-4 py-2 bg-black text-white text-sm font-bold rounded-full"

  if (href) return <Link href={href} className={baseClass}>{children}</Link>

  const handleClick = () => {
    onClick && onClick()
  }

  return (
    <button className={baseClass} onClick={handleClick}>{children}</button>
  )
}
