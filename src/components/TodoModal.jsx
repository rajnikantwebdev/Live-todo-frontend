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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (todoData) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/task/update/${todoData._id}`,
          { ...formData, lastTimeUpdate: "2023-01-01T10:00:00.000Z" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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

      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        toast(error.response.data.message, {
          type: "error",
        });
        localStorage.removeItem("token");
      }
      console.log("Unable to add Task ", error);
    } finally {
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
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {todoData ? "Edit Todo" : "Create New Todo"}
          </h2>
          <button style={styles.closeButton} onClick={onClose} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter todo title"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Enter todo description"
              rows="4"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Assigned User</label>
              <select
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleInputChange}
                style={styles.select}
              >
                {assignedUserOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={styles.select}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              style={styles.select}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={styles.submitButton}
            >
              {todoData ? "Update Todo" : "Create Todo"}
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
