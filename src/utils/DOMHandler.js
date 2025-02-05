import { TodoItem } from '../components/TodoItem';
import DateFormatter from './DateFormatter';
import PriorityValidator from './PriorityValidator';

class DOMHandler {
	constructor(projectManager) {
		this.projectManager = projectManager;
		this.dateFormatter = new DateFormatter();
		this.priorityValidator = new PriorityValidator();
		this.mainContainer = null;
		this.sidebarContainer = null;
	}

	initializeContainer() {
		const wrapper = document.createElement('div');
		wrapper.classList.add('wrapper');

		this.sidebarContainer = document.createElement('div');
		this.sidebarContainer.classList.add('sidebar');

		this.mainContainer = document.createElement('div');
		this.mainContainer.classList.add('main-container');

		document.body.appendChild(wrapper);
		[this.sidebarContainer, this.mainContainer].forEach(container =>
			wrapper.appendChild(container)
		);
	}

	createSidebar() {}

	createModalOverlay() {
		const modalOverlay = document.createElement('div');
		modalOverlay.classList.add('modal-overlay');

		const modal = document.createElement('div');
		modal.classList.add('modal');

		// Close modal when clicking outside
		modalOverlay.addEventListener('click', e => {
			if (e.target === modalOverlay) {
				this.mainContainer.removeChild(modalOverlay);
			}
		});

		modal.addEventListener('click', e => {
			e.stopPropagation();
		});

		modalOverlay.appendChild(modal);
		return modalOverlay;
	}

	createInputField(type, placeholder, value = '') {
		const input = document.createElement('input');
		input.type = type;
		input.placeholder = placeholder;
		input.value = value;
		return input;
	}

	createPrioritySelect(defaultValue = 'Low') {
		const select = document.createElement('select');
		['Low', 'Medium', 'High'].forEach(priority => {
			const option = document.createElement('option');
			option.value = priority;
			option.textContent = priority;
			select.appendChild(option);
		});
		select.value = defaultValue;
		return select;
	}

	createModalButtons(todo) {
		const confirmBtn = document.createElement('button');
		confirmBtn.textContent = todo ? 'Update' : 'Create';

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = 'Cancel';
		cancelBtn.addEventListener('click', () => {
			this.mainContainer.removeChild(
				document.querySelector('.modal-overlay')
			);
		});

		return { confirmBtn, cancelBtn };
	}

	handleTodoSubmit(todo, activeProject, inputs) {
		const {
			titleInput,
			descriptionInput,
			dueDateInput,
			prioritySelect,
			notesInput,
			modalOverlay,
		} = inputs;

		if (todo) {
			this.projectManager.updateTodo(todo.id, {
				title: titleInput.value,
				description: descriptionInput.value,
				dueDate: this.dateFormatter.formatFromInput(dueDateInput.value),
				priority: prioritySelect.value,
				notes: notesInput.value,
			});
		} else {
			activeProject.todoList.add(
				new TodoItem(
					titleInput.value,
					descriptionInput.value,
					dueDateInput.value,
					prioritySelect.value,
					notesInput.value,
					this.dateFormatter,
					this.priorityValidator
				)
			);
		}
		this.mainContainer.removeChild(modalOverlay);
		this.renderActiveProject();
	}

	showTodoModal(activeProject, todo = null) {
		const modalOverlay = this.createModalOverlay();
		const modal = modalOverlay.querySelector('.modal');

		const titleInput = this.createInputField('text', 'Title', todo?.title);
		const descriptionInput = this.createInputField(
			'text',
			'Description',
			todo?.description
		);
		const dueDateInput = this.createInputField(
			'date',
			'Due Date',
			todo ? this.dateFormatter.formatForInput(todo.dueDate) : ''
		);
		const prioritySelect = this.createPrioritySelect(todo?.priority);
		const notesInput = this.createInputField('text', 'Notes', todo?.notes);

		const { confirmBtn, cancelBtn } = this.createModalButtons(todo);

		confirmBtn.addEventListener('click', () =>
			this.handleTodoSubmit(todo, activeProject, {
				titleInput,
				descriptionInput,
				dueDateInput,
				prioritySelect,
				notesInput,
				modalOverlay,
			})
		);

		[
			titleInput,
			descriptionInput,
			dueDateInput,
			prioritySelect,
			notesInput,
			confirmBtn,
			cancelBtn,
		].forEach(element => modal.appendChild(element));

		this.mainContainer.appendChild(modalOverlay);
	}

