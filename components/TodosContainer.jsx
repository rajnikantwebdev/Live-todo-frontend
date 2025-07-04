import TodoCard from "./TodoCard";

const TodosContainer = () => {
  const sampleTodo = {
    title: "Complete User Authentication",
    description:
      "Implement login and registration functionality with JWT tokens and password hashing",
    assignedUser: "John Doe",
    status: "in-progress",
    priority: "high",
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>
        Todo Card Example
      </h2>
      <TodoCard todoData={sampleTodo} />
    </div>
  );
};

export default TodosContainer;
