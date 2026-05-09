export enum CategoryType {
  Expense = "Expense",
  Bill = "Bill",
  Income = "Income",
  Savings = "Savings",
}

export const isPositiveNumber = (type: CategoryType): boolean => {
  return type >= CategoryType.Income;
};

export enum FilterMode {
  Month = "month",
  Period = "period",
}

export enum EditableFields {
  // For categories
  Type = "type",
  Name = "name",
  MonthlyBudget = "monthlyBudget",
  // For transactions
  Date = "date",
  Category = "category",
  Value = "value",
  Description = "description",
}
