// FUNCTIONALITY: split text into pages
export function splitText(text, max = 500) {
  const pages = [];

  for (let i = 0; i < text.length; i += max) {
    pages.push(text.slice(i, i + max));
  }

  return pages.length ? pages : [""];
}