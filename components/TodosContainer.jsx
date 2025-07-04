import TodoCard from "./TodoCard";
import { useEffect, useState } from "react";
import axios from "axios";

const TodosContainer = () => {
  const [todosList, setTodosList] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/task/get`
        );
        if (response.status === 200) {
          setTodosList(response.data?.data);
        }
      } catch (error) {
        console.log("error while fetching todos ", error);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {todosList.length !== 0 &&
        todosList.map((todos) => <TodoCard key={todos._id} todoData={todos} />)}
    </div>
  );
};

export default TodosContainer;
