import { validateExpenseCategories } from "../../services/validate-service.ts";
import CategoryModel from "../../models/category-model.ts";

// Ensure the mock path matches the import path used above.
// Using the same relative module id avoids module resolution mismatches.
jest.mock("../../models/category-model.ts", () => ({
  __esModule: true,
  default: { find: jest.fn() },
}));

function mockFindExpenseCategories(data: Array<{ name: string }>) {
  (CategoryModel.find as jest.Mock).mockReturnValue({
    lean: jest.fn().mockResolvedValue(data),
  });
}

describe("validateExpenseCategories", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should fail when category list is empty", async () => {
    mockFindExpenseCategories([{ name: "Food" }]);

    const res = await validateExpenseCategories([]);

    expect(res).toEqual({
      success: false,
      invalidCategories: ["Category list cannot be empty"],
    });
  });

  test("should fail when category list contains an empty string", async () => {
    mockFindExpenseCategories([{ name: "Food" }, { name: "Rent" }]);

    const res = await validateExpenseCategories(["Food", ""]);

    expect(res).toEqual({
      success: false,
      invalidCategories: [""],
    });
  });

  test("should fail when category is missing in the database", async () => {
    mockFindExpenseCategories([{ name: "Food" }, { name: "Rent" }]);

    const res = await validateExpenseCategories(["Food", "Coffee"]);

    expect(res).toEqual({
      success: false,
      invalidCategories: ["Coffee"],
    });
  });

  test("should fail when multiple categories are missing", async () => {
    mockFindExpenseCategories([{ name: "Food" }]);

    const res = await validateExpenseCategories([
      "Food",
      "Coffee",
      "Snacks",
      "rent",
    ]);

    expect(res).toEqual({
      success: false,
      invalidCategories: ["Coffee", "Snacks", "rent"],
    });
  });

  test("should succeed when all categories exist", async () => {
    mockFindExpenseCategories([
      { name: "Food" },
      { name: "Rent" },
      { name: "Bills" },
    ]);

    const res = await validateExpenseCategories(["food", "RENT", "Bills"]);

    expect(res).toEqual({
      success: true,
      invalidCategories: [],
    });
  });
});
