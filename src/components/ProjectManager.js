import { TodoList } from './todo/TodoList';
import { EventEmitter } from '../utils/EventEmitter';

class ProjectManager {
	constructor() {
		this.projects = new Map();
		this.activeProjectId = null;
		this.events = new EventEmitter();
		this.initializeProjectEvents();
	}

	initializeProjectEvents() {
		const projectEvents = [
			'projectCreated',
			'projectUpdated',
			'projectDeleted',
			'activeProjectChanged',
		];

		projectEvents.forEach(eventName => {
			this.events.on(eventName, project => {
				console.log(`${eventName}:`, project?.name);
			});
		});
	}

	listenToActiveTodoList() {
		const todoEvents = ['todoAdded', 'todoRemoved', 'todoUpdated'];

		todoEvents.forEach(eventName => {
			this.getActiveList()?.events.on(eventName, todo => {
				this.events.emit(eventName, todo);
			});
		});
	}

	createProject(name) {
		const project = {
			id: crypto.randomUUID(),
			name,
			todoList: new TodoList(),
		};

		this.projects.set(project.id, project);
		this.events.emit('projectCreated', project);

		// Set as active if it's the first project
		if (!this.activeProjectId) {
			this.setActiveProject(project.id);
		}

		return project;
	}

	updateProject(projectId, updates) {
		const project = this.projects.get(projectId);
		if (project) {
			Object.assign(project, updates);
			this.events.emit('projectUpdated', project);
			return project;
		}
		return null;
	}

	deleteProject(projectId) {
		const project = this.projects.get(projectId);
		if (project) {
			this.projects.delete(projectId);
			this.events.emit('projectDeleted', project);

			// If active project was deleted, set another one as active
			if (this.activeProjectId === projectId) {
				const nextProject = this.projects.values().next().value;
				this.activeProjectId = nextProject ? nextProject.id : null;
			}
		}
	}

	setActiveProject(projectId) {
		if (this.projects.has(projectId)) {
			this.activeProjectId = projectId;
			this.listenToActiveTodoList();
			this.events.emit('activeProjectChanged', this.getActiveProject());
		}
	}

	getActiveProject() {
		return this.projects.get(this.activeProjectId);
	}

	getActiveList() {
		const project = this.getActiveProject();
		return project ? project.todoList : null;
	}

	getAllProjects() {
		return Array.from(this.projects.values());
	}

	// Delegate todo operations to active project's TodoList
	addTodo(todo) {
		const list = this.getActiveList();
		if (list) {
			list.add(todo);
			this.events.emit('todoAdded', todo);
		}
	}

	removeTodo(todoId) {
		const list = this.getActiveList();
		if (list) {
			list.remove(todoId);
			this.events.emit('todoRemoved', todoId);
		}
	}

	updateTodo(todoId, updates) {
		const list = this.getActiveList();
		if (list) {
			list.update(todoId, updates);
		}
	}

	getFilteredTodos(options) {
		const list = this.getActiveList();
		return list ? list.getFiltered(options) : [];
	}
}

export { ProjectManager };
