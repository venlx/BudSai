"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import React from "react";
import { EditableFields, CategoryType } from "@/convex/constants";

export default function Home() {
  const categories = useQuery(api.manageCategories.getAllCategories);
  const addCategory = useMutation(api.manageCategories.addCategory);
  const removeCategory = useMutation(api.manageCategories.removeCategory);
  const updateCategory = useMutation(api.manageCategories.updateCategory);
  const [editable, setEditable] = useState(false);
  const [editing, setEditing] = useState<{
    id: Id<"categories">;
    field: EditableFields;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  function startEdit(
    id: Id<"categories">,
    field: EditableFields,
    current: string,
  ) {
    setEditing({ id, field });
    setEditValue(current);
  }

  function commitEdit() {
    if (!editing) return;
    if (editing.field === EditableFields.Name && editValue.trim()) {
      updateCategory({ id: editing.id, name: editValue.trim() });
    } else if (editing.field === EditableFields.MonthlyBudget) {
      const n = parseFloat(editValue);
      updateCategory({
        id: editing.id,
        monthlyBudget: isNaN(n) ? undefined : n,
      });
    } else if (editing.field === EditableFields.Type) {
      updateCategory({
        id: editing.id,
        type: editValue as CategoryType,
      });
    }
    setEditing(null);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(null);
  }
  const [newType, setNewType] = useState<CategoryType>(CategoryType.Expense);
  const [newName, setNewName] = useState("");
  const [newParent, setNewParent] = useState<Id<"categories"> | undefined>(
    undefined,
  );
  const [newBudget, setNewBudget] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggleCollapsed(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-2xl mb-6">Categories</h1>
      <div className="w-full max-w-4xl">
        {editable && (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as CategoryType)}
                className="px-2 py-1 border rounded"
              >
                {Object.values(CategoryType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
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
                  addCategory({
                    type: newType,
                    name: newName,
                    parent: newParent,
                    ...(newBudget && { monthlyBudget: Number(newBudget) }),
                  });
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
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Budget</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length ? (
              categories
                .sort((a, b) => b.type.localeCompare(a.type))
                .map(({ _id, type, parent, name, monthlyBudget }) => (
                  <React.Fragment key={_id}>
                    {!parent && (
                      <tr
                        className="border-b"
                        onClick={() => toggleCollapsed(_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="px-4 py-2 flex gap-2 items-center">
                          {categories.some((c) => c.parent === _id) && (
                            <span className=" bg-third-color text-primary-color rounded-2xl w-5 text-center">
                              {collapsed.has(_id) ? "▼" : "▲"}
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-2${editable ? " cursor-pointer rounded hover:bg-third-color" : ""}`}
                          onClick={() =>
                            editable &&
                            startEdit(_id, EditableFields.Type, type)
                          }
                        >
                          {editing?.id === _id && editing?.field === "type" ? (
                            <select
                              autoFocus
                              className="border rounded px-2 py-1 bg-primary-color outline-none"
                              value={editValue}
                              onChange={(e) => {
                                updateCategory({
                                  id: _id,
                                  type: e.target.value as CategoryType,
                                });
                                setEditing(null);
                              }}
                              onBlur={() => setEditing(null)}
                            >
                              {Object.values(CategoryType).map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          ) : (
                            type
                          )}
                        </td>
                        <td
                          className={`px-4 py-2${editable ? "cursor-pointer rounded hover:bg-third-color" : ""}`}
                          onClick={() =>
                            editable &&
                            startEdit(_id, EditableFields.Name, name)
                          }
                        >
                          {editing?.id === _id &&
                          editing?.field === EditableFields.Name ? (
                            <input
                              autoFocus
                              className="border rounded px-2 py-1 bg-primary-color outline-none"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={handleEditKeyDown}
                            />
                          ) : (
                            name
                          )}
                        </td>
                        <td
                          className={`px-4 py-2${editable ? "cursor-pointer rounded hover:bg-third-color" : ""}`}
                          onClick={() =>
                            editable &&
                            startEdit(
                              _id,
                              EditableFields.MonthlyBudget,
                              monthlyBudget?.toString() ?? "",
                            )
                          }
                        >
                          {editing?.id === _id &&
                          editing?.field === EditableFields.MonthlyBudget ? (
                            <input
                              autoFocus
                              className="border rounded px-2 py-1 w-20 bg-primary-color outline-none"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={handleEditKeyDown}
                            />
                          ) : monthlyBudget != null ? (
                            `${monthlyBudget}€`
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editable && (
                            <button
                              className="px-4 py-2 bg-third-color text-primary-color rounded"
                              onClick={(e) => {
                                e.stopPropagation();
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
                    {!collapsed.has(_id) &&
                      categories
                        ?.filter((child) => child.parent === _id)
                        .map((child) => (
                          <tr key={child._id} className="border-b">
                            <td className="px-4 py-2"></td>
                            <td
                              className={`px-8 py-2${editable ? " cursor-pointer rounded hover:bg-third-color" : ""}`}
                              onClick={() =>
                                editable &&
                                startEdit(
                                  child._id,
                                  EditableFields.Type,
                                  child.type,
                                )
                              }
                            >
                              {editing?.id === EditableFields.Type &&
                              editing?.field === "type" ? (
                                <select
                                  autoFocus
                                  className="border rounded px-2 py-1 bg-primary-color outline-none"
                                  value={editValue}
                                  onChange={(e) => {
                                    updateCategory({
                                      id: child._id,
                                      type: e.target.value as CategoryType,
                                    });
                                    setEditing(null);
                                  }}
                                  onBlur={() => setEditing(null)}
                                >
                                  {Object.values(CategoryType).map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <>↳ {child.type}</>
                              )}
                            </td>
                            <td
                              className={`px-4 py-2${editable ? "cursor-pointer hover:bg-third-color" : ""}`}
                              onClick={() =>
                                editable &&
                                startEdit(
                                  child._id,
                                  EditableFields.Name,
                                  child.name,
                                )
                              }
                            >
                              {editing?.id === child._id &&
                              editing?.field === EditableFields.Name ? (
                                <input
                                  autoFocus
                                  className="border rounded px-2 py-1 bg-primary-color outline-none"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={commitEdit}
                                  onKeyDown={handleEditKeyDown}
                                />
                              ) : (
                                child.name
                              )}
                            </td>
                            <td
                              className={`px-4 py-2${editable ? " cursor-pointer hover:bg-third-color" : ""}`}
                              onClick={() =>
                                editable &&
                                startEdit(
                                  child._id,
                                  EditableFields.MonthlyBudget,
                                  child.monthlyBudget?.toString() ?? "",
                                )
                              }
                            >
                              {editing?.id === child._id &&
                              editing?.field ===
                                EditableFields.MonthlyBudget ? (
                                <input
                                  autoFocus
                                  className="border rounded px-2 py-1 bg-primary-color outline-none"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={commitEdit}
                                  onKeyDown={handleEditKeyDown}
                                />
                              ) : child.monthlyBudget != null ? (
                                `${child.monthlyBudget}€`
                              ) : (
                                "-"
                              )}
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
                ))
            ) : (
              <tr>
                <td className="px-4 py-2" colSpan={3}>
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button
          onClick={() => setEditable(!editable)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-third-color text-primary-color rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
          title="Toggle Editing"
        >
          {editable ? "✕" : "✎"}
        </button>
      </div>
    </main>
  );
}
