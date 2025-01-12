class TodoListEvents {
	constructor() {
		this.listeners = new Map();
	}

	on(event, callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event).add(callback);
	}

	emit(event, data) {
		if (this.listeners.has(event)) {
			this.listeners.get(event).forEach(callback => callback(data));
		}
	}
}

class TodoStorage {
	constructor() {
		this.todos = new Map();
	}

	add(todo) {
		this.todos.set(todo.id, todo);
	}

	remove(todoId) {
		this.todos.delete(todoId);
	}

	get(todoId) {
		return this.todos.get(todoId);
	}

	getAll() {
		return Array.from(this.todos.values());
	}
}

class TodoFilters {
	byPriority(todos, priority) {
		return todos.filter(todo => todo.priority === priority);
	}

	byStatus(todos, isDone) {
		return todos.filter(todo => todo.done === isDone);
	}

	byDueDate(todos, date) {
		return todos.filter(todo => todo.dueDate === date);
	}
}

class TodoList {
	constructor() {
		this.storage = new TodoStorage();
		this.events = new TodoListEvents();
		this.filters = new TodoFilters();
	}

	add(todo) {
		this.storage.add(todo);
		this.events.emit('todoAdded', todo);
	}

	remove(todoId) {
		const todo = this.storage.get(todoId);
		if (todo) {
			this.storage.remove(todoId);
			this.events.emit('todoRemoved', todo);
		}
	}

	update(todoId, updates) {
		const todo = this.storage.get(todoId);
		if (todo) {
			Object.assign(todo, updates);
			this.events.emit('todoUpdated', todo);
		}
	}

	getFiltered({ priority, status, dueDate }) {
		let todos = this.storage.getAll();

		if (priority) {
			todos = this.filters.byPriority(todos, priority);
		}
		if (status !== undefined) {
			todos = this.filters.byStatus(todos, status);
		}
		if (dueDate) {
			todos = this.filters.byDueDate(todos, dueDate);
		}

		return todos;
	}
}

export { TodoList };
