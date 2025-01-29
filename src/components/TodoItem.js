class TodoItem {
	constructor(
		title,
		description,
		dueDate,
		priority,
		notes = '',
		dateFormatter,
		priorityValidator
	) {
		if (!title || !description || !dueDate || !priority) {
			throw new Error('Required fields missing');
		}

		if (!priorityValidator.isValid(priority)) {
			throw new Error('Invalid priority level');
		}

		this.id = crypto.randomUUID();
		this.title = title;
		this.description = description;
		this.dueDate = dateFormatter.format(dueDate);
		this.priority = priority;
		this.notes = notes;
		this.createdAt = dateFormatter.format(new Date());
		this.done = false;
	}

	toggle() {
		this.done = !this.done;
		return this;
	}

	updatePriority(newPriority) {
		if (!this.priorityValidator.isValid(newPriority)) {
			throw new Error('Invalid priority level');
		}
		this.priority = newPriority;
		return this;
	}

	addNote(note) {
		if (!note?.trim()) {
			throw new Error('Note cannot be empty');
		}
		this.notes = this.notes ? `${this.notes}\n${note}` : note;
		return this;
	}
}

export { TodoItem };
