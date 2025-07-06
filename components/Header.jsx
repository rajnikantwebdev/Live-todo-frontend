import TodoModal from "./TodoModal";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { TaskDataContext } from "./TaskContext";
import { Link } from "react-router";

const Header = () => {
  const { isModalOpen, closeModal, openModal } = useContext(ModalContext);
  const { toBeEdit, isAuth } = useContext(TaskDataContext);

  return (
    <div style={styles.header}>
      <div style={styles.leftSection}>
        <h1 style={styles.logo}>TaskFlow</h1>
      </div>
      <div style={styles.rightSection}>
        {isAuth ? (
          <button
            style={styles.editButton}
            onClick={openModal}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor =
                styles.editButtonHover.backgroundColor;
              e.target.style.transform = styles.editButtonHover.transform;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                styles.editButton.backgroundColor;
              e.target.style.transform = styles.editButton.transform;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
          </button>
        ) : (
          <div style={styles.container}>
            <div style={styles.linkContainer}>
              <Link to={"/register"} style={styles.link}>
                Register
              </Link>
              <Link to={"/login"} style={styles.link}>
                Login
              </Link>
            </div>
          </div>
        )}
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        todoData={toBeEdit}
      />
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: "0",
    zIndex: "1000",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2d3748",
    margin: "0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.5px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    backgroundColor: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#4a5568",
    width: "40px",
    height: "40px",
  },
  editButtonHover: {
    backgroundColor: "#edf2f7",
    transform: "translateY(-1px)",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  linkContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    padding: "6px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
    border: "2px solid #007bff",
    cursor: "pointer",
    display: "inline-block",
    textAlign: "center",
    minWidth: "80px",
  },
};

export default Header;
