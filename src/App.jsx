import "./App.css";
import KanbarBoard from "../components/KanbarBoard";
import Header from "../components/Header";
import ModalContextProvider from "../components/ModalContext";
import TaskDataContextProvider from "../components/TaskContext";

function App() {
  return (
    <TaskDataContextProvider>
      <main>
        <ModalContextProvider>
          <Header />
          <KanbarBoard />
        </ModalContextProvider>
      </main>
    </TaskDataContextProvider>
  );
}

export default App;
