import * as cheerio from "cheerio";
import type {
  CheckStatus,
  Grade,
  SeoCheck,
  SeoMetrics,
  SeoReport,
} from "./types";

function gradeFromScore(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

function statusScore(status: CheckStatus): number {
  if (status === "pass") return 1;
  if (status === "warn") return 0.5;
  return 0;
}

/**
 * Analyze a page's raw HTML and return a structured SEO report.
 *
 * Pure and network-free: given the same HTML + URL it always produces the
 * same report, which keeps the scoring logic deterministic and unit-testable.
 */
export function analyzeHtml(html: string, finalUrl: string): SeoReport {
  const $ = cheerio.load(html);

  const title = ($("head > title").first().text() || "").trim() || null;
  const description =
    ($('meta[name="description"]').attr("content") || "").trim() || null;

  const h1Count = $("h1").length;
  const h2Count = $("h2").length;

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  let host: string | null = null;
  try {
    host = new URL(finalUrl).host;
  } catch {
    host = null;
  }

  let internalLinks = 0;
  let externalLinks = 0;
  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      try {
        const linkHost = new URL(href).host;
        if (host && linkHost === host) internalLinks += 1;
        else externalLinks += 1;
      } catch {
        /* ignore malformed URLs */
      }
    } else {
      internalLinks += 1;
    }
  });

  const images = $("img");
  const imagesTotal = images.length;
  let imagesMissingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt.trim() === "") imagesMissingAlt += 1;
  });

  const metrics: SeoMetrics = {
    title,
    titleLength: title ? title.length : 0,
    description,
    descriptionLength: description ? description.length : 0,
    h1Count,
    h2Count,
    wordCount,
    internalLinks,
    externalLinks,
    imagesTotal,
    imagesMissingAlt,
  };

  const checks: SeoCheck[] = [];

  // --- Meta ---
  if (!title) {
    checks.push({
      id: "title",
      label: "Title tag",
      category: "Meta",
      status: "fail",
      weight: 10,
      details: "The page has no <title> tag.",
      recommendation: "Add a unique, descriptive title of 30–60 characters.",
    });
  } else if (title.length < 30 || title.length > 60) {
    checks.push({
      id: "title",
      label: "Title tag",
      category: "Meta",
      status: "warn",
      weight: 10,
      details: `Title is ${title.length} characters ("${title}").`,
      recommendation: "Aim for a title length between 30 and 60 characters.",
    });
  } else {
    checks.push({
      id: "title",
      label: "Title tag",
      category: "Meta",
      status: "pass",
      weight: 10,
      details: `Title is ${title.length} characters.`,
    });
  }

  if (!description) {
    checks.push({
      id: "description",
      label: "Meta description",
      category: "Meta",
      status: "fail",
      weight: 8,
      details: "No meta description found.",
      recommendation:
        "Add a meta description of 70–160 characters to improve click-through rate.",
    });
  } else if (description.length < 70 || description.length > 160) {
    checks.push({
      id: "description",
      label: "Meta description",
      category: "Meta",
      status: "warn",
      weight: 8,
      details: `Meta description is ${description.length} characters.`,
      recommendation: "Aim for a description length between 70 and 160 characters.",
    });
  } else {
    checks.push({
      id: "description",
      label: "Meta description",
      category: "Meta",
      status: "pass",
      weight: 8,
      details: `Meta description is ${description.length} characters.`,
    });
  }

  // --- Content ---
  if (h1Count === 1) {
    checks.push({
      id: "h1",
      label: "Single H1 heading",
      category: "Content",
      status: "pass",
      weight: 8,
      details: "The page has exactly one H1 heading.",
    });
  } else if (h1Count === 0) {
    checks.push({
      id: "h1",
      label: "Single H1 heading",
      category: "Content",
      status: "fail",
      weight: 8,
      details: "No H1 heading found.",
      recommendation: "Add a single H1 describing the page's main topic.",
    });
  } else {
    checks.push({
      id: "h1",
      label: "Single H1 heading",
      category: "Content",
      status: "warn",
      weight: 8,
      details: `Found ${h1Count} H1 headings.`,
      recommendation: "Use only one H1 per page and structure the rest with H2–H6.",
    });
  }

  checks.push({
    id: "subheadings",
    label: "Subheadings (H2)",
    category: "Content",
    status: h2Count > 0 ? "pass" : "warn",
    weight: 4,
    details:
      h2Count > 0
        ? `Found ${h2Count} H2 subheadings.`
        : "No H2 subheadings found.",
    recommendation:
      h2Count > 0 ? undefined : "Break content into sections using H2 subheadings.",
  });

  if (wordCount >= 300) {
    checks.push({
      id: "wordcount",
      label: "Content length",
      category: "Content",
      status: "pass",
      weight: 6,
      details: `The page has roughly ${wordCount} words.`,
    });
  } else {
    checks.push({
      id: "wordcount",
      label: "Content length",
      category: "Content",
      status: "warn",
      weight: 6,
      details: `The page has only ~${wordCount} words.`,
      recommendation:
        "Thin content ranks poorly. Aim for at least 300 words of useful content.",
    });
  }

  // --- Images ---
  if (imagesTotal === 0) {
    checks.push({
      id: "img-alt",
      label: "Image alt text",
      category: "Images",
      status: "pass",
      weight: 5,
      details: "No images on the page to evaluate.",
    });
  } else if (imagesMissingAlt === 0) {
    checks.push({
      id: "img-alt",
      label: "Image alt text",
      category: "Images",
      status: "pass",
      weight: 5,
      details: `All ${imagesTotal} images have alt text.`,
    });
  } else {
    checks.push({
      id: "img-alt",
      label: "Image alt text",
      category: "Images",
      status: imagesMissingAlt === imagesTotal ? "fail" : "warn",
      weight: 5,
      details: `${imagesMissingAlt} of ${imagesTotal} images are missing alt text.`,
      recommendation:
        "Add descriptive alt attributes to all images for accessibility and image search.",
    });
  }

  // --- Links ---
  checks.push({
    id: "internal-links",
    label: "Internal links",
    category: "Links",
    status: internalLinks > 0 ? "pass" : "warn",
    weight: 4,
    details: `Found ${internalLinks} internal and ${externalLinks} external links.`,
    recommendation:
      internalLinks > 0
        ? undefined
        : "Add internal links to help crawlers discover related pages.",
  });

  // --- Technical ---
  const lang = ($("html").attr("lang") || "").trim();
  checks.push({
    id: "lang",
    label: "HTML lang attribute",
    category: "Technical",
    status: lang ? "pass" : "warn",
    weight: 3,
    details: lang ? `Declared language: "${lang}".` : "No lang attribute on <html>.",
    recommendation: lang ? undefined : 'Add a lang attribute, e.g. <html lang="en">.',
  });

  const canonical = $('link[rel="canonical"]').attr("href");
  checks.push({
    id: "canonical",
    label: "Canonical URL",
    category: "Technical",
    status: canonical ? "pass" : "warn",
    weight: 5,
    details: canonical
      ? `Canonical points to ${canonical}.`
      : "No canonical link element found.",
    recommendation: canonical
      ? undefined
      : "Add a canonical link to prevent duplicate-content issues.",
  });

  const viewport = $('meta[name="viewport"]').attr("content");
  checks.push({
    id: "viewport",
    label: "Mobile viewport",
    category: "Technical",
    status: viewport ? "pass" : "fail",
    weight: 6,
    details: viewport
      ? "A responsive viewport meta tag is present."
      : "No viewport meta tag; the page may not be mobile-friendly.",
    recommendation: viewport
      ? undefined
      : 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
  });

  const robots = ($('meta[name="robots"]').attr("content") || "").toLowerCase();
  const noindex = robots.includes("noindex");
  checks.push({
    id: "indexable",
    label: "Indexable by search engines",
    category: "Technical",
    status: noindex ? "fail" : "pass",
    weight: 8,
    details: noindex
      ? 'The page has a "noindex" directive and will be excluded from search.'
      : "The page is not blocked from indexing.",
    recommendation: noindex
      ? "Remove the noindex directive if you want this page to rank."
      : undefined,
  });

  const isHttps = finalUrl.startsWith("https://");
  checks.push({
    id: "https",
    label: "HTTPS",
    category: "Technical",
    status: isHttps ? "pass" : "fail",
    weight: 6,
    details: isHttps ? "The page is served over HTTPS." : "The page is not served over HTTPS.",
    recommendation: isHttps ? undefined : "Serve the site over HTTPS; it is a ranking signal.",
  });

  // --- Social ---
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  checks.push({
    id: "open-graph",
    label: "Open Graph tags",
    category: "Social",
    status: ogCount === 3 ? "pass" : ogCount > 0 ? "warn" : "fail",
    weight: 4,
    details:
      ogCount === 3
        ? "og:title, og:description and og:image are all present."
        : `${ogCount} of 3 core Open Graph tags present.`,
    recommendation:
      ogCount === 3
        ? undefined
        : "Add og:title, og:description and og:image for rich social sharing previews.",
  });

  const twitterCard = $('meta[name="twitter:card"]').attr("content");
  checks.push({
    id: "twitter-card",
    label: "Twitter Card",
    category: "Social",
    status: twitterCard ? "pass" : "warn",
    weight: 2,
    details: twitterCard
      ? `twitter:card is set to "${twitterCard}".`
      : "No twitter:card tag found.",
    recommendation: twitterCard
      ? undefined
      : "Add a twitter:card meta tag for better previews on X/Twitter.",
  });

  const jsonLd = $('script[type="application/ld+json"]').length;
  checks.push({
    id: "structured-data",
    label: "Structured data (JSON-LD)",
    category: "Technical",
    status: jsonLd > 0 ? "pass" : "warn",
    weight: 4,
    details:
      jsonLd > 0
        ? `Found ${jsonLd} JSON-LD structured-data block(s).`
        : "No JSON-LD structured data found.",
    recommendation:
      jsonLd > 0
        ? undefined
        : "Add schema.org JSON-LD to unlock rich results in search.",
  });

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.reduce((sum, c) => sum + c.weight * statusScore(c.status), 0);
  const score = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);

  const summary = {
    pass: checks.filter((c) => c.status === "pass").length,
    warn: checks.filter((c) => c.status === "warn").length,
    fail: checks.filter((c) => c.status === "fail").length,
  };

  return {
    url: finalUrl,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    score,
    grade: gradeFromScore(score),
    checks,
    summary,
    metrics,
  };
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a URL.");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProto); // throws on invalid
  return parsed.toString();
}

/**
 * Fetch a URL and analyze it. Separated from analyzeHtml so the scoring logic
 * can be tested without network access.
 */
export async function fetchAndAnalyze(input: string): Promise<SeoReport> {
  const url = normalizeUrl(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "RankLensBot/1.0 (+https://ranklens.example; SEO auditor)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      throw new Error(`The site responded with HTTP ${res.status}.`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("html")) {
      throw new Error(`Expected an HTML page but received "${contentType}".`);
    }
    const html = await res.text();
    const report = analyzeHtml(html, res.url || url);
    report.url = url;
    return report;
  } finally {
    clearTimeout(timeout);
  }
}
