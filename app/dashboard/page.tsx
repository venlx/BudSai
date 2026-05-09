"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import React, { useState } from "react";
import { CategoryType, FilterMode, isPositiveNumber } from "@/convex/constants";

function getOverBudgetColor(type: CategoryType, over: boolean) {
  if (!over) return "";
  return isPositiveNumber(type) ? "text-third-color" : "text-red-800";
}

function getCategoryStats(
  categoryId: string,
  filteredTransactions: { category: string; value: number }[] | undefined,
  categories: { _id: string; parent?: string }[] | undefined,
  monthlyBudget: number | null | undefined,
) {
  const spent =
    filteredTransactions
      ?.filter(
        (transaction) =>
          transaction.category === categoryId ||
          categories?.find((category) => category._id === transaction.category)
            ?.parent === categoryId,
      )
      .reduce((sum, transaction) => sum + transaction.value, 0) ?? 0;
  const pct =
    monthlyBudget != null && monthlyBudget > 0
      ? Math.round((spent / monthlyBudget) * 100)
      : null;
  const over = pct != null && pct > 100;
  return { spent, pct, over };
}

function returnTableData(
  type: CategoryType,
  name: string,
  monthlyBudget: number | null | undefined,
  spent: number,
  pct: number | null,
  over: boolean,
  child: boolean,
) {
  return (
    <tr className="border-b" key={name}>
      <td className="px-4 py-2">
        {child ? "↳ " : ""}
        {type}
      </td>
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">
        {monthlyBudget != null ? `${monthlyBudget}€` : "-"}
      </td>
      <td className={`px-4 py-2 ${getOverBudgetColor(type, over)}`}>
        {spent.toFixed(2)}€
      </td>
      <td className={`px-4 py-2 ${getOverBudgetColor(type, over)}`}>
        {pct != null ? `${pct}%` : "-"}
      </td>
    </tr>
  );
}

export default function Home() {
  const categories = useQuery(api.manageCategories.getAllCategories);
  const transactions = useQuery(api.manageTransactions.getAllTransactions);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.Month);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const [anchorCategory, setAnchorCategory] = useState("");
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const today = useState(() => Date.now())[0];

  const anchorDates =
    transactions
      ?.filter((transaction) => transaction.category === anchorCategory)
      .map((transaction) => transaction.date)
      .sort((a, b) => a - b) ?? [];

  const periods =
    anchorDates.length > 0
      ? [
          ...anchorDates.slice(0, -1).map((start, i) => ({
            start,
            end: anchorDates[i + 1],
          })),
          { start: anchorDates[anchorDates.length - 1], end: today },
        ]
      : [];

  const filteredTransactions = transactions?.filter((transaction) => {
    if (filterMode === FilterMode.Month) {
      const date = new Date(transaction.date);
      return (
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` ===
        selectedMonth
      );
    } else {
      const period = periods[selectedPeriodIndex];
      if (!period) return false;
      return transaction.date >= period.start && transaction.date < period.end;
    }
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-2xl mb-6">Dashboard</h1>
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        <button
          onClick={() => setFilterMode(FilterMode.Month)}
          className={`px-3 py-1 rounded border ${filterMode === FilterMode.Month ? "bg-third-color text-primary-color" : ""}`}
        >
          Month
        </button>
        <button
          onClick={() => setFilterMode(FilterMode.Period)}
          className={`px-3 py-1 rounded border ${filterMode === FilterMode.Period ? "bg-third-color text-primary-color" : ""}`}
        >
          Period
        </button>
        {filterMode === FilterMode.Month &&
          (() => {
            const dates = [
              ...new Set(
                transactions?.map((transaction) => {
                  const date = new Date(transaction.date);
                  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                }),
              ),
            ].sort();
            return (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                {dates.map((date) => {
                  const [year, month] = date.split("-");
                  const label = new Date(
                    Number(year),
                    Number(month) - 1,
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                  });
                  return (
                    <option key={date} value={date}>
                      {label}
                    </option>
                  );
                })}
              </select>
            );
          })()}
        {filterMode === FilterMode.Period && (
          <>
            <select
              value={anchorCategory}
              onChange={(e) => {
                setAnchorCategory(e.target.value);
                setSelectedPeriodIndex(0);
              }}
              className="px-3 py-2 border rounded"
            >
              <option value="">Select anchor category</option>
              {categories
                ?.sort((a, b) => b.type.localeCompare(a.type))
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {periods.length > 0 && (
              <select
                value={selectedPeriodIndex}
                onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
                className="px-3 py-2 border rounded"
              >
                {periods
                  .sort((a, b) => b.start - a.start)
                  .map((period, index) => (
                    <option
                      key={index}
                      value={index}
                      className="px-3 py-2 border rounded"
                    >
                      {new Date(period.start).toLocaleDateString()} –{" "}
                      {period.end === today
                        ? "Today"
                        : new Date(period.end).toLocaleDateString()}
                    </option>
                  ))}
              </select>
            )}
          </>
        )}
      </div>
      <div className="w-full max-w-4xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Budget</th>
              <th className="px-4 py-2">Spent(€)</th>
              <th className="px-4 py-2">Spent(%)</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length ? (
              categories.map(({ _id, type, parent, name, monthlyBudget }) => (
                <React.Fragment key={_id}>
                  {!parent &&
                    (() => {
                      const { spent, pct, over } = getCategoryStats(
                        _id,
                        filteredTransactions,
                        categories,
                        monthlyBudget,
                      );
                      return returnTableData(
                        type,
                        name,
                        monthlyBudget,
                        spent,
                        pct,
                        over,
                        false,
                      );
                    })()}
                  {categories
                    ?.filter((child) => child.parent === _id)
                    .map((child) => {
                      const { spent, pct, over } = getCategoryStats(
                        child._id,
                        filteredTransactions,
                        categories,
                        child.monthlyBudget,
                      );
                      return returnTableData(
                        child.type,
                        child.name,
                        child.monthlyBudget,
                        spent,
                        pct,
                        over,
                        true,
                      );
                    })}
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
      </div>
    </main>
  );
}
