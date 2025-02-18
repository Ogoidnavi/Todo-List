import { ModalBase } from './ModalBase';
import { CreateElement } from '../CreateElement';
import { TodoItem } from '../../../components/todo/TodoItem';

export class TodoModal {
	constructor(modalManager) {
		this.modalBase = new ModalBase(modalManager);
		this.modalManager = modalManager;
	}

	static createPrioritySelect(priorityValue = 'Low') {
		const select = CreateElement.create('select', {
			className: 'priority-select',
			value: priorityValue,
		});
		['Low', 'Medium', 'High'].forEach(priority => {
			const option = CreateElement.create('option', {
				textContent: priority,
				value: priority.toLowerCase(),
			});
			select.appendChild(option);
		});
		return select;
	}

	static createTextArea(notesString = '') {
		return CreateElement.create('textarea', {
			value: notesString,
			attributes: {
				placeholder: 'Notes',
			},
		});
	}

	createElements() {
		const titleInput = this.modalBase.createInput({
			value: this.todo?.title,
			attributes: {
				type: 'text',
				placeholder: 'Title',
			},
		});

		const descriptionInput = this.modalBase.createInput({
			value: this.todo?.description,
			attributes: {
				type: 'text',
				placeholder: 'Description',
			},
		});

		const dueDateInput = this.modalBase.createInput({
			value: this.todo
				? this.modalManager.dateFormatter.formatForInput(
						this.todo.dueDate
				  )
				: '',
			attributes: {
				type: 'date',
				placeholder: 'Due Date',
			},
		});

		const prioritySelect = TodoModal.createPrioritySelect(
			this.todo?.priority
		);

		const notesInput = TodoModal.createTextArea(this.todo?.notes);

		const { confirmBtn, cancelBtn } = this.modalBase.createModalButtons(
			this.todo
		);
		confirmBtn.addEventListener('click', () => {
			this.handleSubmit({
				titleInput,
				descriptionInput,
				dueDateInput,
				prioritySelect,
				notesInput,
			});
		});

		return [
			titleInput,
			descriptionInput,
			dueDateInput,
			prioritySelect,
			notesInput,
			confirmBtn,
			cancelBtn,
		];
	}

	handleSubmit(inputs) {
		const {
			titleInput,
			descriptionInput,
			dueDateInput,
			prioritySelect,
			notesInput,
		} = inputs;

		if (this.todo) {
			this.projectManager.updateTodo(this.todo.id, {
				title: titleInput.value,
				description: descriptionInput.value,
				dueDate: this.modalManager.dateFormatter.formatFromInput(
					dueDateInput.value
				),
				priority: prioritySelect.value,
				notes: notesInput.value,
			});
		} else {
			this.projectManager.addTodo(
				new TodoItem(
					titleInput.value,
					descriptionInput.value,
					dueDateInput.value,
					prioritySelect.value,
					notesInput.value,
					this.modalManager.dateFormatter,
					this.modalManager.priorityValidator
				)
			);
		}
		this.modalManager.removeModal();
	}

	show(projectManager, todo = null) {
		this.projectManager = projectManager;
		this.todo = todo;

		const { overlay, modal } = this.modalBase.createModalStructure();
		const elements = this.createElements();
		this.modalBase.appendElements(modal, elements);
		return overlay;
	}
}
