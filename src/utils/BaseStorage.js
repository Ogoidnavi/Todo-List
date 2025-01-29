class BaseStorage {
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

export { BaseStorage };
