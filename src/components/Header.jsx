import TodoModal from "./TodoModal";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { TaskDataContext } from "./TaskContext";
import { Link } from "react-router";
import { useNavigate } from "react-router";

const Header = () => {
  const { isModalOpen, closeModal, openModal } = useContext(ModalContext);
  const { toBeEdit, isAuth } = useContext(TaskDataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header-left-section">
        <h1 className="header-logo">TaskFlow</h1>
      </div>
      <div className="header-right-section">
        {isAuth ? (
          <div className="header-link-container">
            <Link className="header-user-logs-link" to={"/logs"}>
              <img src="/logs.svg" alt="User logs" />
              <span>User Logs</span>
            </Link>
            <button className="header-edit-button" onClick={openModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
            </button>
            <button className="header-link" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="header-container">
            <div className="header-link-container">
              <Link to={"/register"} className="header-link">
                Register
              </Link>
              <Link to={"/login"} className="header-link">
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

export default Header;
