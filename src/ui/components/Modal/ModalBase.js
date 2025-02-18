import { CreateElement } from '../CreateElement';

export class ModalBase {
	constructor(modalManager) {
		this.modalManager = modalManager;
	}

	createInput(options) {
		return CreateElement.create('input', options);
	}

	createModalStructure() {
		const modalOverlay = this.modalManager.createModalOverlay();
		return {
			overlay: modalOverlay,
			modal: modalOverlay.querySelector('.modal'),
		};
	}

	createModalButtons(todo) {
		const confirmBtn = CreateElement.create('button', {
			textContent: todo ? 'Update' : 'Create',
		});
		const cancelBtn = CreateElement.create('button', {
			textContent: 'Cancel',
			listeners: {
				click: () => this.modalManager.removeModal(),
			},
		});

		return { confirmBtn, cancelBtn };
	}

	appendElements(modal, elements) {
		elements.forEach(element => modal.appendChild(element));
	}
}
