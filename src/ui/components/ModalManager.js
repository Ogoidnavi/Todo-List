import { CreateElement } from './CreateElement';
import { TodoModal } from './Modal/TodoModal';
import { ProjectModal } from './Modal/ProjectModal';
import { DateFormatter } from '../../utils/DateFormatter';
import { PriorityValidator } from '../../utils/PriorityValidator';

export class ModalManager {
	constructor() {
		this.dateFormatter = new DateFormatter();
		this.priorityValidator = new PriorityValidator();
		this.activeModal = null;
		this.projectModal = new ProjectModal(this);
		this.todoModal = new TodoModal(this);
	}

	createModalOverlay() {
		const modalOverlay = CreateElement.create('div', {
			className: 'modal-overlay',
			listeners: {
				click: () => this.removeModal(),
			},
		});
		this.activeModal = modalOverlay;

		const modal = CreateElement.create('div', {
			className: 'modal',
			listeners: {
				click: e => e.stopPropagation(),
			},
		});

		modalOverlay.appendChild(modal);
		return modalOverlay;
	}

	removeModal() {
		if (this.activeModal && this.activeModal.parentNode) {
			this.activeModal.parentNode.removeChild(this.activeModal);
			this.activeModal = null;
		}
	}

	showProjectModal(projectManager, project = null) {
		return this.projectModal.show(projectManager, project);
	}

	showTodoModal(projectManager, todo = null) {
		return this.todoModal.show(projectManager, todo);
	}
}
