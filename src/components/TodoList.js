import { BaseStorage } from '../utils/BaseStorage';
import { EventEmitter } from '../utils/EventEmitter';
import { TodoFilters } from '../utils/TodoFilters';

class TodoList {
	constructor() {
		this.storage = new BaseStorage();
		this.events = new EventEmitter();
		this.filters = new TodoFilters();

		this.events.on('todoAdded', todo => {
			console.log('Todo added:', todo.title);
		});

		this.events.on('todoRemoved', todo => {
			console.log('Todo removed:', todo.title);
		});

		this.events.on('todoUpdated', todo => {
			console.log('Todo updated:', todo.title);
		});
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

	getFiltered(options = {}) {
		const { priority, status, dueDate, search, sortBy } = options;

		this.filters.reset();

		if (priority) this.filters.byPriority(priority);
		if (status !== undefined) this.filters.byStatus(status);
		if (dueDate) this.filters.byDueDateRange(dueDate.start, dueDate.end);
		if (search) this.filters.bySearch(search);
		if (sortBy) this.filters.sortBy(sortBy.field, sortBy.ascending);

		return this.filters.apply(this.storage.getAll());
	}
}

export { TodoList };