	createTodoItem(todo) {
		const todoItem = document.createElement('div');
		const checkbox = document.createElement('input');
		const title = document.createElement('span');
		const dueDate = document.createElement('span');
		const priority = document.createElement('div');
		const deleteBtn = document.createElement('button');

		todoItem.classList.add('todo-item');

		checkbox.type = 'checkbox';
		checkbox.checked = todo.completed;

		title.textContent = todo.title;
		if (todo.completed) title.classList.add('completed');

		dueDate.textContent = todo.dueDate || 'No deadline';
		dueDate.classList.add('due-date');

		priority.id = 'priority';
		priority.classList.add(todo.priority.toLowerCase());

		todoItem.addEventListener('click', e => {
			e.target === checkbox
				? null
				: this.showTodoModal(
						this.projectManager.getActiveProject(),
						todo
				  );
		});

		checkbox.addEventListener('change', () => {
			const updates = { completed: checkbox.checked };
			const titleElement = todoItem.querySelector('span');
			this.projectManager.updateTodo(todo.id, updates);
			checkbox.checked
				? titleElement.classList.add('completed')
				: titleElement.classList.remove('completed');
		});

		deleteBtn.textContent = 'Delete';
		deleteBtn.classList.add('delete-btn');
		deleteBtn.addEventListener('click', e => {
			e.stopPropagation();
		});

		[checkbox, title, dueDate].forEach(element =>
			priority.appendChild(element)
		);
		todoItem.appendChild(priority);

		return todoItem;
	}

	renderTodoList(activeProject) {
		const todoListContainer = document.createElement('div');
		todoListContainer.classList.add('todo-list-container');

		const todoList = document.createElement('div');
		todoList.classList.add('todo-list');

		const addTodoBtn = document.createElement('button');
		addTodoBtn.classList.add('add-todo-btn');
		addTodoBtn.textContent = '+ Add Todo';

		addTodoBtn.addEventListener('click', () => {
			this.showTodoModal(activeProject);
		});

		if (
			activeProject.todoList.storage.getAll() &&
			activeProject.todoList.storage.getAll().length > 0
		) {
			activeProject.todoList.storage.getAll().forEach(todo => {
				const todoItem = this.createTodoItem(todo);
				todoList.appendChild(todoItem);
			});
		}
		[addTodoBtn, todoList].forEach(element =>
			todoListContainer.appendChild(element)
		);
		return todoListContainer;
	}

	renderActiveProject() {
		const activeProject = this.projectManager.getActiveProject();

		this.mainContainer.innerHTML = '';

		if (!activeProject) return;

		const projectView = document.createElement('div');
		projectView.classList.add('project-view');

		const backButton = document.createElement('button');
		backButton.classList.add('back-button');
		backButton.textContent = '← Back';
		backButton.addEventListener('click', () => {
			this.renderProjects();
		});

		const projectHeader = document.createElement('h2');
		projectHeader.textContent = activeProject.name;

		const todoListView = this.renderTodoList(activeProject);

		[backButton, projectHeader, todoListView].forEach(element =>
			projectView.appendChild(element)
		);
		this.mainContainer.appendChild(projectView);
	}

	renderProjects() {
		const projects = this.projectManager.getAllProjects();
		const activeId = this.projectManager.activeProjectId;

		this.mainContainer.innerHTML = '';

		projects.forEach(project => {
			const projectElement = document.createElement('div');
			projectElement.classList.add('project');
			projectElement.setAttribute('data-project-id', project.id);

			if (project.id === activeId) {
				projectElement.classList.add('active');
			}

			const projectTitle = document.createElement('h3');
			projectTitle.textContent = project.name;

			projectElement.addEventListener('click', () => {
				this.projectManager.setActiveProject(project.id);
				this.renderActiveProject();
			});

			projectElement.appendChild(projectTitle);
			this.mainContainer.appendChild(projectElement);
		});
	}

	render() {
		// Subscribe to project events
		this.projectManager.events.on('projectCreated', () =>
			this.renderProjects()
		);
		this.projectManager.events.on('projectDeleted', () =>
			this.renderProjects()
		);
		this.projectManager.events.on('activeProjectChanged', () =>
			this.renderProjects()
		);
		this.projectManager.events.on('todoAdded', () =>
			this.renderActiveProject()
		);
		this.projectManager.events.on('todoRemoved', () =>
			this.renderActiveProject()
		);
		this.projectManager.events.on('todoUpdated', () =>
			this.renderActiveProject()
		);

		this.initializeContainer();
		this.renderProjects();
	}
}

export { DOMHandler };
