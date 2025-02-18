export class CreateElement {
	static create(elementTag, options = {}) {
		const {
			className,
			textContent,
			inputType,
			checked,
			value = '',
			attributes = {},
			listeners = {},
		} = options;
		const element = document.createElement(elementTag);

		if (className) element.classList.add(className);
		if (inputType) element.type = inputType;
		if (checked !== undefined) element.checked = checked;
		if (value) element.value = value;
		if (textContent) element.textContent = textContent;

		Object.entries(attributes).forEach(([key, value]) =>
			element.setAttribute(key, value)
		);
		Object.entries(listeners).forEach(([event, handler]) =>
			element.addEventListener(event, handler)
		);

		return element;
	}
}
