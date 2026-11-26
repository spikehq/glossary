/**
 * Per-page SEO values, computed once so the <head> stays declarative.
 *
 * Term pages keep the title formula the glossary already ranks for
 * ("<Term> in Incident Response Explained"); only the description changes —
 * from a template that was near-identical on all 549 pages to the term's own
 * excerpt, which is what a search result should actually show.
 */
function clamp(text, max) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:.\s]+$/, "") + "…";
}

module.exports = {
  isTerm: (data) => Boolean(data.term),

  pageUrl: (data) =>
    data.term ? `${data.site.url}/${data.page.fileSlug}/` : `${data.site.url}/`,

  // Long terms would push the formula past the ~70 characters a search result
  // shows, so they fall back to a shorter suffix, then to the bare term.
  pageTitle: (data) => {
    if (!data.term) return data.site.title;
    const options = [
      `${data.term} in Incident Response Explained`,
      `${data.term} | Spike Glossary`,
    ];
    return options.find((title) => title.length <= 70) || data.term;
  },

  metaDescription: (data) =>
    data.term ? clamp(data.excerpt, 155) : data.site.description,

  ogImage: (data) =>
    data.term
      ? `https://cdn.spike.sh/glossary/${data.page.fileSlug}.png`
      : "https://cdn.spike.sh/glossary/glossary-default.png",
};
