export default {
  name: "focusArea",
  title: "Focus Area",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "summary", type: "text", rows: 3 },
    { name: "colour", type: "string", options: { list: ["amber", "coral", "cyan", "teal"] } },
    { name: "order", type: "number" },
  ],
};
