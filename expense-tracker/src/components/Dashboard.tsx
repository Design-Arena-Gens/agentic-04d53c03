"use client";

import { useEffect, useMemo, useState } from "react";
import { loadSnapshot, saveSnapshot } from "@/lib/storage";
import type { Contact, Expense, SettlementStatus } from "@/lib/types";
import ExpenseForm from "./ExpenseForm";
import ContactForm from "./ContactForm";
import ExpenseList from "./ExpenseList";
import ContactSummary from "./ContactSummary";
import DashboardSummary from "./DashboardSummary";

const DEFAULT_CATEGORIES = [
  "General",
  "Food & Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Travel",
  "Utilities",
  "Health",
];

const createId = () => crypto.randomUUID();

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const snapshot = loadSnapshot();
    return snapshot?.contacts ?? [];
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const snapshot = loadSnapshot();
    return snapshot?.expenses ?? [];
  });

  useEffect(() => {
    saveSnapshot({
      contacts,
      expenses,
      lastUpdated: new Date().toISOString(),
    });
  }, [contacts, expenses]);

  const upsertContact = (contact: Omit<Contact, "id" | "createdAt">) => {
    setContacts((prev) => [
      {
        id: createId(),
        createdAt: new Date().toISOString(),
        ...contact,
      },
      ...prev,
    ]);
  };

  const addExpense = (payload: Omit<Expense, "id" | "createdAt" | "updatedAt" | "reminderCount">) => {
    setExpenses((prev) => [
      {
        ...payload,
        id: createId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reminderCount: 0,
      },
      ...prev,
    ]);
  };

  const updateExpenseStatus = (expenseId: string, status: SettlementStatus) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              status,
              reminderCount:
                status === "reminded" ? expense.reminderCount + 1 : expense.reminderCount,
              updatedAt: new Date().toISOString(),
            }
          : expense,
      ),
    );
  };

  const removeExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
  };

  const removeContact = (contactId: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.contactId === contactId ? { ...expense, contactId: undefined } : expense,
      ),
    );
  };

  const summary = useMemo(() => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const outstanding = expenses
      .filter((expense) => !expense.isPersonal && expense.status !== "settled")
      .reduce((sum, expense) => sum + expense.amount, 0);
    const settled = expenses
      .filter((expense) => expense.status === "settled")
      .reduce((sum, expense) => sum + expense.amount, 0);
    const remindersSent = expenses.reduce((sum, expense) => sum + expense.reminderCount, 0);
    return { totalSpent, outstanding, settled, remindersSent };
  }, [expenses]);

  const contactTotals = useMemo(() => {
    return contacts.map((contact) => {
      const related = expenses.filter((expense) => expense.contactId === contact.id);
      const pending = related
        .filter((expense) => expense.status !== "settled")
        .reduce((sum, expense) => sum + expense.amount, 0);
      const settled = related
        .filter((expense) => expense.status === "settled")
        .reduce((sum, expense) => sum + expense.amount, 0);
      const reminders = related.reduce((sum, expense) => sum + expense.reminderCount, 0);
      return {
        contact,
        stats: {
          total: related.reduce((sum, expense) => sum + expense.amount, 0),
          pending,
          settled,
          reminders,
          outstandingCount: related.filter(
            (expense) => expense.status !== "settled" && !expense.isPersonal,
          ).length,
        },
      };
    });
  }, [contacts, expenses]);

  const latestExpenses = useMemo(() => {
    const sorted = [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return sorted.slice(0, 10);
  }, [expenses]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-3xl font-semibold text-zinc-900">Wallet & Dues Tracker</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Capture your own spending, log shared costs, and keep a pulse on who still owes you
          money. Everything stays local to your browser.
        </p>
      </section>

      <DashboardSummary {...summary} expenseCount={expenses.length} contactCount={contacts.length} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <ExpenseForm
            contacts={contacts}
            categories={DEFAULT_CATEGORIES}
            onSubmit={addExpense}
          />
          <ExpenseList
            expenses={latestExpenses}
            contacts={contacts}
            onStatusChange={updateExpenseStatus}
            onDelete={removeExpense}
          />
        </div>
        <aside className="space-y-6">
          <ContactForm onSubmit={upsertContact} />
          <ContactSummary items={contactTotals} onRemove={removeContact} />
        </aside>
      </div>
    </div>
  );
}
