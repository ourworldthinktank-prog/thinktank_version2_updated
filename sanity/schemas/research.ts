// Research: reports, policy briefs, papers. "gated" lets the client switch a download
// between open and email-gated without a developer.
export default {
  name: "research",
  title: "Research",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", type: "slug", options: { source: "title" }, validation: (r: any) => r.required() },
    { name: "kind", title: "Type", type: "string", options: { list: ["Annual Report", "Policy Brief", "Research Paper"] } },
    { name: "topic", type: "reference", to: [{ type: "focusArea" }] },
    { name: "publishedAt", type: "date" },
    { name: "summary", type: "text", rows: 3 },
    { name: "featured", type: "boolean", initialValue: false },
    { name: "file", title: "PDF", type: "file" },
    { name: "gated", title: "Require email to download", type: "boolean", initialValue: false },
    { name: "seoTitle", type: "string" },
    { name: "seoDescription", type: "text", rows: 2 },
  ],
};
