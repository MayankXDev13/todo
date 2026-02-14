import { TodoFilters } from '@/components/todos/todo-filters';
import { CreateTodoDialog } from '@/components/todos/create-todo-dialog';

export function TodoHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Todos</h1>
        <p className="text-muted-foreground">
          Manage your tasks and stay organized
        </p>
      </div>
      <CreateTodoDialog />
    </div>
  );
}
