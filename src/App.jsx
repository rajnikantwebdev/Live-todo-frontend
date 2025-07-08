import "./components/components.css";
import KanbarBoard from "./components/KanbarBoard";
import Header from "./components/Header";
import ModalContextProvider from "./components/ModalContext";
import TaskDataContextProvider from "./components/TaskContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <TaskDataContextProvider>
      <main>
        <ModalContextProvider>
          <Header />
          <KanbarBoard />
          <ToastContainer />
        </ModalContextProvider>
      </main>
    </TaskDataContextProvider>
  );
}

export default App;
