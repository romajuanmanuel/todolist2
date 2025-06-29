// todo.js (actualizado)
export default class Todo {
  constructor(title, description = "", dueDate = null, completed = false) {
    this.title = title;
    this.description = description;
    this.setDueDate(dueDate); // Usar el setter
    this.completed = completed;
  }

  setDueDate(date) {
    this.dueDate = date ? new Date(date).toISOString().split('T')[0] : null;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  getDueDateFormatted() {
    if (!this.dueDate) return 'Sin fecha';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(this.dueDate).toLocaleDateString(undefined, options);
  }

  isOverdue() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }
}
