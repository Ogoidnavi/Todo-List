import 'normalize.css';
import './styles.css';
import { ProjectManager } from './components/ProjectManager';
import { DOMHandler } from './utils/DOMHandler';

const projectManager = new ProjectManager();
const domHandler = new DOMHandler(projectManager);

document.addEventListener('DOMContentLoaded', () => {
	domHandler.render();
	// Create test projects and todos
	projectManager.createProject('Work Tasks');
	projectManager.createProject('Personal Tasks');
	projectManager.createProject('Study Tasks');
});
