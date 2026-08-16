import { Analyzer } from "@/components/Analyzer";

const features = [
  {
    title: "60-second audits",
    body: "Paste any URL and get a prioritized SEO report before your coffee cools — no crawler setup, no waiting.",
  },
  {
    title: "Actionable fixes",
    body: "Every issue ships with a plain-English recommendation your team (or your client) can act on immediately.",
  },
  {
    title: "Client-ready scoring",
    body: "A single 0–100 score and letter grade make it easy to show progress and justify retainers.",
  },
  {
    title: "20+ ranking signals",
    body: "Titles, meta, headings, structured data, Open Graph, mobile readiness, HTTPS, alt text and more.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/mo",
    blurb: "For freelancers running the occasional audit.",
    features: ["Unlimited manual audits", "Full checklist", "Score & grade"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Agency",
    price: "$79",
    cadence: "/mo",
    blurb: "White-label reports for client-facing teams.",
    features: [
      "Everything in Starter",
      "White-label PDF exports",
      "Scheduled re-audits",
      "5 team seats",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Scale",
    price: "$249",
    cadence: "/mo",
    blurb: "For platforms embedding audits via API.",
    features: ["Everything in Agency", "REST API access", "Bulk audits", "Priority support"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 font-bold text-white">
            R
          </span>
          <span className="text-lg font-semibold">RankLens</span>
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-slate-600 sm:flex">
          <a href="#features" className="hover:text-slate-900">
            Features
          </a>
          <a href="#pricing" className="hover:text-slate-900">
            Pricing
          </a>
          <a href="#audit" className="hover:text-slate-900">
            Free audit
          </a>
        </nav>
        <a
          href="#audit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Run an audit
        </a>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-slate-50" />
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 text-center">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            Instant, agency-grade SEO audits
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Turn any URL into a{" "}
            <span className="text-indigo-600">client-ready SEO report</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            RankLens scans a page for 20+ on-page and technical ranking signals,
            scores it out of 100, and hands you the exact fixes — in seconds.
          </p>
          <div className="mt-10">
            <Analyzer />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No signup required. Try it on your own site or a competitor&apos;s.
          </p>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to sell SEO
          </h2>
          <p className="mt-3 text-slate-600">
            Built for agencies, consultants, and product teams who need answers
            fast.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Pricing that scales with your book of business
            </h2>
            <p className="mt-3 text-slate-600">
              Start free. Upgrade when you&apos;re ready to put audits in front of
              clients.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl p-8 ring-1 ${
                  plan.highlight
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-white text-slate-900 ring-slate-200"
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span
                    className={
                      plan.highlight ? "text-slate-300" : "text-slate-500"
                    }
                  >
                    {plan.cadence}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    plan.highlight ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {plan.blurb}
                </p>
                <ul className="mt-6 space-y-2 text-sm">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span
                        className={`grid h-4 w-4 place-items-center rounded-full text-[10px] ${
                          plan.highlight
                            ? "bg-indigo-500 text-white"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#audit"
                  className={`mt-8 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-indigo-500 text-white hover:bg-indigo-400"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} RankLens. All rights reserved.</span>
          <span>Built for agencies that ship results.</span>
        </div>
      </footer>
    </main>
  );
}
