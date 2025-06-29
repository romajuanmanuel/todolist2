// src/renderTasks.js

export const renderTasks = (todoList, container, filter = 'todas') => {
  container.innerHTML = ''; // Limpiar el contenedor

  let todos = [];

  switch (filter) {
    case 'completadas':
      todos = todoList.getCompleted();
      break;
    case 'pendientes':
      todos = todoList.getPending();
      break;
    default:
      todos = todoList.getTodos();
      break;
  }

  if (todos.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-message';
    emptyMsg.textContent = 'No hay tareas aún.';
    container.append(emptyMsg);
    return;
  }

  // Crear contenedor de lista
  const taskList = document.createElement('div');
  taskList.className = 'task-list';
  container.append(taskList);

  todos.forEach((todo, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    // Resaltar si está vencida
    if (todo.isOverdue()) {
      taskItem.classList.add('overdue');
    }

    // Resaltar si está completada
    if (todo.completed) {
      taskItem.classList.add('completed');
    }

    // Checkbox para completar/descompletar
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todo.toggleComplete();
      todoList.saveToLocalStorage();
      renderTasks(todoList, container, filter);
    });

    // Contenido de la tarea
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    // Título
    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = todo.title;
    if (todo.completed) {
      title.classList.add('completed-text');
    }

    // Descripción (si existe)
    let descElement = null;
    if (todo.description) {
      descElement = document.createElement('p');
      descElement.className = 'task-description';
      descElement.textContent = todo.description;
    }

    // Fecha de vencimiento
    const dueDate = document.createElement('span');
    dueDate.className = 'task-due-date';
    dueDate.textContent = todo.getDueDateFormatted();
    if (todo.isOverdue() && !todo.completed) {
      dueDate.classList.add('overdue-text');
    }

    // Botones de acción
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Botón de eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Eliminar tarea';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Encontrar el índice correcto en la lista completa
      const allTodos = todoList.getTodos();
      const actualIndex = allTodos.findIndex(t =>
        t.title === todo.title &&
        t.description === todo.description &&
        t.dueDate === todo.dueDate
      );

      if (actualIndex !== -1) {
        todoList.removeTodo(actualIndex);
        todoList.saveToLocalStorage();

        // Mostrar notificación de eliminación
        const notification = document.createElement('div');
        notification.className = 'notification delete-notification';
        notification.textContent = 'Tarea eliminada';
        document.body.append(notification);
        setTimeout(() => notification.remove(), 3000);

        renderTasks(todoList, container, filter);
      }
    });

    // Botón de editar (puedes implementar esta funcionalidad después)
    const editBtn = document.createElement('button');
    editBtn.className = 'task-edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Editar tarea';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(todo, index, todoList, container, filter);
    });

    actions.append(editBtn, deleteBtn);

    // Construir la estructura
    taskContent.append(title);
    if (descElement) taskContent.append(descElement);
    taskContent.append(dueDate);

    taskItem.append(checkbox, taskContent, actions);
    taskList.append(taskItem);
    const openEditModal = (todo, index, todoList, container, filter) => {
      // Crear modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Editar Tarea</h2>
            <form id="editForm">
                <div class="form-group">
                    <label for="editTitle">Título:</label>
                    <input type="text" id="editTitle" value="${todo.title}" required minlength="3" maxlength="50">
                </div>
                <div class="form-group">
                    <label for="editDesc">Descripción:</label>
                    <textarea id="editDesc" rows="3">${todo.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="editDueDate">Fecha de vencimiento:</label>
                    <input type="date" id="editDueDate" value="${todo.dueDate || ''}">
                </div>
                <button type="submit" class="submit-btn">Guardar Cambios</button>
            </form>
        </div>
    `;

      document.body.append(modal);
      modal.style.display = 'block';

      // Cerrar modal
      const closeBtn = modal.querySelector('.close-modal');
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });

      // Manejar el envío del formulario
      const editForm = modal.querySelector('#editForm');
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = editForm.querySelector('#editTitle').value.trim();
        const description = editForm.querySelector('#editDesc').value.trim();
        const dueDate = editForm.querySelector('#editDueDate').value || null;

        // Actualizar la tarea
        todo.title = title;
        todo.description = description;
        todo.dueDate = dueDate;

        todoList.saveToLocalStorage();
        renderTasks(todoList, container, filter);
        modal.remove();

        // Mostrar notificación
        const notification = document.createElement('div');
        notification.className = 'notification success-notification';
        notification.textContent = 'Tarea actualizada correctamente';
        document.body.append(notification);
        setTimeout(() => notification.remove(), 3000);
      });

      // Cerrar al hacer clic fuera del modal
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };
  });
};
