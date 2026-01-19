interface DashboardSummaryProps {
  totalSpent: number;
  outstanding: number;
  settled: number;
  remindersSent: number;
  expenseCount: number;
  contactCount: number;
}

const cards: Array<{
  key: keyof DashboardSummaryProps;
  label: string;
  hint: string;
  format?: (value: number) => string;
  highlight?: boolean;
}> = [
  {
    key: "totalSpent",
    label: "Lifetime tracked",
    hint: "Your total spending and lent amounts recorded here.",
    highlight: true,
  },
  {
    key: "outstanding",
    label: "Still owed to you",
    hint: "Open balances that you have not marked as settled.",
    highlight: true,
  },
  {
    key: "settled",
    label: "Paid back",
    hint: "What friends already returned to you.",
  },
  {
    key: "remindersSent",
    label: "Reminders sent",
    hint: "How many nudges you have recorded so far.",
    format: (value) => `${value}`,
  },
  {
    key: "expenseCount",
    label: "Entries logged",
    hint: "Personal and shared expenses you have saved.",
    format: (value) => `${value}`,
  },
  {
    key: "contactCount",
    label: "People tracked",
    hint: "Contacts who owe you or share expenses.",
    format: (value) => `${value}`,
  },
];

export default function DashboardSummary(props: DashboardSummaryProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ key, label, hint, highlight, format }) => {
        const value = props[key];
        const display =
          typeof format === "function"
            ? format(value)
            : typeof value === "number"
              ? `$${value.toFixed(2)}`
              : String(value);
        return (
          <article
            key={key}
            className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              highlight ? "border-zinc-900" : ""
            }`}
          >
            <h3 className="text-sm font-semibold text-zinc-900">{label}</h3>
            <p className="mt-3 text-2xl font-semibold text-zinc-900">{display}</p>
            <p className="mt-2 text-xs text-zinc-500">{hint}</p>
          </article>
        );
      })}
    </section>
  );
}
