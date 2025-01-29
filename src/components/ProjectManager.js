import { TodoList } from './TodoList';
import { EventEmitter } from '../utils/EventEmitter';

class ProjectManager {
	constructor() {
		this.projects = new Map();
		this.activeProjectId = null;
		this.events = new EventEmitter();

		// Setup event listeners
		this.events.on('projectCreated', project => {
			console.log('Project created:', project.name);
		});

		this.events.on('projectUpdated', project => {
			console.log('Project updated:', project.name);
		});

		this.events.on('activeProjectChanged', project => {
			console.log('Active project changed:', project.name);
		});

		this.events.on('projectDeleted', project => {
			console.log('Project deleted:', project.name);
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
		}
	}

	removeTodo(todoId) {
		const list = this.getActiveList();
		if (list) {
			list.remove(todoId);
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
