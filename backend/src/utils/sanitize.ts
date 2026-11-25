import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "blockquote",
  "h2", "h3", "h4", "h5", "h6", "a", "table", "thead", "tbody", "tr", "th", "td",
  "span", "div", "section", "figure", "figcaption", "img", "hr",
];

export function sanitizeRichText(value: string): string {
  return sanitizeHtml(value, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
}

export function sanitizePlain(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
}