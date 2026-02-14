'use client';

import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUIStore } from '@/stores/ui-store';
import { Priority } from '@/types/models';

export function TodoFilters() {
  const { todoFilters, setTodoFilters, resetTodoFilters } = useUIStore();

  const hasActiveFilters = 
    todoFilters.search || 
    todoFilters.completed !== null || 
    todoFilters.priority !== null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search todos..."
          value={todoFilters.search}
          onChange={(e) => setTodoFilters({ search: e.target.value })}
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={todoFilters.completed === null ? 'all' : todoFilters.completed.toString()}
          onValueChange={(value) => {
            if (value === 'all') {
              setTodoFilters({ completed: null });
            } else {
              setTodoFilters({ completed: value === 'true' });
            }
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={todoFilters.priority || 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              setTodoFilters({ priority: null });
            } else {
              setTodoFilters({ priority: value as Priority });
            }
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTodoFilters}
            className="h-9 px-2 text-muted-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
