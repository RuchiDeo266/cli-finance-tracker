import CategoryModel from "../models/category-model.ts";

export async function validateExpenseCategories(categoryName: string[]) {
  const validCategories = await CategoryModel.find(
    { type: "Expense" },
    { name: 1, _id: 0 }
  ).lean();

  const validNames = new Set(
    validCategories.map((cat) => cat.name.toLowerCase())
  );

  const invalidCategory: string[] = [];

  for (const name of categoryName) {
    if (!validNames.has(name)) {
      invalidCategory.push(name);
    }
  }
  return {
    success: invalidCategory.length === 0,
    invalidCategories: invalidCategory,
  };
}
