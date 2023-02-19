import DOMPurify from "dompurify";
import { marked } from "marked";
import axios from "axios";
import { setAgent } from "backend";

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

  setAgent(
    axios.create({
      baseURL: import.meta.env.BASE_URL,
    })
  );
}
