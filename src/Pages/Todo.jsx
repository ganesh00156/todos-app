import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TodoApp.css";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      const parsedTodos = JSON.parse(storedTodos);
      const completed = parsedTodos.filter((todo) => todo.completed);
      const active = parsedTodos.filter((todo) => !todo.completed);
      setTodos(active);
      setCompletedTodos(completed);
    } else {
      setTodos([]);
      setCompletedTodos([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos.concat(completedTodos)));
  }, [todos, completedTodos]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setInputValue("");
    }
  };

  const handleTodoClick = (id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      const completed = updatedTodos.filter((todo) => todo.completed);
      const active = updatedTodos.filter((todo) => !todo.completed);
      setTodos(active);
      setCompletedTodos((prevCompletedTodos) => {
        const existingCompleted = prevCompletedTodos.filter(
          (completedTodo) => completedTodo.id !== id
        );
        return completed
          ? [...existingCompleted, ...completed]
          : existingCompleted;
      });
    });
  };

  const handleReset = () => {
    setTodos([]);
    setCompletedTodos([]);
  };

  return (
    <Container className="todo-app">
      <div className="header">
        <h1>TODO App</h1>
        <Button variant="danger" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <Row className="mt-3">
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <Form.Control
            type="text"
            placeholder="Enter a new TODO"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleAddTodo}
            className="mb-3"
          />
        </Col>
      </Row>
      <Row className="todos-row">
        <Col xs={12} md={6}>
          <h2>Active Todos</h2>
          <ListGroup className="todo-list">
            {todos?.map((todo) => (
              <ListGroup.Item
                key={todo.id}
                className="todo"
                onClick={() => handleTodoClick(todo.id)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text">
                    <MdOutlinePending className="mr-2" />
                    {todo.text}
                  </span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col xs={12} md={6}>
          <h2>Completed Todos</h2>
          <ListGroup className="todo-list">
            {completedTodos?.map((todo) => (
              <ListGroup.Item
                key={todo.id}
                className="todo completed"
                onClick={() => handleTodoClick(todo.id)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text">
                    <IoCheckmarkDoneCircleOutline className="mr-2" />
                    {todo.text}
                  </span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoApp;
