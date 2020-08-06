
import React, { useState, useEffect } from "react"
import "./App.css"
import Action from "./action.js"

function App() {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState("")

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await Action.getAllTodos()
      setTodos(todos)
    }
    fetchTodoAndSetTodos()
  }, [])

  const createTodo = async e => {
    e.preventDefault()
    if (!todo) {
      alert("please enter something")
      return
    }
    if (todos.some(({ task }) => task === todo)) {
      alert(`Task: ${todo} already exists`)
      return
    }
    const newTodo = await Action.createTodo(todo)
    setTodos([...todos, newTodo])
  }

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation()
      await Action.deleteTodo(id)
      setTodos(todos.filter(({ _id: i }) => id !== i))
    } catch (err) {}
  }

  const updateTodo = async (e, id) => {
    e.stopPropagation()
    const payload = {
      completed: !todos.find(todo => todo._id === id).completed,
    }
    const updatedTodo = await Action.updateTodo(id, payload)
    setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)))
  }

  return (
    <div className="App col-md-12">
      <div className="col-md-12">
        <input
        className="form-control"
          id="todo-input"
          type="text"
          value={todo}
          placeholder='In put task name'
          onChange={({ target }) => setTodo(target.value)}
        />
      </div>
      <div className="col-md-12 center">
        <button className="btn btn-primary" type="button" onClick={createTodo}>
          Add
        </button>
      </div>
    <div className="col-md-12 text-left">
      <ul className="list-unstyled clickable">
        {todos.map(({ _id, task, completed }, i) => (
          <li
            key={i}
            onClick={e => updateTodo(e, _id)}
            className={completed ? "completed" : ""}
          >
            {task} <span onClick={e => deleteTodo(e, _id)}><i className="fa fa-times clickable" aria-hidden="true"></i></span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  )
}

export default App