class PriorityValidator {
	constructor(validPriorities = ['High', 'Medium', 'Low']) {
		this.validPriorities = validPriorities;
	}

	isValid(priority) {
		return this.validPriorities.includes(priority);
	}
}

export default PriorityValidator;
