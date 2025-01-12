// Javascript

// Load to local storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('taskData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        parsedData.forEach(taskListData => {
            createTaskListFromData(taskListData);
        });
    }
    updateNoListsVisibility();
}

// Save tasks and tasklists to local storage
function saveToLocalStorage() {
    const allTaskLists = Array.from(taskLists.querySelectorAll('.tasklist')).map(taskList => {
        const nameInput = taskList.querySelector('.tasklistheader .text');
        const tasks = Array.from(taskList.querySelectorAll('.task')).map(task => {
            return {
                status: task.querySelector('.status').getAttribute('data-state'),
                description: task.querySelector('.text').textContent.trim()
            };
        });
        return {
            name: nameInput.value.trim(),
            tasks
        };
    });
    localStorage.setItem('taskData', JSON.stringify(allTaskLists));
}





// Updating the visibility of No lists -text
function updateNoListsVisibility() {
    noLists.style.display = taskLists.querySelectorAll('.tasklistheader').length === 0 ? 'block' : 'none';
}

// Creating a unique name for a task list
function makeUniqueName(baseName, currentElement) {
	let currentName = baseName;
	let existingTexts = Array.from(taskLists.querySelectorAll('.tasklistheader input'))
		.filter(el => el !== currentElement)
		.map(el => el.value.trim());
	let counter = 1;

	// If the name includes a number, a following number will be added
	const baseMatch = baseName.match(/^(.*?)(\d+)$/);
	if (baseMatch) {
		currentName = baseMatch[1];
		counter = parseInt(baseMatch[2], 10);
	}

	// Checking whether the name already exists
	while (existingTexts.includes(currentName + (counter > 1 ? counter : ''))) {
		counter++;
	}
	return currentName + (counter > 1 ? counter : '');
}





const createList = document.getElementById('createList');
const taskLists = document.getElementById('taskLists');
const noLists = document.getElementById('noLists');

