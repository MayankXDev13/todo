'use client';

import { useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useTodos } from '@/hooks/api/todos';
import { TodoItem } from '@/components/todos/todo-item';
import { TodoListSkeleton } from '@/components/todos/todo-list-skeleton';
import { Pagination } from '@/components/todos/pagination';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaCheckSquare } from 'react-icons/fa';

export function TodoList() {
  const [page, setPage] = useState(1);
  const { todoFilters } = useUIStore();
  
  const { data, isLoading, isError, error } = useTodos({
    page,
    limit: 10,
    search: todoFilters.search || undefined,
    completed: todoFilters.completed ?? undefined,
    priority: todoFilters.priority ?? undefined,
  });

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load todos. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const todos = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FaCheckSquare className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No todos yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {todoFilters.search || todoFilters.completed !== null || todoFilters.priority
            ? 'No todos match your filters. Try adjusting your search criteria.'
            : 'Get started by creating your first todo!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
      
      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
