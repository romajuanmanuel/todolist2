// src/todoList.js
import Todo from './todo.js';

export default class TodoList {
  constructor() {
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(index) {
    this.todos.splice(index, 1);
  }

  getTodos() {
    return this.todos;
  }

  getCompleted() {
    return this.todos.filter(todo => todo.completed);
  }

  getPending() {
    return this.todos.filter(todo => !todo.completed);
  }

  clearAll() {
    this.todos = [];
  }
  saveToLocalStorage() {
    const serialized = JSON.stringify(this.todos);
    localStorage.setItem('todos', serialized);
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem('todos');
    if (data) {
      const parsed = JSON.parse(data);
      this.todos = parsed.map(obj => {
        const todo = new Todo(obj.title, obj.description, obj.dueDate, obj.completed);
        return todo;
      });
    }
  }
  sortByDueDate() {
    this.todos.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  sortByTitle() {
    this.todos.sort((a, b) => a.title.localeCompare(b.title));
  }

  sortByCompletion() {
    this.todos.sort((a, b) => a.completed - b.completed);
  }

}
