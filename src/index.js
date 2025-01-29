import 'normalize.css';
import { ProjectManager } from './components/ProjectManager';
import { TodoItem } from './components/TodoItem';
import { DOMHandler } from './utils/DOMHandler';
import DateFormatter from './utils/DateFormatter';
import PriorityValidator from './utils/PriorityValidator';

const dateFormatter = new DateFormatter();
const priorityValidator = new PriorityValidator();
const projectManager = new ProjectManager();
const domHandler = new DOMHandler(projectManager);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
	// Create test projects and todos
	const workProject = projectManager.createProject('Work Tasks');
	const personalProject = projectManager.createProject('Personal Tasks');
	const studyProject = projectManager.createProject('Study Tasks');

	// Debug logs
	console.log('Projects created:', projectManager.getAllProjects());
	console.log('DOM Handler initialized');

	// Create todos for work project
	const workTodo1 = new TodoItem(
		'Quarterly Report',
		'Complete Q1 report',
		'2025-03-30',
		'High',
		'Include charts',
		dateFormatter,
		priorityValidator
	);

	const workTodo2 = new TodoItem(
		'Team Meeting',
		'Weekly sync',
		'2025-03-25',
		'Medium',
		'Prepare agenda',
		dateFormatter,
		priorityValidator
	);

	// Create todos for personal project
	const personalTodo = new TodoItem(
		'Gym Session',
		'Weekly workout',
		'2025-03-26',
		'Medium',
		'',
		dateFormatter,
		priorityValidator
	);

	// Create todos for study project
	const studyTodo = new TodoItem(
		'JavaScript Course',
		'Complete module 3',
		'2025-03-28',
		'High',
		'Practice exercises',
		dateFormatter,
		priorityValidator
	);

	// Add todos to respective projects
	workProject.todoList.add(workTodo1);
	workProject.todoList.add(workTodo2);
	personalProject.todoList.add(personalTodo);
	studyProject.todoList.add(studyTodo);
});
