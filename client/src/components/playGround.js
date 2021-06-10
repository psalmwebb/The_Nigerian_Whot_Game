import {playGroundStyle} from "../css/playground.module.css"
import CardHolder from "./cardHolder"
import CardStore from "./cardStore"
import {CardContext} from "../contexts/cardContext"
import PlayArea from "./playArea"
// import { CardContext } from "../contexts/cardContext"
import {useContext,useEffect,useRef} from "react"
import { SocketContext } from "../contexts/socketContext"

export default function PlayGround({history:{push}}) {
    
    const {gameMode,setCanShare,setCardStore,unSetGameState,initCardObj} = useContext(CardContext)
    const {socket,isHost} = useContext(SocketContext)

      if(gameMode === null){
        push("/")
      }

    useEffect(()=>{

      if(gameMode === "multi-player"){
        if(isHost === "host"){
          console.log("Multi-Player and hosting")
          sendCardStoreToRemote.current()
        }
        else{
          console.log("Multi-Player and joining")
          receiveCardStoreFromHost.current()
        }
      }
      else{
        console.log("Single player!")

        setCardStore().then(()=>{
          setCanShare(true)
        })
      }

      return ()=>{
        unSetGameState()
     }

    },[isHost,gameMode])

    const sendCardStoreToRemote = useRef(function sendCardStoreToRemote(){

      let localCardStore = initCardObj()

      // console.log(localCardStore)

      let cardStoreForRemote = [...localCardStore.slice(0,localCardStore.length - 10),
                           ...localCardStore.slice(localCardStore.length - 5,localCardStore.length),
                           ...localCardStore.slice(localCardStore.length - 10,localCardStore.length - 5)]

      socket.on("opp-connected",(message)=>{
          console.log(message)

          socket.emit("send-cards-to-remote",cardStoreForRemote)

          socket.on("remote-receive-cards",message=>{
             console.log(message)

             setCardStore(localCardStore).then(()=>{
                setCanShare(true)
             })
          })
      })

      // console.log(localCardStore)
  })

  const receiveCardStoreFromHost = useRef(function receiveCardStoreFromHost(){

      socket.on("send-cards-to-remote",hostCardStore=>{
          console.log("Cardstore sent by host...")
          console.log(hostCardStore)

          socket.emit("remote-receive-cards","We received the cardstore...")

          setCardStore(hostCardStore).then(()=>{
            setCanShare(true)
          })
      })
  })


    return (
       <div className={playGroundStyle}>
         <CardHolder type="otherPlayer"/>
         <CardStore mode={gameMode}/>
         <PlayArea mode={gameMode}/>   
         <CardHolder type="me" mode={gameMode}/>
       </div>
    )
}
