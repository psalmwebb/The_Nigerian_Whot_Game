import {CardContext} from "../contexts/cardContext"
import {SocketContext} from "../contexts/socketContext"
import {useContext,useState,useRef,useEffect} from "react"
import {homeStyle} from "../css/home.module.css"

export default function Home({history})
{
    const {gameMode,setGameMode} = useContext(CardContext)
    const {socket,isHost,setIsHost,socketId,setSocketId} = useContext(SocketContext)

    const [showForm,setShowForm] = useState()
    const [roomID,setRoomID] = useState("")
    const [countDown,setCountDown] = useState(15)
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

      setSocketId("test123")

      let s = setInterval(()=>{
         
        setCountDown((prevCountDown)=>{
           if(prevCountDown === 0){
              clearInterval(s)
           }
           else{
              return prevCountDown - 1
           }
        })
      },1000)

      setTimeout(()=>{
        setIsHost(e.target.id)
        setGameMode("multi-player")
      },16000)
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
            { socketId && !showJoinForm && <section>
              <p>Your room id is : <b><big>{socketId}</big></b></p>
             {<p>Copy and send this id to the other player</p>} 
              <p><small>Redirected in {countDown}s</small></p>
            </section>
            }

            { showJoinForm && <section>
              <label>Enter room ID :</label>
              <input type="text" ref={inputRefObj}/><button onClick={handleJoinClick}>JOIN</button>
            </section>
            }
        </div>
    )
}