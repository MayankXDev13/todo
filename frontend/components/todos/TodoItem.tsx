"use client";

import { Todo } from "@/types/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, Pencil, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToggleTodo } from "@/hooks/todo/useToggleTodo";
import { useDeleteTodo } from "@/hooks/todo/useDeleteTodo";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";

interface TodoItemProps {
  todo: Todo;
  category?: Category;
  onEdit: (todo: Todo) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function TodoItem({ todo, category, onEdit }: TodoItemProps) {
  const { mutate: toggleTodo, isPending: isToggling } = useToggleTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;

  return (
    <div
      className={`group flex items-start gap-3 rounded-lg border p-4 transition-all hover:shadow-md ${
        todo.isCompleted ? "bg-muted/50" : "bg-card"
      }`}
    >
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={handleToggle}
        disabled={isToggling}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3
              className={`font-medium ${
                todo.isCompleted
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {todo.description}
              </p>
            )}
            
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className={priorityColors[todo.priority]}
              >
                {todo.priority}
              </Badge>
              
              {category && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {category.name}
                </Badge>
              )}
              
              {todo.dueDate && (
                <span
                  className={`flex items-center gap-1 text-xs ${
                    isOverdue ? "text-red-500" : "text-muted-foreground"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  {format(new Date(todo.dueDate), "MMM d, yyyy")}
                  {isOverdue && " (Overdue)"}
                </span>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(todo)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
