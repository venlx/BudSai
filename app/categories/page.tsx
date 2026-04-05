"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import React from "react";

export default function Home() {
  const categories = useQuery(api.manageCategories.getAllCategories);
  const addCategory = useMutation(api.manageCategories.addCategory);
  const removeCategory = useMutation(api.manageCategories.removeCategory);
  const [editable, setEditable] = useState(false);
  const [newExpense, setNewExpense] = useState(true);
  const [newName, setNewName] = useState("");
  const [newParent, setNewParent] = useState<Id<"categories"> | undefined>(
    undefined,
  );
  const [newBudget, setNewBudget] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-2xl mb-6">Categories</h1>
      <div className="w-full max-w-4xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Expense/Income</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Budget</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length ? (
              categories.map(
                ({ _id, expense, parent, name, monthlyBudget }) => (
                  <React.Fragment key={_id}>
                    {!parent && (
                      <tr className="border-b">
                        <td className="px-4 py-2">
                          {expense ? "Expense" : "Income"}
                        </td>
                        <td className="px-4 py-2">{name}</td>
                        <td className="px-4 py-2">
                          {monthlyBudget != null ? `${monthlyBudget}€` : "-"}
                        </td>
                        <td className="px-4 py-2">
                          {editable && (
                            <button
                              className="px-4 py-2 bg-third-color text-primary-color rounded"
                              onClick={() => {
                                removeCategory({ id: _id });
                                if (newParent === _id) setNewParent(undefined);
                              }}
                            >
                              -
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                    {categories
                      ?.filter((child) => child.parent === _id)
                      .map((child) => (
                        <tr key={child._id} className="border-b">
                          <td className="px-8 py-2">
                            ↳ {child.expense ? "Expense" : "Income"}
                          </td>
                          <td className="px-4 py-2">{child.name}</td>
                          <td className="px-4 py-2">
                            {child.monthlyBudget != null
                              ? `${child.monthlyBudget}€`
                              : "-"}
                          </td>
                          <td className="px-4 py-2">
                            {editable && (
                              <button
                                className="px-4 py-2 bg-third-color text-primary-color rounded"
                                onClick={() =>
                                  removeCategory({ id: child._id })
                                }
                              >
                                -
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ),
              )
            ) : (
              <tr>
                <td className="px-4 py-2" colSpan={3}>
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {editable && (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <select
                value={newExpense ? "expense" : "income"}
                onChange={(e) => setNewExpense(e.target.value === "expense")}
                className="px-2 py-1 border rounded"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                value={newParent || ""}
                onChange={(e) =>
                  setNewParent(
                    (e.target.value as Id<"categories">) || undefined,
                  )
                }
                className="px-2 py-1 border rounded"
              >
                <option value="">Select main category</option>
                {categories?.map(
                  (cat) =>
                    !cat.parent && (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ),
                )}
              </select>
              <input
                type="text"
                placeholder="Category name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-2 py-1 border rounded"
              />
              <input
                type="number"
                placeholder="(Budget)"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="px-2 py-1 border rounded w-24"
              />
              <button
                onClick={() => {
                  const newCategory = {
                    expense: newExpense,
                    name: newName,
                    parent: newParent,
                    ...(newBudget && { monthlyBudget: Number(newBudget) }),
                  };
                  addCategory(newCategory);
                  setNewName("");
                  setNewParent(undefined);
                  setNewBudget("");
                }}
                className="px-4 py-2 bg-third-color text-primary-color rounded"
                disabled={!newName}
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
