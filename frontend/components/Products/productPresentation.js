export function byDisplayOrder(items) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function productText(template, values) {
  return template?.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
