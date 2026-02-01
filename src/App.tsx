import { PlinkoBoard } from './components/PlinkoBoard';
import { PlinkoSlots } from './components/PlinkoSlots';
import { Controls } from './components/Controls';
import { ResultPanel } from './components/ResultPanel';
import { usePlinkoGame } from './hooks/usePlinkoGame';

function App() {
  const { canvasRef, balance, bet, setBet, onDrop, history, lastHitIndex } = usePlinkoGame();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PLINKO <span className="highlight">CASINO</span></h1>
      </header>

      <main className="game-layout">
        <section className="side-panel left">
          <ResultPanel history={history} />
        </section>

        <section className="game-board-container">
          <div className="board-wrapper">
            <PlinkoBoard canvasRef={canvasRef} />
            <PlinkoSlots lastHitIndex={lastHitIndex} />
          </div>
        </section>

        <section className="side-panel right">
          <Controls
            balance={balance}
            bet={bet}
            setBet={setBet}
            onDrop={onDrop}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
