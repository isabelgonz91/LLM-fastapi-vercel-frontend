"use client";
import styles from '../styles/todo-list.module.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import ToDo from './ToDo';  // Ensure this path is correct

export default function ToDoList() {
    const [todos, setTodos] = useState([]);
    const [mainInput, setMainInput] = useState('');
    const [filter, setFilter] = useState();
    const didFetchRef = useRef(false);

    useEffect(() => {
        if (!didFetchRef.current) {
            didFetchRef.current = true;
            fetchTodos();
        }
    }, []);

    async function fetchTodos(completed) {
        let path = '/todos';
        if (completed !== undefined) {
            path += `?completed=${completed}`;
        }
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path);
        const json = await res.json();
        setTodos(json);
    }

    const debouncedUpdateTodo = useCallback(debounce((todo) => updateTodo(todo), 500), []);

    function handleToDoChange(e, id) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const copy = todos.slice();
        const idx = todos.findIndex((todo) => todo.id === id);
        const changedToDo = { ...todos[idx], [name]: value };
        copy[idx] = changedToDo;
        debouncedUpdateTodo(changedToDo);
        setTodos(copy);
    }

    async function updateTodo(todo) {
        const data = { name: todo.name, completed: todo.completed };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${todo.id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async function addToDo(name) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/`, {
            method: 'POST',
            body: JSON.stringify({ name: name, completed: false }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const json = await res.json();
            setTodos([...todos, json]);
        }
    }

    function handleDeleteToDo(id) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setTodos(todos.filter(todo => todo.id !== id));
        }
    }

    function handleMainInputChange(e) {
        setMainInput(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && mainInput.trim()) {
            addToDo(mainInput.trim());
            setMainInput('');
        }
    }

    function handleFilterChange(value) {
        setFilter(value);
        fetchTodos(value);
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainInputContainer}>
                <input
                    className={styles.mainInput}
                    placeholder="What needs to be done?"
                    value={mainInput}
                    onChange={handleMainInputChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {!todos.length && <div>Loading...</div>}
            {todos.length > 0 && (
                <div>
                    {todos.map((todo) => (
                        <ToDo key={todo.id} todo={todo} onDelete={handleDeleteToDo} onChange={handleToDoChange} />
                    ))}
                </div>
            )}
            <div className={styles.filters}>
                <button
                    className={`${styles.filterBtn} ${filter === undefined && styles.filterActive}`}
                    onClick={() => handleFilterChange()}
                >
                    All
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === false && styles.filterActive}`}
                    onClick={() => handleFilterChange(false)}
                >
                    Active
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === true && styles.filterActive}`}
                    onClick={() => handleFilterChange(true)}
                >
                    Completed
                </button>
            </div>
        </div>
    );
}
