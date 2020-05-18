import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: ['1','2','3'],
      taskName: ''
    }
  }

  componentDidMount() {
    this.socket = io();
    this.socket.connect('http://localhost:8000');
  }

  removeTask(index) {
    console.log(index)
    this.setState({
      tasks: this.state.tasks.splice(index, 1),
    })
    this.socket.emit('removeTask', { index: index });
    console.log(this.state.tasks);
  }

  addTask(task) {
    this.setState({
      tasks: this.state.tasks.push(task),
    })
    console.log(this.state.tasks)
  }

  submitForm(event) {
    event.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', { task: this.state.taskName });
  }

  render() {
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => (
              <li key={task} class="task">{task}<button class="btn btn--red" onClick={() => this.removeTask(this.state.tasks.indexOf(task))}>Remove</button></li>
            ))}
          </ul>
          <form id="add-task-form" onSubmit={this.submitForm.bind(this)}>
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={this.state.taskName} onChange={event => this.setState({taskName: event.target.value})} />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;