import PlayGround from "./components/playGround"
import Home from "./components/home"
import CardContextProvider from "./contexts/cardContext"
import {BrowserRouter,Route} from "react-router-dom"
import SocketContextProvider from "./contexts/socketContext";

function App(){
  return (
    <div className="App">
      <BrowserRouter>
        <CardContextProvider>
          <SocketContextProvider>
            <Route exact path="/" component={Home}/>
            <Route exact path="/play" component={PlayGround}/>
          </SocketContextProvider>
        </CardContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
