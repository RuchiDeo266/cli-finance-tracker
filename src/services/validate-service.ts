import CategoryModel from "../models/category-model.ts";

export async function validateExpenseCategories(categoryName: string[]) {
  if (!categoryName || categoryName.length === 0) {
    return {
      success: false,
      invalidCategories: ["Category list cannot be empty"],
    };
  }

  const validCategories = await CategoryModel.find(
    { type: { $in: ["Expense", "Investment", "Income"] } },
    { name: 1, _id: 0 }
  ).lean();

  const validNames = new Set(
    validCategories.map((cat) => cat.name.toLowerCase())
  );

  const invalidCategory: string[] = [];

  for (const name of categoryName) {
    if (!name.trim()) {
      invalidCategory.push(name);
      continue;
    }
    if (!validNames.has(name.toLowerCase())) {
      invalidCategory.push(name);
    }
  }
  return {
    success: invalidCategory.length === 0,
    invalidCategories: invalidCategory,
  };
}
