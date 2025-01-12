// TodoItemView.js
class TodoItemView {
	constructor(todo, onToggle) {
		this.todo = todo;
		this.onToggle = onToggle;
		this.element = this.createElement();
	}

	createElement() {
		const li = document.createElement('li');
		li.innerText = this.todo.text;
		li.style.textDecoration = this.todo.done ? 'line-through' : 'none';
		li.addEventListener('click', this.onToggle);
		return li;
	}

	update() {
		this.element.style.textDecoration = this.todo.done
			? 'line-through'
			: 'none';
	}

	getElement() {
		return this.element;
	}
}

export default TodoItemView;
