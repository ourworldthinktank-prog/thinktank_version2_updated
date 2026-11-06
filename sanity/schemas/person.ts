// Only add a person after written permission for their name and photo.
export default {
  name: "person",
  title: "Person (Leadership Council)",
  type: "document",
  fields: [
    { name: "name", type: "string", validation: (r: any) => r.required() },
    { name: "role", type: "string" },
    { name: "photo", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
    { name: "bio", type: "text" },
    { name: "permissionConfirmed", title: "Written permission received", type: "boolean", initialValue: false, validation: (r: any) => r.required() },
    { name: "order", type: "number" },
  ],
};
