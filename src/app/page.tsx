"use client";

import { useState, useEffect, useCallback } from "react";
import type { Todo } from "@/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 一覧取得
  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 作成
  const handleAddTodo = async () => {
    if (inputValue.trim() === "") return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: inputValue.trim() }),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInputValue("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  // 削除
  const handleDeleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // 完了/未完了切替
  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_done: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to toggle todo");

      const updatedTodo = await res.json();
      setTodos(
        todos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          TODOアプリ
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* 入力フォーム */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="新しいTODOを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddTodo}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              追加
            </button>
          </div>

          {/* TODOリスト */}
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              TODOがありません
            </p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.is_done}
                      onChange={() => handleToggleTodo(todo.id, todo.is_done)}
                      className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className={
                        todo.is_done
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }
                    >
                      {todo.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
