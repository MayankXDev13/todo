import { Router } from "express";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "../../controllers/todo/todo.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.route("/").post(verifyJWT, createTodo);

// /todos -> Get all todos for authenticated user (default pagination)
// /todos?page=2&limit=20 -> Get todos with custom pagination
// /todos?search=shopping -> Search todos by title or description
// /todos?completed=true/false -> Get todos by completed status
// /todos?priority=high/medium/low -> Get todos by priority
router.route("/").get(verifyJWT, getTodos);

router.route("/:id").get(verifyJWT, getTodoById);
router.route("/:id").put(verifyJWT, updateTodo);
router.route("/:id").delete(verifyJWT, deleteTodo);
export default router;
