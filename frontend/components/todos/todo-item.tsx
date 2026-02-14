'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  FaCalendarAlt, 
  FaEllipsisH, 
  FaEdit, 
  FaTrashAlt, 
  FaExclamationCircle 
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Todo } from '@/types/models';
import { useToggleTodoCompletion, useDeleteTodo } from '@/hooks/api/todos';
import { EditTodoDialog } from './edit-todo-dialog';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const toggleCompletion = useToggleTodoCompletion();
  const deleteTodo = useDeleteTodo();

  const handleToggle = () => {
    toggleCompletion.mutate({ id: todo.id, isCompleted: !todo.isCompleted });
  };

  const handleDelete = () => {
    deleteTodo.mutate(todo.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
      case 'medium':
        return 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-100';
      case 'low':
        return 'bg-gray-400 text-gray-900 dark:bg-gray-500 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;

  return (
    <>
      <div
        className={cn(
          'group flex items-start gap-3 rounded-lg border p-4 transition-all hover:shadow-sm',
          todo.isCompleted && 'bg-muted/50',
          isOverdue && 'border-gray-400 bg-gray-100/50 dark:border-gray-500 dark:bg-gray-800/20'
        )}
      >
        <Checkbox
          checked={todo.isCompleted}
          onCheckedChange={handleToggle}
          disabled={toggleCompletion.isPending}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                todo.isCompleted && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <FaEllipsisH className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <FaEdit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-gray-700 dark:text-gray-300 focus:text-gray-700 dark:focus:text-gray-300"
                >
                  <FaTrashAlt className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {todo.description && (
            <p className={cn(
              'text-sm text-muted-foreground',
              todo.isCompleted && 'line-through'
            )}>
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 pt-2">
            <span className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              getPriorityColor(todo.priority)
            )}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            
            {todo.dueDate && (
              <span className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-muted-foreground'
              )}>
                <FaCalendarAlt className="h-3 w-3" />
                {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                {isOverdue && <FaExclamationCircle className="h-3 w-3 ml-1" />}
              </span>
            )}
          </div>
        </div>
      </div>

      <EditTodoDialog
        todo={todo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{todo.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteTodo.isPending}
              className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
            >
              {deleteTodo.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
