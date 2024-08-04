document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const taskCategorySelect = document.getElementById('task-category');
    const addTaskButton = document.getElementById('add-task');
    const newCategoryInput = document.getElementById('new-category');
    const newCategoryColorInput = document.getElementById('new-category-color');
    const addCategoryButton = document.getElementById('add-category');
    const searchTaskInput = document.getElementById('search-task');
    const statusFilterSelect = document.getElementById('status-filter');
    const categoryFilterSelect = document.getElementById('category-filter');
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
    let categories = JSON.parse(localStorage.getItem('categories')) || [
        { name: 'Work', color: '#5c85d6' },
        { name: 'Home', color: '#ff7f50' }
    ];
    let editTaskId = null;
    let deleteTaskId = null;

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const saveCategories = () => {
        localStorage.setItem('categories', JSON.stringify(categories));
    };

    const renderTasks = (tasksToRender) => {
        taskList.innerHTML = '';
        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <span class="task-category" style="background-color: ${task.color}">${task.category}</span>
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
                filterAndRenderTasks();
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

    const filterAndRenderTasks = () => {
        const searchQuery = searchTaskInput.value.toLowerCase();
        const statusFilter = statusFilterSelect.value;
        const categoryFilter = categoryFilterSelect.value;

        let filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchQuery));

        if (statusFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => statusFilter === 'completed' ? task.completed : !task.completed);
        }

        if (categoryFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.category.toLowerCase() === categoryFilter);
        }

        renderTasks(filteredTasks);
    };

    const populateCategorySelects = () => {
        taskCategorySelect.innerHTML = '';
        categoryFilterSelect.innerHTML = '<option value="all">All</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            option.dataset.color = category.color;
            taskCategorySelect.appendChild(option);

            const filterOption = document.createElement('option');
            filterOption.value = category.name.toLowerCase();
            filterOption.textContent = category.name;
            categoryFilterSelect.appendChild(filterOption);
        });
    };

    addTaskButton.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        const category = taskCategorySelect.value;
        const color = taskCategorySelect.selectedOptions[0].dataset.color;
        if (text) {
            tasks.push({ id: Date.now(), text, category, color, completed: false });
            newTaskInput.value = '';
            saveTasks();
            filterAndRenderTasks();
        }
    });

    addCategoryButton.addEventListener('click', () => {
        const name = newCategoryInput.value.trim();
        const color = newCategoryColorInput.value;
        if (name && color) {
            categories.push({ name, color });
            newCategoryInput.value = '';
            newCategoryColorInput.value = '#000000';
            saveCategories();
            populateCategorySelects();
        }
    });

    applyEditButton.addEventListener('click', () => {
        const text = editTaskInput.value.trim();
        if (!text) return;

        const task = tasks.find(t => t.id === editTaskId);
        task.text = text;
        saveTasks();
        filterAndRenderTasks();
        popup.classList.remove('show');
    });

    cancelEditButton.addEventListener('click', () => {
        popup.classList.remove('show');
    });

    searchTaskInput.addEventListener('input', filterAndRenderTasks);
    statusFilterSelect.addEventListener('change', filterAndRenderTasks);
    categoryFilterSelect.addEventListener('change', filterAndRenderTasks);

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
        filterAndRenderTasks();
        deletePopup.classList.remove('show');
    });

    cancelDeleteButton.addEventListener('click', () => {
        deletePopup.classList.remove('show');
    });

    populateCategorySelects();
    filterAndRenderTasks();
});
