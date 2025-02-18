import { ModalManager } from './components/ModalManager';
import { CreateElement } from './components/CreateElement';

class DOMHandler {
	constructor(projectManager) {
		this.projectManager = projectManager;
		this.modalManager = new ModalManager();
		this.mainContainer = null;
		this.sidebarContainer = null;
		this.activeModal = null;
		this.renderActiveProject = this.renderActiveProject.bind(this);
	}

	initializeContainer() {
		const wrapper = CreateElement.create('div', { className: 'wrapper' });

		this.sidebarContainer = CreateElement.create('div', {
			className: 'sidebar',
		});
		this.createSidebar();

		this.mainContainer = CreateElement.create('div', {
			className: 'main-container',
		});

		document.body.appendChild(wrapper);
		[this.sidebarContainer, this.mainContainer].forEach(container =>
			wrapper.appendChild(container)
		);
	}

	createSidebar() {
		const addProjectBtn = CreateElement.create('button', {
			classList: 'add-project-btn',
			textContent: '+ Add Project',
			listeners: {
				click: () => {
					this.mainContainer.appendChild(
						this.modalManager.showProjectModal(this.projectManager)
					);
				},
			},
		});
		this.sidebarContainer.appendChild(addProjectBtn);
	}

	createTodoItem(todo) {
		const todoItem = CreateElement.create('div', {
			className: 'todo-item',
			listeners: {
				click: e => {
					e.target === checkbox
						? null
						: this.mainContainer.appendChild(
								this.modalManager.showTodoModal(
									this.projectManager,
									todo
								)
						  );
				},
			},
		});

		const checkbox = CreateElement.create('input', {
			inputType: 'checkbox',
			checked: todo.completed,
			listeners: {
				change: () => {
					const updates = { completed: checkbox.checked };
					const titleElement = todoItem.querySelector('span');
					this.projectManager.updateTodo(todo.id, updates);
					checkbox.checked
						? titleElement.classList.add('completed')
						: titleElement.classList.remove('completed');
				},
			},
		});

		const title = CreateElement.create('span', {
			className: todo.completed ? 'completed' : null,
			textContent: todo.title,
		});
		const dueDate = CreateElement.create('span', {
			className: 'due-date',
			textContent: todo.dueDate || 'No deadline',
		});
		const priority = CreateElement.create('div', {
			className: todo.priority.toLowerCase(),
			attributes: {
				id: 'priority',
			},
		});

		const deleteBtn = CreateElement.create('button', {
			textContent: 'Delete',
			className: 'delete-btn',
			listeners: {
				click: e => {
					e.stopPropagation();
					this.projectManager.removeTodo(todo.id);
				},
			},
		});

		[checkbox, title, dueDate, deleteBtn].forEach(element =>
			priority.appendChild(element)
		);
		todoItem.appendChild(priority);

		return todoItem;
	}

	renderTodoList(activeProject) {
		const todoListContainer = CreateElement.create('div', {
			className: 'todo-list-container',
		});

		const todoList = CreateElement.create('div', {
			className: 'todo-list',
		});

		const addTodoBtn = CreateElement.create('button', {
			className: 'add-todo-btn',
			textContent: '+ Add Todo',
			listeners: {
				click: () =>
					this.mainContainer.appendChild(
						this.modalManager.showTodoModal(this.projectManager)
					),
			},
		});

		if (
			this.projectManager.getFilteredTodos() &&
			this.projectManager.getFilteredTodos().length > 0
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
		if (!this.mainContainer) return;

		const activeProject = this.projectManager.getActiveProject();
		this.mainContainer.innerHTML = '';

		if (!activeProject) return;

		const projectView = CreateElement.create('div', {
			className: 'project-view',
		});

		const backButton = CreateElement.create('button', {
			className: 'back-button',
			textContent: '← Back',
			listeners: {
				click: () => {
					this.renderProjects();
				},
			},
		});

		const deleteButton = CreateElement.create('button', {
			className: 'delete-button',
			textContent: 'Delete Project',
			listeners: {
				click: () => {
					this.projectManager.deleteProject(activeProject.id);
				},
			},
		});

		const projectHeader = CreateElement.create('h2', {
			textContent: activeProject.name,
		});

		const todoListView = this.renderTodoList(activeProject);

		[backButton, deleteButton, projectHeader, todoListView].forEach(
			element => projectView.appendChild(element)
		);
		this.mainContainer.appendChild(projectView);
	}

	renderProjects() {
		const projects = this.projectManager.getAllProjects();
		const activeId = this.projectManager.activeProjectId;

		this.mainContainer.innerHTML = '';

		projects.forEach(project => {
			const projectElement = CreateElement.create('div', {
				className: 'project',
				listeners: {
					click: () => {
						this.projectManager.setActiveProject(project.id);
						this.renderActiveProject();
					},
				},
				attributes: {
					'data-project-id': project.id,
				},
			});

			if (project.id === activeId) projectElement.classList.add('active');

			const projectTitle = CreateElement.create('h3', {
				textContent: project.name,
			});

			projectElement.appendChild(projectTitle);
			this.mainContainer.appendChild(projectElement);
		});
	}

	initializeEvents() {
		const events = {
			projectCreated: () => this.renderProjects(),
			projectDeleted: () => this.renderProjects(),
			projectUpdated: () => this.renderProjects(),
			activeProjectChanged: () => this.renderActiveProject(),
			todoAdded: () => this.renderActiveProject(),
			todoRemoved: () => this.renderActiveProject(),
			todoUpdated: () => this.renderActiveProject(),
		};

		Object.entries(events).forEach(([event, handler]) => {
			this.projectManager.events.on(event, handler.bind(this));
		});
	}

	render() {
		this.initializeContainer();
		this.initializeEvents();
		this.renderProjects();
	}
}

export { DOMHandler };
