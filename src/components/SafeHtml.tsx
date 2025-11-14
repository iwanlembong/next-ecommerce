"use client";
import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

export default function SafeHtml({ html }: { html: string }) {
  const clean = useMemo(() => DOMPurify.sanitize(html), [html]);

  return (
    <div
      className="text-sm text-gray-500"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
