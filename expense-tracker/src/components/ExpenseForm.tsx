import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Contact, Expense, SettlementStatus } from "@/lib/types";

type ExpenseDraft = Pick<
  Expense,
  "description" | "amount" | "date" | "category" | "notes" | "isPersonal" | "contactId" | "status"
>;

interface ExpenseFormProps {
  contacts: Contact[];
  categories: string[];
  onSubmit: (expense: ExpenseDraft) => void;
}

const initialDraft = (): ExpenseDraft => ({
  description: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  category: "General",
  notes: "",
  isPersonal: true,
  contactId: undefined,
  status: "settled",
});

const MAX_NOTES_LENGTH = 240;

export default function ExpenseForm({ contacts, categories, onSubmit }: ExpenseFormProps) {
  const [draft, setDraft] = useState<ExpenseDraft>(initialDraft);

  const handleChange =
    (key: keyof ExpenseDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      if (key === "amount") {
        setDraft((prev) => ({ ...prev, amount: Number(value) || 0 }));
        return;
      }
      if (key === "isPersonal") {
        const isPersonal = event.target instanceof HTMLInputElement ? event.target.checked : value === "true";
        setDraft((prev) => ({
          ...prev,
          isPersonal,
          status: isPersonal ? "settled" : "pending",
          contactId: isPersonal ? undefined : prev.contactId,
        }));
        return;
      }
      if (key === "contactId") {
        setDraft((prev) => ({
          ...prev,
          contactId: value || undefined,
          isPersonal: !value,
          status: value ? "pending" : "settled",
        }));
        return;
      }
      setDraft((prev) => ({ ...prev, [key]: value }));
    };

  const disableSubmit = useMemo(() => {
    if (!draft.description.trim()) return true;
    if (!draft.date) return true;
    if (draft.amount <= 0) return true;
    if (!draft.isPersonal && !draft.contactId) return true;
    return false;
  }, [draft]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const status: SettlementStatus = draft.isPersonal ? "settled" : draft.status ?? "pending";
    onSubmit({ ...draft, status });
    setDraft(initialDraft);
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-zinc-900">Add a new entry</h2>
        <p className="text-xs text-zinc-500">
          Log personal spending or attach it to a contact to track who still owes you.
        </p>
      </header>
      <form className="space-y-4 px-5 py-5" onSubmit={handleSubmit}>
        <div className="flex gap-4 max-sm:flex-col">
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-zinc-500">Description</span>
            <input
              required
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Dinner at Chez Marie"
              value={draft.description}
              onChange={handleChange("description")}
            />
          </label>
          <label className="w-full max-w-[160px] text-sm">
            <span className="mb-1 block text-zinc-500">Amount</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-zinc-400">
                $
              </span>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                className="w-full rounded-lg border border-zinc-200 px-6 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                value={draft.amount || ""}
                onChange={handleChange("amount")}
              />
            </div>
          </label>
        </div>

        <div className="flex gap-4 max-sm:flex-col">
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-zinc-500">Date</span>
            <input
              required
              type="date"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              value={draft.date}
              onChange={handleChange("date")}
            />
          </label>
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-zinc-500">Category</span>
            <select
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              value={draft.category}
              onChange={handleChange("category")}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-lg border border-zinc-200 px-3 py-3">
          <label className="flex items-center justify-between gap-4 text-sm">
            <span className="text-zinc-600">Is this just for you?</span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-zinc-900"
              checked={draft.isPersonal}
              onChange={handleChange("isPersonal")}
            />
          </label>
          <p className="mt-1 text-xs text-zinc-400">
            Keep it checked for personal expenses. Uncheck and pick a contact if someone owes you.
          </p>
          {!draft.isPersonal && (
            <div className="mt-4">
              <label className="text-sm">
                <span className="mb-1 block text-zinc-500">Who owes you?</span>
                <select
                  required
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  value={draft.contactId ?? ""}
                  onChange={handleChange("contactId")}
                >
                  <option value="">Select a contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-500">Notes</span>
          <textarea
            maxLength={MAX_NOTES_LENGTH}
            className="min-h-[90px] w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder="Add context, payment method, or reminders for later."
            value={draft.notes ?? ""}
            onChange={handleChange("notes")}
          />
          <span className="mt-1 block text-right text-xs text-zinc-400">
            {draft.notes?.length ?? 0}/{MAX_NOTES_LENGTH}
          </span>
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={disableSubmit}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Save Entry
          </button>
        </div>
      </form>
    </section>
  );
}
