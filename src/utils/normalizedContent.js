function normalizedContent(content) {
  return content
    .trim()
    .replace(/\s+/g, " ");
}

module.exports = { normalizedContent };