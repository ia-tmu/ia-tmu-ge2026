"use client"

import React from "react"
import Heading from "./Heading"

export default function Section({
  title,
  subtitle,
  children
}: {
  title?: string,
  subtitle?: string,
  children?: React.ReactNode
}) {
  return (
    <section className="p-8 flex flex-col gap-3">
      {title && <Heading title={title} />}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </section>
  )
}
