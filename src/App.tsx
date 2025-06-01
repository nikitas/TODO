import { Board } from './components/Board';
import { Header } from './components/header/Header';

function App() {
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Board />
      </main>
    </div>
  );
}

export default App;
