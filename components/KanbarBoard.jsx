import React from "react";
import Column from "./Column";
import { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { socket } from "../socketIo";
import { useContext } from "react";
import { TaskDataContext } from "./TaskContext";

const KanbarBoard = () => {
  const { todosList, setTodosList } = useContext(TaskDataContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/task/get`
        );
        if (response.status === 200) {
          const newTodo = {
            todo: [],
            inProgress: [],
            done: [],
          };

          response.data?.data.forEach((t) => {
            if (t.status === "todo") {
              newTodo.todo.push(t);
            } else if (t.status === "done") {
              newTodo.done.push(t);
            } else {
              newTodo.inProgress.push(t);
            }
          });

          setTodosList(newTodo);
        }
      } catch (error) {
        console.log("error while fetching todos ", error);
      }
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    const handleTaskCreated = (newTask) => {
      console.log("newTask, ", newTask);
      setTodosList((prev) => {
        if (newTask.status === "Todo") {
          return {
            ...prev,
            todo: [...prev.todo, newTask],
          };
        } else if (newTask.status === "In Progress") {
          return {
            ...prev,
            inProgress: [...prev.inProgress, newTask],
          };
        } else {
          return {
            ...prev,
            done: [...prev.done, newTask],
          };
        }
      });
    };

    socket.on("task:created", handleTaskCreated);

    return () => {
      socket.off("task:created", handleTaskCreated);
    };
  }, []);

  useEffect(() => {
    const handleTaskUpated = ({ updatedTask, oldStatus }) => {
      console.log("old-status: ", oldStatus, updatedTask.status);
      setTodosList((prev) => {
        const newStatus = updatedTask.status;
        const newState = {
          todo: [...prev.todo],
          inProgress: [...prev.inProgress],
          done: [...prev.done],
        };

        const getKey = (status) => {
          if (status === "todo") return "todo";
          if (status === "inProgress") return "inProgress";
          if (status === "done") return "done";
        };

        const oldKey = getKey(oldStatus);
        const newKey = getKey(newStatus);

        if (oldKey === newKey) {
          newState[oldKey] = newState[oldKey].map((t) =>
            t._id === updatedTask._id ? updatedTask : t
          );
        } else {
          newState[oldKey] = newState[oldKey].filter(
            (t) => t._id !== updatedTask._id
          );
          newState[newKey].unshift(updatedTask);
        }

        return newState;
      });
    };

    socket.on("task:updated", handleTaskUpated);
    return () => socket.off("task:updated", handleTaskUpated);
  }, []);

  const columnConfigs = [
    { title: "Todo", key: "todo", color: "#e3f2fd" },
    { title: "In Progress", key: "inProgress", color: "#fff3e0" },
    { title: "Done", key: "done", color: "#e8f5e8" },
  ];

  const onDropTask = async (task, targetColumn) => {
    console.log(task.status, targetColumn);
    if (task.status === targetColumn) return;
    let updatedTask = null;
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/update/${task._id}`,
        {
          ...task,
          status: targetColumn,
        }
      );
    } catch (error) {
      console.log("Unable to update the task ", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={styles.container}>
        <div style={styles.boardHeader}>
          <h1 style={styles.boardTitle}>Project Board</h1>
          <p style={styles.boardSubtitle}>Manage your tasks efficiently</p>
        </div>
        <div style={styles.columnsContainer}>
          {columnConfigs.map((config) => (
            <Column
              key={config.key}
              title={config.title}
              columnKey={config.key}
              onDropTask={onDropTask}
              tasks={todosList[config.key]}
              columnColor={config.color}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  boardHeader: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "20px",
  },
  boardTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#2d3748",
    margin: "0 0 8px 0",
  },
  boardSubtitle: {
    fontSize: "16px",
    color: "#718096",
    margin: "0",
  },
  columnsContainer: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export default KanbarBoard;
