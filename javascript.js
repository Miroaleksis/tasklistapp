// Javascript

const createList = document.getElementById('createList');
const taskLists = document.getElementById('taskLists');
const noLists = document.getElementById('noLists');



// Updating the visibility of No lists -text
function updateNoListsVisibility() {
	noLists.style.display = taskLists.querySelectorAll('.tasklistheader').length === 0 ? 'block' : 'none';
}



// Creating an unique name for task
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



// *** CREATING A TASKLISTS ***
createList.addEventListener('click', () => {

	const taskList = document.createElement('div');
	taskList.className = 'tasklist';

		const taskListHeader = document.createElement('section');
		taskListHeader.className = 'tasklistheader';
		taskListHeader.setAttribute('aria-label', 'Task list');

			const name = document.createElement('input');
			name.className = 'name';
			name.setAttribute('placeholder', 'Type task list name (letters and numbers only)')
			name.setAttribute('type', 'text');
			name.setAttribute('maxlength', '60')
	
				// Allow only letters (A-Z, a-z) and numbers (0-9)
				name.addEventListener('input', (event) => {
					const validInput = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
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

				// Delete a task list
				deleteTaskList.addEventListener('click', () => {
					deleteTaskList.textContent = 'Tasklist deleted';
					deleteTaskList.setAttribute('aria-live', 'polite');
					setTimeout(() => {
						taskLists.removeChild(taskList);
						updateNoListsVisibility();
					}, 500);
				});
		
		const taskListContent = document.createElement('div');
		taskListContent.className = 'tasklistcontent';
		
	
	
			// *** ADDING A TASK ***
			const addTaskButton = document.createElement('button');
			addTaskButton.className = 'addtask';
			addTaskButton.textContent = 'Add new task';
	
				addTaskButton.addEventListener('click', () => {

					const task = document.createElement('section');
					task.className = 'task';
					task.setAttribute('aria-label', 'Task');

						const status = document.createElement('button');
						status.className = 'status';
						status.setAttribute('aria-live', 'polite');
						const currentFilterState = filter.getAttribute('data-state');
                        const defaultState = currentFilterState === 'All tasks' ? 'To do' : currentFilterState;
                        status.textContent = defaultState;
                        status.setAttribute('data-state', defaultState);
					
					
							// Change status
							const statusStates = ["To do", "Doing", "Done"];
					
								status.addEventListener('click', () => {
									const currentState = status.getAttribute('data-state');
									const nextStateIndex = (statusStates.indexOf(currentState) + 1) % statusStates.length;
									const nextState = statusStates[nextStateIndex];

									// Päivitä napin tila ja teksti
									status.setAttribute('data-state', nextState);
									status.textContent = nextState;
									
									applyFilter(filter.getAttribute('data-state')); // Filtering
								});

						const taskName = document.createElement('div');
						taskName.className = 'name';
						taskName.contentEditable = true; // Teksti on muokattavissa

						const deleteTask = document.createElement('button');
						deleteTask.className = 'delete';
						deleteTask.textContent = 'Delete';
						deleteTask.setAttribute('aria-live', 'polite');

							// Delete task
							deleteTask.addEventListener('click', () => {
								deleteTask.textContent = 'Task deleted';
								deleteTask.setAttribute('aria-labelledby', 'task name');
								setTimeout(() => {
									task.parentElement.removeChild(task);
								}, 500);
							});

						task.appendChild(status);
						task.appendChild(taskName);
						task.appendChild(deleteTask);

					taskListContent.appendChild(task);
					taskListContent.appendChild(addTaskButton);

					taskName.focus(); // Text focus
					
					applyFilter(filter.getAttribute('data-state')); // Filtering

				});
	
	
	
	
			taskListHeader.appendChild(name);
			taskListHeader.appendChild(openClose);
			taskListHeader.appendChild(deleteTaskList);
	
		taskListContent.appendChild(addTaskButton);

	taskList.appendChild(taskListHeader);
	taskList.appendChild(taskListContent);

	taskLists.appendChild(taskList);

	
	
	name.focus(); // Text focus

	updateNoListsVisibility(); // No lists text visibility

});





const filter = document.querySelector('.filter');
const filterStates = ["All tasks", "To do", "Doing", "Done"];

// Changing filter
filter.addEventListener('click', () => {
	
	const currentState = filter.getAttribute('data-state');
	const nextStateIndex = (filterStates.indexOf(currentState) + 1) % filterStates.length;
	const nextState = filterStates[nextStateIndex];

	// Change filter button
	filter.setAttribute('data-state', nextState);
	filter.textContent = nextState;
	
	const filteredTasks = taskLists.querySelectorAll('.task');
	
	// Filtering function
	filteredTasks.forEach(filteredTask => {
		const taskStatus = filteredTask.querySelector('.status').getAttribute('data-state');

		if (nextState === "All tasks" || taskStatus === nextState) {
			filteredTask.style.display = 'flex';
		} else {
			filteredTask.style.display = 'none';
		}
	});
});

// Applying filter after other actions
function applyFilter(filterState) {
	
	const filteredTasks = taskLists.querySelectorAll('.task');

	filteredTasks.forEach(filteredTask => {
		const taskStatus = filteredTask.querySelector('.status').getAttribute('data-state');

		if (filterState === "All tasks" || taskStatus === filterState) {
			filteredTask.style.display = 'flex';
		} else {
			filteredTask.style.display = 'none';
		}
	});
}