import clsx from "clsx";
import type { Contact, Expense, SettlementStatus } from "@/lib/types";
import { formatRelative, parseISO } from "date-fns";

interface ExpenseListProps {
  expenses: Expense[];
  contacts: Contact[];
  onStatusChange: (expenseId: string, status: SettlementStatus) => void;
  onDelete: (expenseId: string) => void;
}

const statusLabel: Record<SettlementStatus, string> = {
  pending: "Awaiting payment",
  reminded: "Reminder sent",
  settled: "Settled",
};

export default function ExpenseList({
  expenses,
  contacts,
  onStatusChange,
  onDelete,
}: ExpenseListProps) {
  const lookup = new Map(contacts.map((contact) => [contact.id, contact]));

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-100 px-5 py-4">
        <div className="flex items-center justify-between gap-x-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Recent activity</h2>
            <p className="text-xs text-zinc-500">
              Track how your balances move. Mark entries as settled once paid back.
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
            {expenses.length} shown
          </span>
        </div>
      </header>
      {expenses.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-zinc-500">
          No entries yet. Add your first expense to get started.
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {expenses.map((expense) => {
            const contact = expense.contactId ? lookup.get(expense.contactId) : undefined;
            const relativeDate = formatRelative(parseISO(expense.date), new Date());
            return (
              <li key={expense.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 text-sm">
                    <span className="font-medium text-zinc-900">{expense.description}</span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-500">{expense.category}</span>
                    <span className="hidden text-zinc-400 sm:block">•</span>
                    <span className="text-xs text-zinc-400 sm:text-sm">{relativeDate}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-zinc-500">
                    <span>
                      Amount:{" "}
                      <span className="font-medium text-zinc-900">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </span>
                    {!expense.isPersonal && contact && (
                      <span>
                        Owed by <span className="font-medium text-zinc-900">{contact.name}</span>
                      </span>
                    )}
                    {expense.notes && <span className="italic text-zinc-400">{expense.notes}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      expense.status === "settled" && "bg-emerald-100 text-emerald-700",
                      expense.status === "pending" && "bg-amber-100 text-amber-700",
                      expense.status === "reminded" && "bg-blue-100 text-blue-700",
                    )}
                  >
                    {statusLabel[expense.status]}
                  </span>
                  {!expense.isPersonal && (
                    <>
                      <button
                        type="button"
                        onClick={() => onStatusChange(expense.id, "reminded")}
                        className="rounded-full border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 transition hover:border-blue-300 hover:text-blue-700"
                      >
                        Remind
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatusChange(expense.id, "settled")}
                        className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
                      >
                        Settled
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(expense.id)}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:border-red-300 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
