class Model {
	constructor(){
		// data
		this.tasks = [
			//{id:1, text: 'Be good', complete: false},
			//{id:2, text: 'Be nice', complete: false},
			//{id:3, text: 'Be awesome', complete: false}
		]
	}

	addTask(taskText){
		let id
		if(this.tasks.length > 0){
			id = this.tasks[this.tasks.length - 1].id + 1
		} else {
			id = 1
		}
		const task = {
			id: id,
			text: taskText,
			complete: false
		}
		this.tasks.push(task)
		this.onTaskListChanged(this.tasks)
	}

	taskListChanged(callback){
		this.onTaskListChanged = callback
	}

	deleteTask(taskId){
		const taskList = this.tasks
		this.tasks = []
		taskList.forEach(task => {
			if(task.id != taskId){
				this.addTask(task.text)
			}
		})
		this.onTaskListChanged(this.tasks)
	}
}

class View {
	constructor(){
		this.app = this.getElement('#root')
		this.title = this.setElement('h1')
		this.title.textContent = 'Tasks'
		this.form = this.setElement('form')
		this.input = this.setElement('input')
		this.input.type = 'text'
		this.input.name = 'task'
		this.input.placeholder = 'Add new task'
		this.submitButton = this.setElement('button')
		this.submitButton.textContent = 'Add task'
		this.form.append(this.input, this.submitButton)
		this.taskList = this.setElement('ul')
		this.app.append(this.title, this.form, this.taskList)
	}

	displayTasks(tasks){
		while(this.taskList.firstChild){
			this.taskList.removeChild(this.taskList.firstChild)
		}
		if(tasks.length === 0){
			const p = this.setElement('p')
			p.textContent = 'Add a task if there is nothing to do'
			this.taskList.append(p)
		} else {tasks.forEach(task => {
			const li = this.setElement('li')
			li.id = task.id
			const checkbox = this.setElement('input')
			checkbox.type = 'checkbox'
			checkbox.checked = task.complete
			const span = this.setElement('span')
			if(task.complete === true){
				const strike = this.setElement('s')
				strike.textContent = task.text
				span.append(strike)
			} else {
				span.textContent = task.text
			}
			const deleteButton = this.setElement('button', 'delete')
			deleteButton.textContent = 'Delete'
			li.append(checkbox, span, deleteButton)
			this.taskList.append(li)
		})}
	}

	addTask(handler){
		this.form.addEventListener('submit', event => {
			event.preventDefault()
			if(this._taskText){
				handler(this._taskText)
				this.resetInput()
			}
		})
	}

	deleteTask(handler){
		this.taskList.addEventListener('click', event => {
			if(event.target.textContent == 'Delete'){
				handler(event.target.parentElement.id)
			}
		})
	}

	getElement(selector){
		const element = document.querySelector(selector)
		return element
	}

	get _taskText(){
		return this.input.value
	}

	setElement(tag, classname){
		const element = document.createElement(tag)
		if(classname !== undefined){
			element.classList.add(classname)
		}
		return element
	}

	resetInput(){
		this.input.value = ''
	}
}

class Controller {
	constructor(model, view){
		this.model = model
		this.view = view

		this.model.taskListChanged(this.displayTasks)
		this.view.addTask(this.handleAddTask)
		this.view.deleteTask(this.handleDeleteTask)

		this.displayTasks(this.model.tasks)
	}

	displayTasks = tasks => {
		this.view.displayTasks(tasks)
	}

	handleAddTask = taskText => {
		this.model.addTask(taskText)
	}

	handleDeleteTask = text => {
		this.model.deleteTask(text)
	}
}

const app = new Controller(new Model(), new View())