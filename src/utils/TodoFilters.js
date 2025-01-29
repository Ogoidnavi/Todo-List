class TodoFilters {
	constructor() {
		this.activeFilters = new Set();
	}

	addFilter(filterFn) {
		this.activeFilters.add(filterFn);
		return this;
	}

	apply(todos) {
		return Array.from(this.activeFilters).reduce(
			(filteredTodos, filter) => {
				return filter(filteredTodos);
			},
			todos
		);
	}

	byPriority(priority) {
		return this.addFilter(todos =>
			todos.filter(todo => todo.priority === priority)
		);
	}

	byStatus(isDone) {
		return this.addFilter(todos =>
			todos.filter(todo => todo.done === isDone)
		);
	}

	byDueDateRange(startDate, endDate) {
		return this.addFilter(todos =>
			todos.filter(todo => {
				const date = new Date(todo.dueDate);
				return date >= startDate && date <= endDate;
			})
		);
	}

	bySearch(query) {
		return this.addFilter(todos =>
			todos.filter(
				todo =>
					todo.title.toLowerCase().includes(query.toLowerCase()) ||
					todo.description.toLowerCase().includes(query.toLowerCase())
			)
		);
	}

	sortBy(field, ascending = true) {
		return this.addFilter(todos =>
			[...todos].sort((a, b) => {
				return ascending
					? a[field] > b[field]
						? 1
						: -1
					: a[field] < b[field]
					? 1
					: -1;
			})
		);
	}

	reset() {
		this.activeFilters.clear();
		return this;
	}
}

export { TodoFilters };
