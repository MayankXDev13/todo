import { create } from 'zustand';
import { Priority } from '@/types/models';

interface TodoFilters {
  search: string;
  completed: boolean | null;
  priority: Priority | null;
  categoryId: string | null;
}

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Todo filters
  todoFilters: TodoFilters;
  
  // UI state
  isSidebarOpen: boolean;
  isCreateTodoModalOpen: boolean;
  editingTodoId: string | null;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setTodoFilters: (filters: Partial<TodoFilters>) => void;
  resetTodoFilters: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCreateTodoModalOpen: (isOpen: boolean) => void;
  setEditingTodoId: (id: string | null) => void;
}

const defaultFilters: TodoFilters = {
  search: '',
  completed: null,
  priority: null,
  categoryId: null,
};

export const useUIStore = create<UIState>()((set) => ({
  theme: 'system',
  todoFilters: defaultFilters,
  isSidebarOpen: false,
  isCreateTodoModalOpen: false,
  editingTodoId: null,

  setTheme: (theme) => set({ theme }),
  
  setTodoFilters: (filters) => 
    set((state) => ({ 
      todoFilters: { ...state.todoFilters, ...filters } 
    })),
  
  resetTodoFilters: () => set({ todoFilters: defaultFilters }),
  
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  setCreateTodoModalOpen: (isOpen) => set({ isCreateTodoModalOpen: isOpen }),
  
  setEditingTodoId: (id) => set({ editingTodoId: id }),
}));
