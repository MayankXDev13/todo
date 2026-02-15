import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
} from "../../controllers/category/category.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

// Apply verifyJWT to all routes
router.use(verifyJWT);

// /categories
// GET  -> Get all categories (supports ?page, ?limit, ?search, ?sortBy, ?sortOrder)
// POST -> Create a new category
router.route("/").get(getCategories).post(createCategory);

// /categories/:id
// GET    -> Get a single category by ID
// PUT    -> Update a category by ID
// DELETE -> Delete a category by ID
router.route("/:id").get(getCategoryById).put(updateCategory).delete(deleteCategory);

export default router;
