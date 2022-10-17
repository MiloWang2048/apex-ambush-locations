import DOMPurify from "dompurify";
import { marked } from "marked";

export function setup() {
  DOMPurify.setConfig({
    ALLOWED_ATTR: ["target", "href", "title"],
  });

  marked.use({
    renderer: {
      link(this: marked.Renderer | marked.RendererThis, href, title, text) {
        if (href === null) {
          return text;
        }
        return `<a href="${encodeURI(
          href
        )}" title="${title}" target="_blank">${text}</a>`;
      },
    },
  });
}
