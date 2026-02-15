"use client";

import { useState } from "react";
import { useGetAllTodos } from "@/hooks/todo/useGetAllTodos";
import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { TodoFilters } from "./TodoFilters";
import { TodoFormModal } from "./TodoFormModal";
import { GetTodosParams } from "@/types/todo";

export function TodoList() {
  const [filters, setFilters] = useState<GetTodosParams>({
    page: 1,
    limit: 20,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);

  const { data: todosData, isLoading: isLoadingTodos } = useGetAllTodos(filters);
  const { data: categoriesData } = useGetAllCategories();

  const todos = todosData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];

  const getCategoryById = (categoryId: string | null) => {
    if (!categoryId) return undefined;
    return categories.find((cat) => cat.id === categoryId);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTodo(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  };

  if (isLoadingTodos) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Todos</h1>
          <p className="text-muted-foreground">
            {todos.length} task{todos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Todo
        </Button>
      </div>

      <TodoFilters filters={filters} onFiltersChange={setFilters} />

      {todos.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No todos yet</p>
          <Button variant="link" onClick={handleCreate}>
            Create your first todo
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              category={getCategoryById(todo.categoryId)}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <TodoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        todo={editingTodo}
        categories={categories}
      />
    </div>
  );
}