// *** CREATE TASK LIST/CREATE TASK LIST FROM DATA ***
function createTaskListFromData(data) {
	
    const taskList = document.createElement('div');
    taskList.className = 'tasklist';

		const taskListHeader = document.createElement('section');
		taskListHeader.className = 'tasklistheader';
		taskListHeader.setAttribute('aria-label', 'Task list');

			const name = document.createElement('input');
			name.className = 'text';
			name.setAttribute('placeholder', 'Type task list name (letters and numbers only)')
			name.setAttribute('type', 'text');
			name.setAttribute('maxlength', '60');
			name.value = data.name;

				// Allowing the name to only have letters (A-Z, a-z) and numbers (0-9)
				name.addEventListener('input', (event) => {
					const validInput = event.target.value.replace(/[^a-zA-Z0-9äöåÄÖÅ]/g, '');
					event.target.value = validInput;
				});
				// Adding a name if none is added
				name.addEventListener('blur', () => {
					let currentText = name.value.trim();
					if (currentText === '') {
						currentText = 'Tasklist';
					}
					// Making the name unique
					name.value = makeUniqueName(currentText, name);
				});
				// Leaving the textfield with enter
				name.addEventListener('keydown', (event) => {
					if (event.key === 'Enter') {
						name.blur();
					}
				});
				name.addEventListener('blur', saveToLocalStorage); // Saving

			const openClose = document.createElement('button');
			openClose.className = 'openclose';
			openClose.textContent = 'Hide tasks';
			openClose.setAttribute('aria-live', 'polite');
				
				//Hiding and showing task list content
				openClose.addEventListener('click', () => {
					const isCurrentlyClosed = openClose.getAttribute('data-state') === 'close';
					taskListContent.style.display = isCurrentlyClosed ? 'flex' : 'none';

					if (isCurrentlyClosed) {
						openClose.textContent = 'Hide tasks';
						openClose.setAttribute('data-state', 'open');
					} else {
						openClose.textContent = 'Show tasks';
						openClose.setAttribute('data-state', 'close');
					}
				});

			const deleteTaskList = document.createElement('button');
			deleteTaskList.className = 'delete';
			deleteTaskList.textContent = 'Delete';

				// Deleting a task list
				deleteTaskList.addEventListener('click', () => {
					deleteTaskList.textContent = 'Task list deleted';
					deleteTaskList.setAttribute('aria-live', 'polite');
					setTimeout(() => {
						taskLists.removeChild(taskList);
						updateNoListsVisibility();
						saveToLocalStorage(); // Saving
					}, 500);
				});

		const taskListContent = document.createElement('div');
		taskListContent.className = 'tasklistcontent';

			const addTaskButton = document.createElement('button');
			addTaskButton.className = 'addtask';
			addTaskButton.textContent = 'Add new task';
	
	
	
				// *** ADDING A TASK ***
				addTaskButton.addEventListener('click', () => {
					const task = document.createElement('section');
					task.className = 'task';
					task.setAttribute('aria-label', 'Task');

						const status = document.createElement('button');
						status.className = 'status';
						status.setAttribute('aria-live', 'polite');
						status.setAttribute('aria-description', 'Status');
						const currentFilterState = filter.getAttribute('data-state');
						const defaultState = currentFilterState === 'All tasks' ? 'To do' : currentFilterState;
						status.textContent = defaultState;
						status.setAttribute('data-state', defaultState);

							const statusStates = ['To do', 'Doing', 'Done'];
							// Changing status
							status.addEventListener('click', () => {
								const currentState = status.getAttribute('data-state');
								const nextStateIndex = (statusStates.indexOf(currentState) + 1) % statusStates.length;
								const nextState = statusStates[nextStateIndex];

								status.setAttribute('data-state', nextState);
								status.textContent = nextState;
								applyFilter(filter.getAttribute('data-state'));
								saveToLocalStorage(); // Saving
							});

						const taskDescription = document.createElement('div');
						taskDescription.className = 'text';
						taskDescription.contentEditable = true;
						taskDescription.addEventListener('blur', saveToLocalStorage); // Saving

						const deleteTask = document.createElement('button');
						deleteTask.className = 'delete';
						deleteTask.textContent = 'Delete';
					
							// Deleting a task
							deleteTask.addEventListener('click', () => {
								deleteTask.textContent = 'Task deleted';
								deleteTask.setAttribute('aria-live', 'polite');
								setTimeout(() => {
									task.parentElement.removeChild(task);
									saveToLocalStorage(); // Saving
								}, 500);							
							});

					task.appendChild(status);
					task.appendChild(taskDescription);
					task.appendChild(deleteTask);

					taskListContent.insertBefore(task, addTaskButton);

					taskDescription.focus();
					applyFilter(filter.getAttribute('data-state'));
					saveToLocalStorage(); // Saving
    			});

		taskListContent.appendChild(addTaskButton);

		taskListHeader.appendChild(name);
		taskListHeader.appendChild(openClose);
		taskListHeader.appendChild(deleteTaskList);

	taskList.appendChild(taskListHeader);
	taskList.appendChild(taskListContent);

taskLists.appendChild(taskList);
	
name.focus();
updateNoListsVisibility();
	

data.tasks.forEach(taskData => {
	addTaskButton.click();
	const lastTask = taskListContent.querySelector('.task:last-of-type');
	lastTask.querySelector('.status').setAttribute('data-state', taskData.status);
	lastTask.querySelector('.status').textContent = taskData.status;
	lastTask.querySelector('.text').textContent = taskData.description;
});
	
}








createList.addEventListener('click', () => {
    createTaskListFromData({ name: '', tasks: [] });
    saveToLocalStorage();
});







const filter = document.querySelector('.filter');
const filterStates = ['All tasks', 'To do', 'Doing', 'Done'];

// Changing filter
filter.addEventListener('click', () => {
    const currentState = filter.getAttribute('data-state');
    const nextStateIndex = (filterStates.indexOf(currentState) + 1) % filterStates.length;
    const nextState = filterStates[nextStateIndex];

	// Filter button update
    filter.setAttribute('data-state', nextState);
    filter.textContent = nextState;

    applyFilter(nextState);
});

// Applying filter
function applyFilter(filterState) {
    const tasks = taskLists.querySelectorAll('.task');

    tasks.forEach(task => {
        const taskStatus = task.querySelector('.status').getAttribute('data-state');

        if (filterState === 'All tasks' || taskStatus === filterState) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

loadFromLocalStorage();
