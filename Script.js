document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const searchTaskInput = document.getElementById('search-task');
    const filterTasksSelect = document.getElementById('filter-tasks');
    const themeToggle = document.getElementById('theme-toggle');
    const popup = document.getElementById('popup');
    const editTaskInput = document.getElementById('edit-task');
    const applyEditButton = document.getElementById('apply-edit');
    const cancelEditButton = document.getElementById('cancel-edit');
    const clearAllButton = document.getElementById('clear-all');
    const clearPopup = document.getElementById('clear-popup');
    const confirmClearButton = document.getElementById('confirm-clear');
    const cancelClearButton = document.getElementById('cancel-clear');
    const deletePopup = document.getElementById('delete-popup');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editTaskId = null;
    let deleteTaskId = null;

    const renderTasks = (tasksToRender) => {
        taskList.innerHTML = '';
        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <div class="actions">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            `;
            li.classList.toggle('completed', task.completed);
            taskList.appendChild(li);

            li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(tasks);
            });

            li.querySelector('.edit').addEventListener('click', () => {
                editTaskId = task.id;
                editTaskInput.value = task.text;
                popup.classList.add('show');
            });

            li.querySelector('.delete').addEventListener('click', () => {
                deleteTaskId = task.id;
                deletePopup.classList.add('show');
            });
        });
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    addTaskButton.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        if (text) {
            tasks.push({ id: Date.now(), text, completed: false });
            newTaskInput.value = '';
            saveTasks();
            renderTasks(tasks);
        }
    });

    applyEditButton.addEventListener('click', () => {
        const text = editTaskInput.value.trim();
        if (!text) return;

        const task = tasks.find(t => t.id === editTaskId);
        task.text = text;
        saveTasks();
        renderTasks(tasks);
        popup.classList.remove('show');
    });

    cancelEditButton.addEventListener('click', () => {
        popup.classList.remove('show');
    });

    searchTaskInput.addEventListener('input', () => {
        const query = searchTaskInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(query));
        renderTasks(filteredTasks);
    });

    filterTasksSelect.addEventListener('change', () => {
        const filter = filterTasksSelect.value;
        let filteredTasks = tasks;

        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'uncompleted') {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        renderTasks(filteredTasks);
    });

    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', themeToggle.checked);
    });

    clearAllButton.addEventListener('click', () => {
        clearPopup.classList.add('show');
    });

    confirmClearButton.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        renderTasks(tasks);
        clearPopup.classList.remove('show');
    });

    cancelClearButton.addEventListener('click', () => {
        clearPopup.classList.remove('show');
    });

    confirmDeleteButton.addEventListener('click', () => {
        tasks = tasks.filter(task => task.id !== deleteTaskId);
        saveTasks();
        renderTasks(tasks);
        deletePopup.classList.remove('show');
    });

    cancelDeleteButton.addEventListener('click', () => {
        deletePopup.classList.remove('show');
    });

    renderTasks(tasks);
});
