"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState } from "react";

export default function Home() {
  const transactions = useQuery(api.manageTransactions.getAllTransactions);
  const addTransaction = useMutation(api.manageTransactions.addTransaction);
  const removeTransaction = useMutation(
    api.manageTransactions.removeTransaction,
  );
  const categories = useQuery(api.manageCategories.getAllCategories);
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState<Id<"categories">>(
    categories && categories.length > 0 ? categories[0]._id : "",
  );
  const [newValue, setNewValue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editable, setEditable] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-2xl mb-6">Transactions</h1>
      <div className="w-full max-w-4xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Value</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length ? (
              transactions
                .sort((a, b) => b.date - a.date)
                .map(({ _id, date, category, value, description }) => (
                  <tr key={_id} className="border-b">
                    <td className="px-4 py-2">
                      {new Date(date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {categories
                        ? categories.find((cat) => cat._id === category)
                            ?.name || "Unknown Category"
                        : "Unknown Category"}
                    </td>
                    <td className="px-4 py-2">{value}€</td>
                    <td className="px-4 py-2">{description}</td>
                    <td className="px-4 py-2">
                      {editable && (
                        <button
                          className="px-4 py-2 bg-third-color text-primary-color rounded"
                          onClick={() => removeTransaction({ id: _id })}
                        >
                          -
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td className="px-4 py-2" colSpan={3}>
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {editable && (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-2 py-1 border rounded"
              />
              <select
                value={newCategory || ""}
                onChange={(e) =>
                  setNewCategory(e.target.value as Id<"categories">)
                }
                className="px-2 py-1 border rounded"
              >
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="px-2 py-1 border rounded w-24"
              />
              <input
                type="text"
                placeholder="(Description)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="px-2 py-1 border rounded w-32"
              />
              <button
                onClick={() => {
                  const newTransaction = {
                    date: new Date(newDate).getTime(),
                    category: newCategory,
                    value: Number(newValue),
                    ...(newDescription && { description: newDescription }),
                  };
                  addTransaction(newTransaction);
                  setNewDate("");
                  setNewValue("");
                  setNewDescription("");
                }}
                className="px-4 py-2 bg-third-color text-primary-color rounded"
                disabled={!newValue || !newCategory}
              >
                +
              </button>
            </div>
          </div>
        )}
        <div className="mt-2">
          <button
            onClick={() => setEditable(!editable)}
            className="px-4 py-2 bg-third-color text-primary-color rounded"
          >
            Toggle Editing
          </button>
        </div>
      </div>
    </main>
  );
}
