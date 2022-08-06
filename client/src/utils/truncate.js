import { htmlToText } from "html-to-text";

export function truncate(text, length) {
  const textWithoutHTMLFormat = htmlToText(text);
  const truncatedText = textWithoutHTMLFormat.slice(0, length);

  const result = truncatedText + " ...";
  return result;
}
