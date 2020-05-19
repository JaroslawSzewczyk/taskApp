import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
    send: true
  }
  
  componentDidMount() {
    this.socket = io.connect('http://localhost:8000/');
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('updateData', (tasks) => this.updateTask(tasks));
    this.socket.on('removeTask', (id) => this.removeTask(id));
  }

  updateTask(tasks) {
    this.setState({
      tasks:  [ ...tasks],
    });
  }

  removeTask(id, isLocal) {
    this.setState({
      tasks: this.state.tasks.filter((task) => task.id !== id),
    })
    if (isLocal) {
      this.socket.emit('removeTask', (id));
      isLocal = false;
    }
  }

  addTask(newTask) {
    this.setState({
      tasks: [...this.state.tasks, newTask],
    })
  }

  submitForm(event) {
    event.preventDefault();
    const newTask = {
      id: uuidv4(),
      name: this.state.taskName
    };
    this.addTask(newTask);
    this.socket.emit('addTask', (newTask));
  }

  render() {

    const newTask = this.state.tasks.map((task) => (
      <li key={task.id} class="task">{task.name}<button class="btn btn--red" onClick={(isLocal = true) => this.removeTask(task.id, isLocal)}>Remove</button></li>
    ));
    
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
           {newTask}
          </ul>
          <form id="add-task-form" onSubmit={this.submitForm.bind(this)}>
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={this.state.taskName} onChange={event => this.setState({taskName: event.target.value})} />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
        {console.log(this.state.tasks)}
      </div>
    );
  };

};

export default App;