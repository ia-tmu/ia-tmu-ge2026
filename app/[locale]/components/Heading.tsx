export default function Heading({
  title,
  size = "lg",
  as: Tag = "h2",
}: {
  title: string,
  size?: "sm" | "md" | "lg" | string,
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
}) {
  return (
    <Tag className={`
      ${size === "lg"
        ? "text-3xl"
        : size === "md"
          ? "text-lg"
          : size === "sm"
            ? "text-base"
            : ""
      }
      font-bold
    `}>
      {title}
    </Tag>
  )
}
