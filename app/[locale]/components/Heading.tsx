export default function Heading({
  title,
  size = "lg"
}: {
  title: string,
  size?: "sm" | "md" | "lg" | string
}) {
  return (
    <h1 className={`
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
    </h1 >
  )
}
