import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function App() {
  const [query, setQuery] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");
  const [latency, setLatency] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    if (query.trim() === "") return;

    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/process_query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      const data = await response.json();
      if (data.results) {
        setSqlOutput(data.sql_query);
        setLatency(data.latency ?? null);
        setChartData(data.results); // Assume this contains chart data
      } else {
        setSqlOutput("Error generating SQL query");
        setLatency(null);
        setChartData(null);
        setError(data.detail || "Unable to generate SQL query.");
      }
    } catch (error) {
      setSqlOutput("");
      setLatency(null);
      setChartData(null);
      setError("There was a problem connecting to the server.");
    }
    setIsLoading(false);
  };

  const latencyStats = useMemo(
    () => [
      {
        label: "SQL Generation",
        value: latency?.sql_generation_time,
        accent: "from-sky-400/60 to-blue-500/60",
        icon: "⚡",
      },
      {
        label: "SQL Execution",
        value: latency?.sql_execution_time,
        accent: "from-emerald-400/60 to-teal-500/60",
        icon: "🚀",
      },
      {
        label: "Total Time",
        value: latency?.total_time,
        accent: "from-fuchsia-400/60 to-violet-500/60",
        icon: "⏱️",
      },
    ],
    [latency]
  );

  const suggestions = useMemo(
    () => [
      "Show me the top 5 products by revenue last quarter",
      "How many users signed up this month compared to last?",
      "Total orders per region for the previous year",
      "Average session duration for premium customers",
    ],
    []
  );

  const formatLatency = (value) => {
    if (value === undefined || value === null || Number.isNaN(Number(value))) {
      return "—";
    }
    return `${Number(value).toFixed(2)}s`;
  };

  return (
    <div className="min-h-screen text-slate-100">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute left-1/2 top-40 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/40 blur-[160px]" />
        <div className="absolute left-10 bottom-10 h-48 w-48 rounded-full bg-emerald-500/30 blur-[120px]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-[160px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[120rem] flex-col lg:flex-row">
        <aside className="hidden w-full max-w-xs flex-col justify-between border-r border-white/5 bg-slate-900/60 p-8 backdrop-blur lg:flex">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-2xl font-bold text-white shadow-lg shadow-blue-500/40">
                BD
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Analytics</p>
                <h2 className="text-xl font-semibold text-white">Big Data Studio</h2>
              </div>
            </div>

            <nav className="space-y-2 text-sm font-medium">
              {["Overview", "SQL Playground", "Performance", "Settings"].map((item) => (
                <button
                  key={item}
                  className={`flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/60 hover:bg-blue-500/10 hover:text-white ${
                    item === "SQL Playground" ? "bg-blue-500/20 text-white" : "text-slate-400"
                  }`}
                >
                  <span>{item}</span>
                  <span className="text-xs text-slate-500">▸</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 shadow-xl shadow-blue-500/10">
            <p className="text-sm text-slate-300">
              “Turn natural language into actionable insights. Ask anything about your
              warehouse and watch the data come alive.”
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500">Data Experience Team</p>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
            <header className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-slate-200 shadow-lg shadow-blue-500/10 backdrop-blur">
                <span className="text-base">✨</span>
                Ask in natural language. Receive production-ready SQL.
              </div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Big Data Query Experience
              </h1>
              <p className="max-w-3xl text-base text-slate-300 sm:text-lg">
                Craft crystal clear queries, visualize trends instantly, and share results with
                your team. Give your analytics a polished, modern workspace.
              </p>
            </header>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-blue-500/20 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-white">Query Builder</h2>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200">
                    {isLoading ? "Running..." : "Ready"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Describe the insight you need and let the assistant craft the SQL for you.
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Total revenue by product category for the past 6 months"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-base text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-slate-500">
                      <span className="hidden text-xs uppercase tracking-[0.35em] md:block">Enter ↵</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setQuery(suggestion)}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      Natural language to SQL powered by your warehouse schema.
                    </p>
                    <button
                      onClick={handleQuery}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                          Running Query
                        </>
                      ) : (
                        <>
                          <span>Generate SQL</span>
                          <span className="text-base">↗</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-emerald-500/20 backdrop-blur">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Latency snapshot
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {latencyStats.map((stat) => (
                      <div
                        key={stat.label}
                        className={`relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-5 shadow-lg shadow-black/30`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60`} />
                        <div className="relative flex flex-col gap-2">
                          <span className="text-2xl">{stat.icon}</span>
                          <span className="text-[0.75rem] uppercase tracking-[0.25em] text-slate-300">
                            {stat.label}
                          </span>
                          <span className="text-2xl font-semibold text-white">
                            {formatLatency(stat.value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-dashed border-white/20 bg-slate-900/40 p-6 text-sm text-slate-300 shadow-xl shadow-fuchsia-500/10 backdrop-blur">
                  <h3 className="text-base font-semibold text-white">Quick Tips</h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-400">
                    <li>• Reference exact metrics or tables for sharper SQL.</li>
                    <li>• Ask for time comparisons to automatically generate window functions.</li>
                    <li>• Combine filters (e.g. region + product) for dimensional analysis.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-indigo-500/20 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Generated SQL</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-blue-300">
                    Preview
                  </span>
                </div>
                <div className="min-h-[160px] rounded-2xl border border-white/10 bg-slate-950/80 p-5 font-mono text-xs text-slate-200 shadow-inner shadow-black/40">
                  {sqlOutput ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">{sqlOutput}</pre>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <p>Awaiting your next brilliant query ✨</p>
                    </div>
                  )}
                </div>
                {error && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-500/20 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Visual Insight</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                    Chart
                  </span>
                </div>
                <div className="mt-4 min-h-[220px] rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <ChartPreview data={chartData} />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

function ChartPreview({ data }) {
  const chartStructure = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const sample = data.find((row) => row && typeof row === "object");
    if (!sample) return null;

    const possibleKeys = Object.keys(sample);
    if (possibleKeys.length === 0) return null;

    const xKey = possibleKeys.find((key) => {
      const value = sample[key];
      return ["string", "number"].includes(typeof value);
    });

    if (!xKey) return null;

    const yKeys = possibleKeys.filter((key) => {
      if (key === xKey) return false;
      const value = sample[key];
      return typeof value === "number" && Number.isFinite(value);
    });

    if (yKeys.length === 0) return null;

    return { xKey, yKeys };
  }, [data]);

  const sanitized = useMemo(() => {
    if (!chartStructure) return [];
    return data
      .filter((row) => row && typeof row === "object")
      .map((row) => {
        const entry = {};
        chartStructure.yKeys.forEach((key) => {
          const value = Number(row[key]);
          entry[key] = Number.isFinite(value) ? value : null;
        });
        entry[chartStructure.xKey] = row[chartStructure.xKey];
        return entry;
      });
  }, [chartStructure, data]);

  if (!chartStructure || sanitized.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        No data available yet. Run a query to visualize trends.
      </div>
    );
  }

  const colors = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#38bdf8"];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={sanitized}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey={chartStructure.xKey} stroke="#cbd5f5" tickLine={false} axisLine={{ stroke: "#334155" }} />
        <YAxis stroke="#cbd5f5" tickLine={false} axisLine={{ stroke: "#334155" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            color: "#e2e8f0",
          }}
        />
        <Legend />
        {chartStructure.yKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[8, 8, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
