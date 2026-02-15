import Navbar from '@/components/todos/Navbar'
import React from 'react'
import { Metadata } from 'next';
import { TodoList } from '@/components/todos/TodoList';

export const metadata: Metadata = {
  title: 'My Todos - TodoApp',
  description: 'Manage your todos',
};

function TodosPage() {
  return (
    <div className='mx-auto max-w-6xl w-full px-4 py-6'>
      <Navbar/>
      <div className="mt-8">
        <TodoList/>
      </div>
    </div>
  )
}

export default TodosPage
