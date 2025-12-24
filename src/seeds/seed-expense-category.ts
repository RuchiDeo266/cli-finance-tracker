import { logger } from "../logs/prod-app.ts";
import CategoryModel from "../models/category-model.ts";
import { INITIAL_CATEGORIES } from "../config/constants.ts";

export const seedCategories = async () => {
  // verify the imported model resolved and expose expected API
  try {
    const documents = await CategoryModel.countDocuments();
    if (documents === 0) {
      CategoryModel.insertMany(INITIAL_CATEGORIES);
      logger.info("Categories seeded successfully");
    } else {
      logger.info("Categories already exists");
    }
  } catch (error: any) {
    logger.error(error);
  }
};
