class PriorityValidator {
	constructor(validPriorities = ['High', 'Medium', 'Low']) {
		this.validPriorities = validPriorities;
	}

	isValid(priority) {
		return this.validPriorities.includes(
			priority[0].toUpperCase() + priority.slice(1).toLowerCase()
		);
	}
}

export { PriorityValidator };
