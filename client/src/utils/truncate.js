export function truncate(text, length) {
  const truncatedText = text.slice(0, length);
  const result = truncatedText + " ...";
  return result;
}
