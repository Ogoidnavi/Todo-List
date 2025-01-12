import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import DateFormatter from './utils/DateFormatter';
import PriorityValidator from './utils/PriorityValidator';

const dateFormatter = new DateFormatter();
const priorityValidator = new PriorityValidator();
const todoList = new TodoList();

// Create sample todos
const todo1 = new TodoItem(
	'Task 1',
	'First task',
	'2024-03-20',
	'High',
	'Note 1',
	dateFormatter,
	priorityValidator
);

const todo2 = new TodoItem(
	'Task 2',
	'Second task',
	'2024-03-21',
	'Low',
	'Note 2',
	dateFormatter,
	priorityValidator
);

// Test adding todos
todoList.add(todo1);

// Listen for events
todoList.events.on('todoAdded', todo => {
	console.log('Todo added:', todo);
});

todoList.events.on('todoUpdated', todo => {
	console.log('Todo updated:', todo);
});

todoList.events.on('todoRemoved', todo => {
	console.log('Todo removed:', todo);
});

todoList.add(todo2);

// Test filtering
console.log('All todos:', todoList.getFiltered({}));
console.log('High priority:', todoList.getFiltered({ priority: 'High' }));
console.log('Not done:', todoList.getFiltered({ status: false }));

// Test updating
todoList.update(todo1.id, { done: true });

// Test removing
todoList.remove(todo2.id);
