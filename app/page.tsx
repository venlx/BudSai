"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState } from "react";
import React from "react";
import { EditableFields } from "@/convex/constants";

export default function Home() {
  const transactions = useQuery(api.manageTransactions.getAllTransactions);
  const addTransaction = useMutation(api.manageTransactions.addTransaction);
  const removeTransaction = useMutation(
    api.manageTransactions.removeTransaction,
  );
  const updateTransaction = useMutation(
    api.manageTransactions.updateTransaction,
  );
  const categories = useQuery(api.manageCategories.getAllCategories);
  const [editing, setEditing] = useState<{
    id: Id<"transactions">;
    field: EditableFields;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState<Id<"categories"> | null>(
    categories && categories.length > 0 ? categories[0]._id : null,
  );
  const [newValue, setNewValue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editable, setEditable] = useState(false);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  type ImportRow = {
    date: number;
    value: number;
    recipient: string;
    purpose: string;
    umsatztyp: string;
    category: Id<"categories"> | "";
    description: string;
  };
  const [importRows, setImportRows] = useState<ImportRow[]>([]);

  function handleCSVImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.trim().split("\n");
      // header is on row 5 (index 4), data starts at index 5
      const header = lines[4].split(";").map((h) => h.replace(/"/g, "").trim());
      const dateIdx = header.indexOf("Buchungsdatum");
      const valueIdx = header.indexOf("Betrag (€)");
      const umsatzIdx = header.indexOf("Umsatztyp");
      const recipientIdx = header.indexOf("Zahlungsempfänger*in");
      const payerIdx = header.indexOf("Zahlungspflichtige*r");
      const purposeIdx = header.indexOf("Verwendungszweck");
      const rows = lines.slice(5).map((line) => {
        const cols = line.split(";").map((c) => c.replace(/"/g, "").trim());
        const [day, month, year] = cols[dateIdx].split(".");
        const fullYear =
          Number(year) < 100 ? 2000 + Number(year) : Number(year);
        const date = new Date(
          fullYear,
          Number(month) - 1,
          Number(day),
        ).getTime();
        const value = Math.abs(
          parseFloat(cols[valueIdx].replace(".", "").replace(",", ".")),
        );
        const umsatztyp = cols[umsatzIdx] ?? "";
        return {
          date,
          value,
          umsatztyp,
          recipient:
            umsatztyp === "Eingang"
              ? (cols[payerIdx] ?? "")
              : (cols[recipientIdx] ?? ""),
          purpose: cols[purposeIdx] ?? "",
          category: "" as Id<"categories"> | "",
          description: "",
        };
      });
      setImportRows(rows);
    };
    reader.readAsText(file);
  }

  function updateImportRow(index: number, fields: Partial<ImportRow>) {
    setImportRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...fields } : row)),
    );
  }

  function startEdit(
    id: Id<"transactions">,
    field: EditableFields,
    current: string,
  ) {
    setEditing({ id, field });
    setEditValue(current);
  }

  function commitEdit() {
    if (!editing) return;
    if (editing.field === EditableFields.Date) {
      const ts = new Date(editValue).getTime();
      if (!isNaN(ts)) updateTransaction({ id: editing.id, date: ts });
    } else if (editing.field === EditableFields.Category) {
      if (editValue)
        updateTransaction({
          id: editing.id,
          category: editValue as Id<"categories">,
        });
    } else if (editing.field === EditableFields.Value) {
      const n = parseFloat(editValue);
      if (!isNaN(n)) updateTransaction({ id: editing.id, value: n });
    } else if (editing.field === EditableFields.Description) {
      updateTransaction({ id: editing.id, description: editValue });
    }
    setEditing(null);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(null);
  }

  function commitImport() {
    importRows.forEach(({ date, value, category, description }) => {
      if (!category) return;
      addTransaction({
        date,
        value,
        category,
        ...(description && { description }),
      });
    });
    setImportRows([]);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-2xl mb-6">Transactions</h1>
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        <label className="px-3 py-2 rounded border bg-third-color text-primary-color cursor-pointer">
          Import CSV
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCSVImport}
          />
        </label>
      </div>
      {importRows.length > 0 && (
        <div className="w-full  mb-8">
          <h2 className="text-xl mb-2">Review Import</h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Value</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Recipient</th>
                <th className="px-4 py-2">Purpose</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {importRows.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">
                    {new Date(row.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-2">{row.value}€</td>
                  <td className="px-4 py-2">{row.umsatztyp}</td>
                  <td className="px-4 py-2">{row.recipient}</td>
                  <td className="px-4 py-2" title={row.purpose}>
                    {row.purpose}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={row.category}
                      onChange={(e) =>
                        updateImportRow(i, {
                          category: e.target.value as Id<"categories">,
                        })
                      }
                      className="px-2 py-1 border rounded"
                    >
                      <option value="">— pick —</option>
                      {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        updateImportRow(i, { description: e.target.value })
                      }
                      className="px-2 py-1 border rounded"
                      placeholder="(optional)"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() =>
                        setImportRows((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="px-2 py-1 bg-third-color text-primary-color rounded"
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={commitImport}
            className="mt-2 px-4 py-2 bg-third-color text-primary-color rounded"
            disabled={importRows.every((r) => !r.category)}
          >
            Import all
          </button>
        </div>
      )}
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex gap-2 items-center justify-center flex-wrap">
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="px-2 py-1 border rounded"
          />
          <span>–</span>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="px-2 py-1 border rounded"
          />
          {(filterFrom || filterTo) && (
            <button
              onClick={() => {
                setFilterFrom("");
                setFilterTo("");
              }}
              className="px-3 py-1 rounded border"
            >
              Clear
            </button>
          )}
        </div>
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
                  if (!newCategory) return;
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
                .filter((t) => {
                  if (filterFrom && t.date < new Date(filterFrom).getTime())
                    return false;
                  if (
                    filterTo &&
                    t.date > new Date(filterTo).getTime() + 86399999
                  )
                    return false;
                  return true;
                })
                .sort((a, b) => b.date - a.date)
                .map(({ _id, date, category, value, description }) => (
                  <tr key={_id} className="border-b">
                    <td
                      className={`px-4 py-2${editable ? " cursor-pointer rounded hover:bg-third-color" : ""}`}
                      onClick={() =>
                        editable &&
                        startEdit(
                          _id,
                          EditableFields.Date,
                          new Date(date).toISOString().slice(0, 10),
                        )
                      }
                    >
                      {editing?.id === _id &&
                      editing?.field === EditableFields.Date ? (
                        <input
                          autoFocus
                          type="date"
                          className="border rounded px-2 py-1 bg-primary-color outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : (
                        new Date(date).toLocaleDateString()
                      )}
                    </td>
                    <td
                      className={`px-4 py-2${editable ? " cursor-pointer rounded hover:bg-third-color" : ""}`}
                      onClick={() =>
                        editable &&
                        startEdit(_id, EditableFields.Category, category)
                      }
                    >
                      {editing?.id === _id &&
                      editing?.field === EditableFields.Category ? (
                        <select
                          autoFocus
                          className="border rounded px-2 py-1 bg-primary-color outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleEditKeyDown}
                        >
                          {categories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        categories?.find((cat) => cat._id === category)?.name ||
                        "Unknown Category"
                      )}
                    </td>
                    <td
                      className={`px-4 py-2${editable ? " cursor-pointer rounded hover:bg-third-color" : ""}`}
                      onClick={() =>
                        editable &&
                        startEdit(_id, EditableFields.Value, value.toString())
                      }
                    >
                      {editing?.id === _id &&
                      editing?.field === EditableFields.Value ? (
                        <input
                          autoFocus
                          type="number"
                          className="border rounded px-2 py-1 w-24 bg-primary-color outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : (
                        `${value}€`
                      )}
                    </td>
                    <td
                      className={`px-4 py-2${editable ? " cursor-pointer rounded hover:bg-third-color" : ""}`}
                      onClick={() =>
                        editable &&
                        startEdit(
                          _id,
                          EditableFields.Description,
                          description ?? "",
                        )
                      }
                    >
                      {editing?.id === _id &&
                      editing?.field === EditableFields.Description ? (
                        <input
                          autoFocus
                          type="text"
                          className="border rounded px-2 py-1 bg-primary-color outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : (
                        description
                      )}
                    </td>
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

        <div className="mt-2">
          <button
            onClick={() => setEditable(!editable)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-third-color text-primary-color rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
            title="Toggle Editing"
          >
            {editable ? "✕" : "✎"}
          </button>
        </div>
      </div>
    </main>
  );
}
