import {CardContext} from "../contexts/cardContext"
import {SocketContext} from "../contexts/socketContext"
import {useContext,useState,useRef,useEffect} from "react"
import {homeStyle} from "../css/home.module.css"

export default function Home({history})
{
    const {gameMode,setGameMode} = useContext(CardContext)
    const {socket,isHost,setIsHost,socketId,setSocketId} = useContext(SocketContext)

    const [showForm,setShowForm] = useState()
    const [showJoinForm,setShowJoinForm] = useState(false)
    const inputRefObj = useRef()

    function handleClick(e)
    {
      if(e.target.id === "singlePlayer"){
        setGameMode(e.target.textContent.toLowerCase())
      }
    }

    function handleClick2(){
       setShowJoinForm(!showJoinForm)
    }

    function handleJoinClick(e){
      console.log(inputRefObj.current.value)
      setIsHost("join")
      setSocketId(inputRefObj.current.value)
      setGameMode("multi-player")
    }

    function handleHostClick(e){

      setSocketId((Math.random() * 10e10).toString(32))
      setIsHost(e.target.id)
      setGameMode("multi-player")
    }

    useEffect(()=>{
        if(gameMode === "multi-player" && Object.keys(socket).length && isHost){
           history.push("/play")
        }
        else if(gameMode === "single player"){
          history.push('/play')
        }
    })

    return (
        <div className={homeStyle}>
        { !showForm &&
           <div>
              <button id="singlePlayer" onClick={handleClick}>Single Player</button>
              <button id="multiPlayer" onClick={()=> setShowForm(true)}>Multi-Player</button> 
           </div>
        }
           {showForm && !showJoinForm && !socketId && <div>
                          <button id="host" onClick={handleHostClick}>Host</button>
                         <button id="join" onClick={handleClick2}>Join</button>
                         </div>}

            { showJoinForm && <section>
              <label>Enter room ID :</label>
              <input type="text" ref={inputRefObj}/><button onClick={handleJoinClick}>JOIN</button>
            </section>
            }
        </div>
    )
}