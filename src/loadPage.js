// src/loadPage.js
import TodoList from './todoList.js';
import Todo from './todo.js';
import { renderTasks } from './renderTasks.js';

export const loadPage = () => {
    // Crear estructura principal
    const content = document.createElement('div');
    content.id = "content";

    // Header
    const header = document.createElement('header');
    header.id = "header";
    
    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'ToDo List';
    header.append(headerTitle);
    
    content.append(header);

    // Área principal de la aplicación
    const app = document.createElement('main');
    app.id = "app";
    content.append(app);

    // Controles de filtrado y ordenación
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';

    // Filtros
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';

    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Filtrar:';
    filterLabel.htmlFor = 'filterSelect';

    const filterSelect = document.createElement('select');
    filterSelect.id = 'filterSelect';

    ['Todas', 'Completadas', 'Pendientes'].forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText.toLowerCase();
        option.textContent = optionText;
        filterSelect.append(option);
    });

    filterContainer.append(filterLabel, filterSelect);
    controlsContainer.append(filterContainer);

    // Ordenación
    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';

    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Ordenar por:';
    sortLabel.htmlFor = 'sortSelect';

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortSelect';

    [
        {value: 'dueDate', text: 'Fecha de vencimiento'},
        {value: 'title', text: 'Título'},
        {value: 'completion', text: 'Estado'}
    ].forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        sortSelect.append(optionElement);
    });

    sortContainer.append(sortLabel, sortSelect);
    controlsContainer.append(sortContainer);

    app.append(controlsContainer);

    // Contenedor de tareas
    const taskListContainer = document.createElement('div');
    taskListContainer.id = 'taskList';
    app.append(taskListContainer);

    // Formulario para añadir tareas
    const form = document.createElement('form');
    form.id = 'taskForm';
    form.setAttribute('aria-label', 'Formulario para añadir tareas');

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Añadir Nueva Tarea';
    form.append(formTitle);

    // Campo de título
    const titleGroup = document.createElement('div');
    titleGroup.className = 'form-group';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Título:';
    titleLabel.htmlFor = 'taskTitle';

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.id = 'taskTitle';
    inputTitle.name = 'title';
    inputTitle.placeholder = 'Título de la tarea';
    inputTitle.required = true;
    inputTitle.minLength = 3;
    inputTitle.maxLength = 50;

    titleGroup.append(titleLabel, inputTitle);
    form.append(titleGroup);

    // Campo de descripción
    const descGroup = document.createElement('div');
    descGroup.className = 'form-group';

    const descLabel = document.createElement('label');
    descLabel.textContent = 'Descripción:';
    descLabel.htmlFor = 'taskDesc';

    const inputDesc = document.createElement('textarea');
    inputDesc.id = 'taskDesc';
    inputDesc.name = 'description';
    inputDesc.placeholder = 'Descripción opcional';
    inputDesc.rows = 3;
    inputDesc.maxLength = 200;

    descGroup.append(descLabel, inputDesc);
    form.append(descGroup);

    // Campo de fecha de vencimiento
    const dateGroup = document.createElement('div');
    dateGroup.className = 'form-group';

    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Fecha de vencimiento:';
    dateLabel.htmlFor = 'taskDueDate';

    const inputDueDate = document.createElement('input');
    inputDueDate.type = 'date';
    inputDueDate.id = 'taskDueDate';
    inputDueDate.name = 'dueDate';
    inputDueDate.min = new Date().toISOString().split('T')[0];

    dateGroup.append(dateLabel, inputDueDate);
    form.append(dateGroup);

    // Mensaje de error
    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-message';
    errorMsg.style.display = 'none';

    // Botón de enviar
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Agregar Tarea';

    form.append(errorMsg, submitBtn);
    app.append(form);

    // Footer
    const footer = document.createElement('footer');
    footer.id = "footer";
    footer.innerHTML = '<p>© Created by Roma for Odin Project 2025</p>';
    content.append(footer);

    // Añadir todo al body
    document.body.append(content);

    // Inicializar lista de tareas
    const todoList = new TodoList();
    todoList.loadFromLocalStorage();

    let currentFilter = 'todas';

    // Render inicial
    renderTasks(todoList, taskListContainer, currentFilter);

    // Evento para agregar nueva tarea
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!inputTitle.checkValidity()) {
            errorMsg.textContent = 'El título debe tener entre 3 y 50 caracteres';
            errorMsg.style.display = 'block';
            return;
        }

        const title = inputTitle.value.trim();
        const description = inputDesc.value.trim();
        const dueDate = inputDueDate.value || null;

        const newTodo = new Todo(title, description, dueDate);
        todoList.addTodo(newTodo);
        todoList.saveToLocalStorage();
        renderTasks(todoList, taskListContainer, currentFilter);
        form.reset();

        // Mostrar notificación
        const notification = document.createElement('div');
        notification.className = 'notification success-notification';
        notification.textContent = 'Tarea añadida correctamente';
        document.body.append(notification);
        setTimeout(() => notification.remove(), 3000);
    });

    // Evento para cambiar filtro
    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderTasks(todoList, taskListContainer, currentFilter);
    });

    // Evento para cambiar ordenación
    sortSelect.addEventListener('change', (e) => {
        switch (e.target.value) {
            case 'dueDate':
                todoList.sortByDueDate();
                break;
            case 'title':
                todoList.sortByTitle();
                break;
            case 'completion':
                todoList.sortByCompletion();
                break;
        }
        todoList.saveToLocalStorage();
        renderTasks(todoList, taskListContainer, currentFilter);
    });

    // Validación en tiempo real
    inputTitle.addEventListener('input', () => {
        if (inputTitle.validity.valid) {
            errorMsg.style.display = 'none';
        } else {
            errorMsg.textContent = 'El título debe tener entre 3 y 50 caracteres';
            errorMsg.style.display = 'block';
        }
    });
};