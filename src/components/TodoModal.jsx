import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { TaskDataContext } from "./TaskContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const TodoModal = ({ isOpen, onClose, onSubmit, todoData = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedUser: "",
    status: "",
    priority: "",
  });
  const [assignedUserOptions, setAssignedUserOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToBeEdit } = useContext(TaskDataContext);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user/list`
        );
        if (response.status === 200) {
          const options = response.data?.userList.map((user) => ({
            value: user._id,
            label: user.username,
          }));
          setAssignedUserOptions(options);
        }
      } catch (error) {
        console.log("unable to fetch user list ", error);
      }
    };
    if (isOpen) {
      fetchUserList();
    }
  }, [isOpen]);

  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "todo", label: "Todo" },
    { value: "inProgress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "", label: "Select Priority" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  useEffect(() => {
    if (todoData) {
      setFormData({
        ...todoData,
        assignedUser: todoData.assignedUser._id,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assignedUser: "",
        status: "",
        priority: "",
      });
    }
  }, [todoData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    } else if (
      formData.title.trim().toLowerCase() === "todo" ||
      formData.title.trim().toLowerCase() === "in progress" ||
      formData.title.trim().toLowerCase() === "done"
    ) {
      newErrors.title =
        "Task title must not be exactly the same as a column name";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    if (!formData.assignedUser) {
      newErrors.assignedUser = "Please select an assigned user";
    }

    if (!formData.status) {
      newErrors.status = "Please select a status";
    }

    if (!formData.priority) {
      newErrors.priority = "Please select a priority";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast("Please fill in all required fields correctly", {
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (todoData) {
        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/task/update/${todoData._id}`,
          formData,
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
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/task/add`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 201) {
          toast(response.data.message, {
            type: "success",
          });
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.status !== 401
      ) {
        toast(error.response.data.message, {
          type: "error",
        });
      }

      if (error.response.status === 401) {
        toast(error.response.data.message, {
          type: "error",
        });

        localStorage.removeItem("token");
      }

      console.log("Unable to add Task ", error);
    } finally {
      setIsSubmitting(false);
      onClose();
      setToBeEdit();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setToBeEdit();
    }
  };

  const handleCancel = () => {
    onClose();
    setToBeEdit();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="todo-modal-backdrop" onClick={handleBackdropClick}>
      <div className="todo-modal">
        <div className="todo-modal__header">
          <h2 className="todo-modal__title">
            {todoData ? "Edit Todo" : "Create New Todo"}
          </h2>
          <button
            className="todo-modal__close-button"
            onClick={onClose}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="todo-modal__form">
          <div className="todo-modal__form-group">
            <label className="todo-modal__label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`todo-modal__input ${
                errors.title ? "todo-modal__input--error" : ""
              }`}
              placeholder="Enter todo title"
              required
            />
            {errors.title && (
              <span className="todo-modal__error-message">{errors.title}</span>
            )}
          </div>

          <div className="todo-modal__form-group">
            <label className="todo-modal__label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`todo-modal__textarea ${
                errors.description ? "todo-modal__textarea--error" : ""
              }`}
              placeholder="Enter todo description"
              rows="4"
            />
            {errors.description && (
              <span className="todo-modal__error-message">
                {errors.description}
              </span>
            )}
          </div>

          <div className="todo-modal__form-row">
            <div className="todo-modal__form-group">
              <label className="todo-modal__label">Assigned User</label>
              <select
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleInputChange}
                className={`todo-modal__select ${
                  errors.assignedUser ? "todo-modal__select--error" : ""
                }`}
              >
                <option value="">Select user</option>
                {assignedUserOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.assignedUser && (
                <span className="todo-modal__error-message">
                  {errors.assignedUser}
                </span>
              )}
            </div>

            <div className="todo-modal__form-group">
              <label className="todo-modal__label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`todo-modal__select ${
                  errors.status ? "todo-modal__select--error" : ""
                }`}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                {errors.status && (
                  <span className="todo-modal__error-message">
                    {errors.status}
                  </span>
                )}
              </select>
            </div>
          </div>

          <div className="todo-modal__form-group">
            <label className="todo-modal__label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className={`todo-modal__select ${
                errors.priority ? "todo-modal__select--error" : ""
              }`}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {errors.priority && (
                <span className="todo-modal__error-message">
                  {errors.priority}
                </span>
              )}
            </select>
          </div>

          <div className="todo-modal__button-group">
            <button
              type="button"
              onClick={handleCancel}
              className="todo-modal__cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="todo-modal__submit-button"
            >
              {isSubmitting
                ? todoData
                  ? "Updating..."
                  : "Creating..."
                : todoData
                ? "Update Todo"
                : "Create Todo"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TodoModal;

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 24px 0 24px",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    transition: "all 0.2s ease",
  },
  form: {
    padding: "0 24px 24px 24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#1f2937",
    backgroundColor: "#ffffff",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#1f2937",
    backgroundColor: "#ffffff",
    transition: "border-color 0.2s ease",
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#1f2937",
    backgroundColor: "#ffffff",
    transition: "border-color 0.2s ease",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "32px",
  },
  cancelButton: {
    padding: "12px 24px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#374151",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  submitButton: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#ffffff",
    backgroundColor: "#3b82f6",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
