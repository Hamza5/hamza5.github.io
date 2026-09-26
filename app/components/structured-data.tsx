interface StructuredDataProps {
  /** One or more JSON-LD objects. @id references across pages still resolve. */
  data: Record<string, unknown>[];
}

/**
 * Emits schema.org JSON-LD. Deliberately a server component: the markup has to
 * be in the static HTML, and a client component would re-render these script
 * tags on every navigation, which React discards anyway.
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <>
      {data.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
