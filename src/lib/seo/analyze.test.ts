import { describe, expect, it } from "vitest";
import { analyzeHtml, normalizeUrl } from "./analyze";

const goodPage = `<!doctype html>
<html lang="en">
  <head>
    <title>Best Running Shoes for Marathons in 2026 | Acme</title>
    <meta name="description" content="A data-driven guide to the best marathon running shoes of 2026, comparing cushioning, weight, and price so you can pick the right pair with confidence." />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href="https://acme.example/running-shoes" />
    <meta property="og:title" content="Best Running Shoes" />
    <meta property="og:description" content="Guide" />
    <meta property="og:image" content="https://acme.example/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">{"@context":"https://schema.org"}</script>
  </head>
  <body>
    <h1>Best Running Shoes for Marathons</h1>
    <h2>Cushioning</h2>
    <h2>Weight</h2>
    <p>${"shoe ".repeat(400)}</p>
    <a href="https://acme.example/reviews">Reviews</a>
    <a href="https://other.example/x">External</a>
    <img src="a.png" alt="A running shoe" />
  </body>
</html>`;

const badPage = `<!doctype html>
<html>
  <head>
    <meta name="robots" content="noindex" />
  </head>
  <body>
    <h1>One</h1>
    <h1>Two</h1>
    <p>Too short.</p>
    <img src="a.png" />
    <img src="b.png" />
  </body>
</html>`;

describe("analyzeHtml", () => {
  it("scores a well-optimized page highly", () => {
    const report = analyzeHtml(goodPage, "https://acme.example/running-shoes");
    expect(report.score).toBeGreaterThanOrEqual(90);
    expect(report.grade).toBe("A");
    expect(report.summary.fail).toBe(0);
    expect(report.metrics.h1Count).toBe(1);
    expect(report.metrics.internalLinks).toBe(1);
    expect(report.metrics.externalLinks).toBe(1);
    expect(report.metrics.imagesMissingAlt).toBe(0);
  });

  it("flags problems on a poorly-optimized page", () => {
    const report = analyzeHtml(badPage, "http://acme.example/");
    expect(report.score).toBeLessThan(50);
    expect(report.summary.fail).toBeGreaterThan(0);

    const byId = Object.fromEntries(report.checks.map((c) => [c.id, c]));
    expect(byId.title.status).toBe("fail");
    expect(byId.description.status).toBe("fail");
    expect(byId.h1.status).toBe("warn");
    expect(byId.viewport.status).toBe("fail");
    expect(byId.https.status).toBe("fail");
    expect(byId.indexable.status).toBe("fail");
    expect(byId["img-alt"].status).toBe("fail");
  });

  it("produces a check for every scored signal with a valid weight", () => {
    const report = analyzeHtml(goodPage, "https://acme.example/");
    expect(report.checks.length).toBeGreaterThanOrEqual(12);
    for (const check of report.checks) {
      expect(check.weight).toBeGreaterThan(0);
      expect(["pass", "warn", "fail"]).toContain(check.status);
    }
  });
});

describe("normalizeUrl", () => {
  it("prepends https:// when no protocol is given", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
  });

  it("preserves an explicit protocol", () => {
    expect(normalizeUrl("http://example.com/path")).toBe(
      "http://example.com/path",
    );
  });

  it("throws on empty input", () => {
    expect(() => normalizeUrl("   ")).toThrow();
  });
});
