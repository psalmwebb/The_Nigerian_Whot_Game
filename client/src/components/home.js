import {CardContext} from "../contexts/cardContext"
import {SocketContext} from "../contexts/socketContext"
import {useContext,useState,useEffect} from "react"
import {homeStyle} from "../css/playground.module.css"

export default function Home({history})
{
    const {gameMode,setGameMode} = useContext(CardContext)
    const {socket,isHost,setIsHost,setSocketId} = useContext(SocketContext)

    const [showForm,setShowForm] = useState()

    function handleClick(e)
    {
      if(e.target.id === "singlePlayer"){
        setGameMode(e.target.textContent.toLowerCase())
      }
    }

    function handleClick2(e){
      setIsHost(e.target.id)
      setSocketId("test123")
      setGameMode("multi-player")
    }

    useEffect(()=>{

        console.log(isHost)
        if(gameMode === "multi-player" && Object.keys(socket).length && isHost){
           history.push("/play")
        }
        else if(gameMode === "single player"){
          history.push('/play')
        }
    })

    return (
        <div className={homeStyle}>
           <button id="singlePlayer" onClick={handleClick}>Single Player</button>
           <button id="multiPlayer" onClick={()=> setShowForm(true)}>Multi-Player</button> 
           {showForm && <div>
                          <button id="host" onClick={handleClick2}>Host</button>
                         <button id="join" onClick={handleClick2}>Join</button>
                         </div>}
        </div>
    )
}