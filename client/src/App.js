import PlayGround from "./components/playGround"
import CardContextProvider from "./contexts/cardContext"

function App(){
  return (
    <div className="App">
      <CardContextProvider>
        <PlayGround/>
      </CardContextProvider>
    </div>
  );
}

export default App;
