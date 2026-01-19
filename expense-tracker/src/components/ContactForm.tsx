import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface ContactFormProps {
  onSubmit: (payload: { name: string; email?: string; phone?: string; note?: string }) => void;
}

const initialState = { name: "", email: "", phone: "", note: "" };
const MAX_NOTE = 160;

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formState, setFormState] = useState(initialState);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) return;
    onSubmit({
      name: formState.name.trim(),
      email: formState.email.trim() || undefined,
      phone: formState.phone.trim() || undefined,
      note: formState.note.trim() || undefined,
    });
    setFormState(initialState);
  };

  const updateField =
    (field: keyof typeof initialState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-zinc-900">Add a contact</h2>
        <p className="text-xs text-zinc-500">
          Store quick details so requesting payments later is easy.
        </p>
      </header>
      <form className="space-y-4 px-5 py-5" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-500">Name</span>
          <input
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder="Alex Rivera"
            value={formState.name}
            onChange={updateField("name")}
          />
        </label>
        <div className="flex gap-4 max-sm:flex-col">
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-zinc-500">Email</span>
            <input
              type="email"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="alex@email.com"
              value={formState.email}
              onChange={updateField("email")}
            />
          </label>
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-zinc-500">Phone</span>
            <input
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="+1 987 654 3210"
              value={formState.phone}
              onChange={updateField("phone")}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-500">Notes</span>
          <textarea
            maxLength={MAX_NOTE}
            className="min-h-[70px] w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder="Preferred payment method, reminders, context…"
            value={formState.note}
            onChange={updateField("note")}
          />
          <span className="mt-1 block text-right text-xs text-zinc-400">
            {formState.note.length}/{MAX_NOTE}
          </span>
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!formState.name.trim()}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Save Contact
          </button>
        </div>
      </form>
    </section>
  );
}
