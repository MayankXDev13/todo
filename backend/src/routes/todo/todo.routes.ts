import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  toggleTodo,
  updateTodo,
} from "../../controllers/todo/todo.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

// Apply verifyJWT to all routes
router.use(verifyJWT);

// /todos
// GET  -> Get all todos (supports ?page, ?limit, ?search, ?completed, ?priority, ?sortBy, ?sortOrder)
// POST -> Create a new todo
router.route("/").get(getTodos).post(createTodo);

// /todos/:id
// GET    -> Get a single todo by ID
// PUT    -> Update a todo by ID
// DELETE -> Delete a todo by ID
router.route("/:id").get(getTodoById).put(updateTodo).delete(deleteTodo);

// /todos/:id/toggle
// PATCH -> Toggle the completed status of a todo
router.route("/:id/toggle").patch(toggleTodo);

export default router;