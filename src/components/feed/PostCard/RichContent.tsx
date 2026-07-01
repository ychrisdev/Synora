"use client";

import { clsx } from "clsx";
import NextLink from "next/link";

export default function RichContent({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={clsx(className, "whitespace-pre-wrap break-words")}>
      {text.split(/(#[\wÀ-ỹ]+)/gu).map((part, i) =>
        /^#[\wÀ-ỹ]+$/u.test(part) ? (
          <NextLink
            key={i}
            href={`/search?q=${encodeURIComponent(part)}&tab=topics`}
            onClick={(e) => e.stopPropagation()}
            className="text-primary font-medium hover:underline cursor-pointer break-words"
          >
            {part}
          </NextLink>
        ) : (
          part
        ),
      )}
    </p>
  );
}
