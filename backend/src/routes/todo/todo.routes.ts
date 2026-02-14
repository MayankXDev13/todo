import { Router } from "express";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "../../controllers/todo/todo.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { validate, validateQuery, validateParams } from "../../middlewares/validation.middleware";
import {
  createTodoSchema,
  updateTodoSchema,
  todoIdSchema,
  getTodosQuerySchema,
} from "../../validations/todo.validation";

const router = Router();

router.route("/").post(verifyJWT, validate(createTodoSchema), createTodo);

// /todos -> Get all todos for authenticated user (default pagination)
// /todos?page=2&limit=20 -> Get todos with custom pagination
// /todos?search=shopping -> Search todos by title or description
// /todos?completed=true/false -> Get todos by completed status
// /todos?priority=high/medium/low -> Get todos by priority
router.route("/").get(verifyJWT, validateQuery(getTodosQuerySchema), getTodos);

router.route("/:id").get(verifyJWT, validateParams(todoIdSchema), getTodoById);
router.route("/:id").put(verifyJWT, validateParams(todoIdSchema), validate(updateTodoSchema), updateTodo);
router.route("/:id").delete(verifyJWT, validateParams(todoIdSchema), deleteTodo);
export default router;
