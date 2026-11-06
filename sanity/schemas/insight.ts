export default {
  name: "insight",
  title: "Insight",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", type: "slug", options: { source: "title" }, validation: (r: any) => r.required() },
    { name: "topic", type: "reference", to: [{ type: "focusArea" }] },
    { name: "publishedAt", type: "date" },
    { name: "image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
    { name: "body", type: "array", of: [{ type: "block" }, { type: "image" }] },
    { name: "seoTitle", type: "string" },
    { name: "seoDescription", type: "text", rows: 2 },
  ],
};
