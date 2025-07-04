import React from "react";
import Column from "./Column";
import { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const KanbarBoard = () => {
  const [todosList, setTodosList] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

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
            if (t.status === "Todo") {
              newTodo.todo.push(t);
            } else if (t.status === "Done") {
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

  const columnConfigs = [
    { title: "Todo", key: "todo", color: "#e3f2fd" },
    { title: "In Progress", key: "inProgress", color: "#fff3e0" },
    { title: "Done", key: "done", color: "#e8f5e8" },
  ];

  const onDropTask = (task, targetColumn) => {
    if (task.status === targetColumn) return;

    setTodosList((prev) => {
      const newList = {
        todo: prev.todo.filter((t) => t._id !== task._id),
        inProgress: prev.inProgress.filter((t) => t._id !== task._id),
        done: prev.done.filter((t) => t._id !== task._id),
      };
      const updatedTask = { ...task, status: targetColumn };
      newList[targetColumn].push(updatedTask);

      return newList;
    });
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
