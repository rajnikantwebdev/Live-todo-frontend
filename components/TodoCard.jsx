import { useDrag } from "react-dnd";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import TodoModal from "./TodoModal";
import { TaskDataContext } from "./TaskContext";

const TodoCard = ({ todoData }) => {
  const { isModalOpen, closeModal, openModal } = useContext(ModalContext);
  const { handleEdit } = useContext(TaskDataContext);
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
      case "completed":
        return "#2ed573";
      case "in-progress":
        return "#3742fa";
      case "pending":
        return "#ffa502";
      default:
        return "#747d8c";
    }
  };

  const handleTaskEdit = (id, status) => {
    openModal();
    handleEdit(id, status);
  };

  const handleDelete = () => {
    console.log("Delete todo:", todoData);
  };

  return (
    <div style={styles.card} ref={drag}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title || "Untitled Todo"}</h3>
        <div style={styles.actions}>
          <button
            style={styles.actionButton}
            onClick={() => handleTaskEdit(todoData._id, todoData.status)}
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <p style={styles.description}>
          {description || "No description provided"}
        </p>

        <div style={styles.metadata}>
          <div style={styles.metadataItem}>
            <span style={styles.label}>Assigned to:</span>
            <span style={styles.value}>
              {assignedUser.username || "Unassigned"}
            </span>
          </div>

          <div style={styles.statusPriority}>
            <span
              style={{
                ...styles.badge,
                backgroundColor: getStatusColor(status),
              }}
            >
              {status || "No Status"}
            </span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: getPriorityColor(priority),
              }}
            >
              {priority || "No Priority"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e1e8ed",
    borderRadius: "12px",
    padding: "20px",
    margin: "10px 0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: "400px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  title: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50",
    lineHeight: "1.4",
    flex: "1",
    paddingRight: "10px",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    backgroundColor: "transparent",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    color: "#57606f",
  },
  deleteButton: {
    color: "#ff4757",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  description: {
    margin: "0",
    fontSize: "14px",
    color: "#57606f",
    lineHeight: "1.5",
  },
  metadata: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  metadataItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    color: "#8395a7",
    fontWeight: "500",
    minWidth: "80px",
  },
  value: {
    fontSize: "13px",
    color: "#2c3e50",
    fontWeight: "500",
  },
  statusPriority: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  icon: {
    width: "18px",
    height: "18px",
  },
};

export default TodoCard;
