import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { TodoHeader } from '@/components/todos/todo-header';
import { TodoFilters } from '@/components/todos/todo-filters';
import { TodoList } from '@/components/todos/todo-list';

export const metadata: Metadata = {
  title: 'My Todos - TodoApp',
  description: 'Manage your todos',
};

export default function TodosPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <TodoHeader />
        <TodoFilters />
        <TodoList />
      </div>
    </AppLayout>
  );
}
