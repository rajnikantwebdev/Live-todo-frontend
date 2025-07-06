import { createContext, useState } from "react";

export const TaskDataContext = createContext();

const TaskDataContextProvider = ({ children }) => {
  const [todosList, setTodosList] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [toBeEdit, setToBeEdit] = useState();

  const handleEdit = (id, status) => {
    setToBeEdit(
      todosList[
        (status.substring(0, 1).toLowerCase() + status.substring(1)).replace(
          / +/g,
          ""
        )
      ].find((todo) => todo._id === id)
    );
  };

  return (
    <TaskDataContext.Provider
      value={{ toBeEdit, todosList, setTodosList, setToBeEdit, handleEdit }}
    >
      {children}
    </TaskDataContext.Provider>
  );
};

export default TaskDataContextProvider;
