import { ModalBase } from './ModalBase.js';

export class ProjectModal {
	constructor(modalManager) {
		this.modalBase = new ModalBase(modalManager);
		this.modalManager = modalManager;
	}

	createElements() {
		const titleInput = this.modalBase.createInput({
			value: this.project?.name,
			attributes: {
				type: 'text',
				placeholder: 'Project Name',
			},
		});

		const { confirmBtn, cancelBtn } = this.modalBase.createModalButtons(
			this.project
		);
		confirmBtn.addEventListener('click', () => {
			this.handleSubmit(titleInput);
		});

		return [titleInput, confirmBtn, cancelBtn];
	}

	handleSubmit(titleInput) {
		if (this.project) {
			this.projectManager.updateProject(this.project.id, {
				name: titleInput.value,
			});
		} else {
			this.projectManager.createProject(titleInput.value);
		}
		this.modalManager.removeModal();
	}

	show(projectManager, project = null) {
		this.projectManager = projectManager;
		this.project = project;

		const { overlay, modal } = this.modalBase.createModalStructure();
		const elements = this.createElements();
		this.modalBase.appendElements(modal, elements);
		return overlay;
	}
}
