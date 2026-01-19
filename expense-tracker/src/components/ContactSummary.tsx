import type { Contact } from "@/lib/types";

interface ContactSummaryItem {
  contact: Contact;
  stats: {
    total: number;
    pending: number;
    settled: number;
    reminders: number;
    outstandingCount: number;
  };
}

interface ContactSummaryProps {
  items: ContactSummaryItem[];
  onRemove: (contactId: string) => void;
}

export default function ContactSummary({ items, onRemove }: ContactSummaryProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-100 px-5 py-4">
        <div className="flex items-center justify-between gap-x-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">People who owe you</h2>
            <p className="text-xs text-zinc-500">
              Keep tabs on balances and how often you have nudged them.
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
            {items.length}
          </span>
        </div>
      </header>
      {items.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-zinc-500">
          Add a contact to start tracking who owes you money.
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {items.map(({ contact, stats }) => (
            <li key={contact.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">{contact.name}</h3>
                  <div className="mt-1 flex flex-col gap-1 text-xs text-zinc-500">
                    {contact.email && <span>Email: {contact.email}</span>}
                    {contact.phone && <span>Phone: {contact.phone}</span>}
                    {contact.note && <span className="italic text-zinc-400">{contact.note}</span>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(contact.id)}
                  className="text-xs font-medium text-red-500 transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-zinc-600">
                <Stat label="Total recorded" value={stats.total} />
                <Stat label="Outstanding" value={stats.pending} emphasize />
                <Stat label="Settled" value={stats.settled} />
                <div className="rounded-lg bg-zinc-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-400">Reminders</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{stats.reminders}</p>
                  <p className="text-[11px] text-zinc-400">
                    {stats.outstandingCount} open {stats.outstandingCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value, emphasize }: { label: string; value: number; emphasize?: boolean }) {
  return (
    <div className="rounded-lg bg-zinc-50 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-zinc-400">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold ${
          emphasize ? "text-amber-600" : "text-zinc-900"
        }`}
      >
        ${value.toFixed(2)}
      </p>
    </div>
  );
}
