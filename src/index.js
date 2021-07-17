/**
 * @file Provides the main functionality of the app. Utilizes React Hooks.
 * @author DorukKantarcioglu
 * @version 0.1.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Toast} from 'primereact/toast';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function ToDo({toDo, handleToggle}) 
{
  const handleClick = (e) => {
    e.preventDefault();
    handleToggle(e.currentTarget.id);
  };

  return (
    <div id={toDo.task} className={toDo.complete ? 'toDo marked' : 'toDo'} onClick={handleClick}>
      {toDo.task}
    </div>
  );
}

function ToDoList({toDoList, handleToggle, handleFilter}) 
{
  if (Array.isArray(toDoList) && toDoList.length > 0) {
    return (
      <div className='list'>
        {toDoList.map((toDo) => {
          return (
            <ToDo key={toDo.task} toDo={toDo} handleToggle={handleToggle}/>
          )
        })}
        <Button id='listButton' className='p-shadow-13' icon='pi pi-trash' label={'Clear marked'} onClick={handleFilter}/>
      </div>
    );
  }
  else {
    return null;
  }
}

function ToDoForm({addTask}) 
{
  const [userInput, setUserInput] = React.useState('');
  const handleChange = (e) => {
    setUserInput(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(userInput);
    setUserInput('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputText id='formInputText' className='p-shadow-7 p-inputtext-lg' value={userInput} placeholder='Enter your task here...' onChange={handleChange}/>
      <Button id='formButton' className='p-shadow-7 p-button-lg' label={'Add to list'} icon='pi pi-check'/>
      <h1 id='heading'>My to do list:</h1>
    </form>
  );
}

function UseLocalStorage(defaultValue, key) {
  const [value, setValue] = React.useState(() => {
    return (localStorage.getItem(key) !== null
      ? JSON.parse(localStorage.getItem(key)) : defaultValue);
  });

  React.useEffect(() => {localStorage.setItem(key, JSON.stringify(value))}, [key, value]);
  return [value, setValue];
}
  
function App() {
    const [toDoList, setToDoList] = UseLocalStorage(null, 'toDoList');
    const toast = React.useRef();
  
    const handleToggle = (task) => {
        if (toDoList.length) {
            let mapped = toDoList.map((toDo) => {
                return toDo.task === task ? { ...toDo, complete: !toDo.complete } : { ...toDo};
        });
        setToDoList(mapped);
        } 
    };
  
    const handleFilter = () => {
      let filtered = null;
      if (Array.isArray(toDoList)) {
        filtered = toDoList.filter((toDo) => {
          return !toDo.complete;
        });
        if (filtered.length === toDoList.length) {
          toast.current.show({severity: 'error', summary: 'No marked tasks', detail: 'There aren\'t any marked tasks to clear!'});
        }
        setToDoList(filtered);
      }
    };
  
    const addTask = (userInput) => {
      if (!userInput) {
        toast.current.show({severity: 'error', summary: 'Empty task', detail: 'The task needs to be nonempty!'});
        return;
      }
      if (Array.isArray(toDoList)) {
        for (let toDo of toDoList) {
          if (toDo.task === userInput) {
            toast.current.show({severity: 'warn', summary: 'Existing task', detail: 'The task ' + userInput + ' is already on the list!'});
            return;
          }
        }
        setToDoList([...toDoList, {task: userInput, complete: false }]);
      }
      else {
        setToDoList([{task: userInput, complete: false}]);
      }
      toast.current.show({severity: 'success', summary: 'Task added', detail: 'The task ' + userInput + ' is now on the list.'});
    };
  
    return (
      <div>
        <header>
          <h1 className='p-text-center'>Your own to do list!</h1>
          <h2>A to do list for you to add, mark or remove tasks you wish to accomplish.</h2>
          <h4>How to use the app:</h4>
          <ol>
            <li>First, enter the task you want to accomplish to the text field below.</li>
            <li>After typing the task, either press enter or click the <em>Add to list</em> button.</li>
            <li>If a task is done, click on that task to mark it.</li>
            <li>To clear all marked tasks, click the <em>Clear marked</em> button.</li>
          </ol>
          <Toast ref={toast}/>
        </header>
        <main className='p-text-center p-grid p-dir-col'>
          <ToDoForm className='p-col' addTask={addTask}/>     
          <ToDoList className='p-col' toDoList={toDoList} handleToggle={handleToggle} handleFilter={handleFilter}/>
        </main>
        <footer className={(Array.isArray(toDoList) && toDoList.length) ? 'hidden' : null}>
          Implemented by Doruk Kantarcıoğlu, source code available on <a href='https://github.com/DorukKantarcioglu/to-do-list'>GitHub</a>.
        </footer>
      </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
