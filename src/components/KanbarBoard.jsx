import React from "react";
import Column from "./Column";
import { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { socket } from "../../socketIo";
import { useContext } from "react";
import { TaskDataContext } from "./TaskContext";
import { toast } from "react-toastify";

const KanbarBoard = () => {
  const { todosList, setTodosList, setUsersList, usersList } =
    useContext(TaskDataContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/task/get`
        );
        if (response.status === 200) {
          const userMap = new Map();

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

            if (t.assignedUser && !userMap.has(t.assignedUser._id)) {
              userMap.set(t.assignedUser._id, {
                value: t.assignedUser._id,
                label: t.assignedUser.username,
              });
            }
          });

          setTodosList(newTodo);
          setUsersList(Array.from(userMap.values()));
        }
      } catch (error) {
        console.log("error while fetching todos ", error);
      }
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    const handleTaskCreated = (newTask) => {
      setTodosList((prev) => {
        if (newTask.status === "todo") {
          return {
            ...prev,
            todo: [...prev.todo, newTask],
          };
        } else if (newTask.status === "inProgress") {
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

  useEffect(() => {
    const handleTaskDeleted = ({ taskStatus, taskId }) => {
      setTodosList((prev) => {
        if (taskStatus === "todo") {
          return {
            ...prev,
            todo: prev.todo.filter((t) => t._id !== taskId),
          };
        } else if (taskStatus === "inProgress") {
          return {
            ...prev,
            inProgress: prev.inProgress.filter((t) => t._id !== taskId),
          };
        } else {
          return {
            ...prev,
            done: prev.done.filter((t) => t._id !== taskId),
          };
        }
      });
    };

    socket.on("task:deleted", handleTaskDeleted);

    return () => socket.off("task:deleted", handleTaskDeleted);
  }, []);

  const columnConfigs = [
    { title: "Todo", key: "todo", color: "#e3f2fd" },
    { title: "In Progress", key: "inProgress", color: "#fff3e0" },
    { title: "Done", key: "done", color: "#e8f5e8" },
  ];

  const onDropTask = async (task, targetColumn) => {
    if (task.status === targetColumn) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/update/${task._id}`,
        {
          ...task,
          status: targetColumn,
          dnd: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast(`Task moved from ${task.status} to ${targetColumn}`, {
          type: "success",
        });
      }
    } catch (error) {
      if (error) {
        toast("Sorry, Failed to move task.", {
          type: "error",
        });
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-container">
        <div className="kanban-board-header">
          <h1 className="kanban-board-title">Project Board</h1>
          <p className="kanban-board-subtitle">Manage your tasks efficiently</p>
        </div>
        <div className="kanban-columns-container">
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

export default KanbarBoard;
