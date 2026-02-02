"use client"

import React from "react"
import Heading from "./Heading"

export default function Section({
  title,
  subtitle,
  children,
  id
}: {
  title?: string,
  subtitle?: string,
  children?: React.ReactNode,
  id?: string
}) {
  return (
    <section id={id} className="p-6 md:p-8 lg:p-10 relative flex flex-col gap-9 md:gap-20 h-auto min-h-screen items-center justify-center border-box">
      {title && <Heading title={title} />}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </section>
  )
}
