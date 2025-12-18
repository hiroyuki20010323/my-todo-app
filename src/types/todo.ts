export interface Todo {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  title: string;
}

export interface ToggleTodoInput {
  is_done: boolean;
}

