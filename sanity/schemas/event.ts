// Dates are optional so an event can show "To be announced".
export default {
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "dateTbc", title: "Dates to be announced", type: "boolean", initialValue: true },
    { name: "startDate", type: "datetime", hidden: ({ document }: any) => document?.dateTbc },
    { name: "endDate", type: "datetime", hidden: ({ document }: any) => document?.dateTbc },
    { name: "location", type: "string" },
    { name: "summary", type: "text", rows: 3 },
    { name: "image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
    { name: "externalUrl", type: "url" },
  ],
};
