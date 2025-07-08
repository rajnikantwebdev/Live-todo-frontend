import { useDrag } from "react-dnd";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "./ModalContext";
import { TaskDataContext } from "./TaskContext";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { socket } from "../../socketIo";
import { unAuthorizedUser } from "../../utils/unauthorizedUser";

const TodoCard = ({ todoData }) => {
  const { openModal } = useContext(ModalContext);
  const { handleEdit, usersList, isAuth } = useContext(TaskDataContext);
  const [selectedValue, setSelectedValue] = useState();

  const [, drag] = useDrag(() => ({
    type: "task",
    item: todoData,
    end(item, monitor) {
      console.log("Dropped!", item);
    },
  }));

  const { title, description, assignedUser, status, priority } = todoData;
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ff4757";
      case "medium":
        return "#ffa502";
      case "low":
        return "#2ed573";
      default:
        return "#747d8c";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return "#2ed573";
      case "inProgress":
        return "#3742fa";
      case "done":
        return "#ffa502";
      default:
        return "#747d8c";
    }
  };

  const handleTaskEdit = (id, status) => {
    openModal();
    handleEdit(id, status);
  };

  const handleDelete = async () => {
    try {
      const respnose = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/task/delete/${todoData._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (respnose.status === 200) {
        toast(respnose.data.message, {
          type: "success",
        });
      }
    } catch (error) {
      if (error.respnose && error.respnose.data) {
        toast(error.respnose.data.message, {
          type: "error",
        });
      }
    }
  };

  const handleSelected = async (selectedOption) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/re-assign/${todoData._id}`,
        { assignedUser: selectedOption.value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast(response.data.message, {
          type: "success",
        });
      }
    } catch (error) {
      unAuthorizedUser(error.status);
      if (error.respnose && error.respnose.data) {
        toast(error.respnose.data.message, {
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    if (todoData?.assignedUser && usersList.length > 0) {
      setSelectedValue({
        label: todoData.assignedUser.username,
        value: todoData.assignedUser._id,
        taskId: todoData._id,
      });
    }
  }, [todoData, usersList]);

  useEffect(() => {
    const handleReAssign = ({ taskId, assignedUser }) => {
      console.log("taskIdL ", taskId, assignedUser);
      if (selectedValue?.taskId === taskId) {
        setSelectedValue({
          label: assignedUser.username,
          value: assignedUser._id,
          taskId,
        });
      }
    };

    socket.on("task:re-assigned", handleReAssign);

    return () => socket.off("task:re-assigned", handleReAssign);
  }, [selectedValue?.taskId]);

  const handleSmartAssign = async () => {
    try {
      const userId = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/task/list`
      );

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/re-assign/${todoData._id}`,
        { assignedUser: userId.data.data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast("Smartly " + response.data.message, {
          type: "success",
        });
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast(error.response.data.message, {
          type: "error",
        });
      }
    }
  };

  return (
    <div className="todo-card" ref={drag}>
      <div className="todo-card__header">
        <h3 className="todo-card__title">{title || "Untitled Todo"}</h3>
        {isAuth && (
          <div className="todo-card__actions">
            <button
              className="todo-card__action-button"
              onClick={() => handleTaskEdit(todoData._id, todoData.status)}
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="todo-card__icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              title="Delete"
              className="todo-card__action-button todo-card__action-button--delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="todo-card__icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="todo-card__content">
        <p className="todo-card__description">
          {description || "No description provided"}
        </p>

        <div className="todo-card__metadata">
          <div className="todo-card__assignment">
            <span className="todo-card__label">Assigned to:</span>
            <div className="todo-card__select-container">
              <Select
                value={selectedValue}
                onChange={handleSelected}
                options={usersList}
                styles={customSelectStyles}
                placeholder="Select user..."
                isSearchable={false}
              />
            </div>
          </div>

          <div className="todo-card__status-priority">
            <div className="todo-card__badges">
              <span
                className="todo-card__badge"
                style={{ backgroundColor: getStatusColor(status) }}
              >
                {status === "inProgress" ? "INPROG.." : status || "No Status"}
              </span>
              <span
                className="todo-card__badge"
                style={{ backgroundColor: getPriorityColor(priority) }}
              >
                {priority === "Medium" ? "MED" : priority || "No Priority"}
              </span>
            </div>
            <button
              onClick={handleSmartAssign}
              className="todo-card__smart-assign"
            >
              Smart Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    fontSize: "12px",
    border: "1px solid #ccc",
    borderRadius: "30px",
    width: "120px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#888",
    },
  }),
  menu: (base) => ({
    ...base,
    fontSize: "14px",
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eee" : "#fff",
    color: "#333",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#333",
  }),
};

export default TodoCard;
