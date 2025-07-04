import "./App.css";
import TodosContainer from "../components/TodosContainer";
import TodoModal from "../components/TodoModal";
import KanbarBoard from "../components/KanbarBoard";

function App() {
  return (
    <main>
      <KanbarBoard />
      <TodoModal />
    </main>
  );
}

export default App;
