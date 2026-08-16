"use client";

import { useState } from "react";
import type { SeoCheck, SeoReport } from "@/lib/seo/types";
import { statusMeta } from "@/lib/seo/ui";
import { ScoreGauge } from "./ScoreGauge";

const STATUS_ORDER: Record<SeoCheck["status"], number> = {
  fail: 0,
  warn: 1,
  pass: 2,
};

function CheckRow({ check }: { check: SeoCheck }) {
  const meta = statusMeta[check.status];
  return (
    <li className="flex gap-3 border-t border-slate-100 py-4 first:border-t-0">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-900">{check.label}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${meta.badge}`}
          >
            {meta.label}
          </span>
          <span className="text-xs text-slate-400">{check.category}</span>
        </div>
        <p className="mt-0.5 text-sm text-slate-600">{check.details}</p>
        {check.recommendation && (
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-medium text-slate-700">Fix:</span>{" "}
            {check.recommendation}
          </p>
        )}
      </div>
    </li>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export function Analyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SeoReport | null>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }
      setReport(data as SeoReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const sortedChecks = report
    ? [...report.checks].sort(
        (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
      )
    : [];

  return (
    <div id="audit" className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={runAudit}
        className="flex flex-col gap-3 rounded-2xl bg-white/95 p-3 shadow-xl shadow-indigo-900/10 ring-1 ring-slate-200 sm:flex-row"
      >
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL, e.g. example.com"
          className="w-full flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Website URL to audit"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Auditing…" : "Run free audit"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        No signup required. Try it on your own site or a competitor&apos;s.
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {error}
        </div>
      )}

      {report && (
        <div className="mt-6 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <ScoreGauge score={report.score} grade={report.grade} />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-medium uppercase tracking-wide text-slate-400">
                  SEO score for
                </h3>
                <p className="break-all text-lg font-semibold text-slate-900">
                  {report.finalUrl}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                    {report.summary.pass} passed
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
                    {report.summary.warn} to improve
                  </span>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
                    {report.summary.fail} failed
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Words" value={report.metrics.wordCount} />
              <Metric
                label="Internal links"
                value={report.metrics.internalLinks}
              />
              <Metric
                label="External links"
                value={report.metrics.externalLinks}
              />
              <Metric
                label="Images w/o alt"
                value={`${report.metrics.imagesMissingAlt}/${report.metrics.imagesTotal}`}
              />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Audit checklist
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Prioritized by impact. Fix the failures first.
            </p>
            <ul className="mt-4">
              {sortedChecks.map((check) => (
                <CheckRow key={check.id} check={check} />
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
