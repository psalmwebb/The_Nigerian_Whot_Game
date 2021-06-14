import {playGroundStyle} from "../css/playground.module.css"
import CardHolder from "./cardHolder"
import CardStore from "./cardStore"
import {CardContext} from "../contexts/cardContext"
import PlayArea from "./playArea"
import CardPicker from "./cardPicker"
import Score from "./score"
// import { CardContext } from "../contexts/cardContext"
import {useContext,useEffect,useRef} from "react"
import { SocketContext } from "../contexts/socketContext"

export default function PlayGround({history:{push}}) {
    
    const {gameState,setPlayerTurns,hasGameEnd,setHasGameEnd,gameMode,setScores,
           setCanShare,showCardPicker,setCardStore,
           unSetGameState,initCardObj} = useContext(CardContext)
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



    useEffect(()=>{
      if(gameState.me.length === 0 && gameState.playArea.length !== 0){
         
          setHasGameEnd(true)
          setTimeout(()=>{
             setScores((prevScores)=>{
                 let newScores = [...prevScores]
                 newScores[0]+=1
                 return newScores
             })
          },500)

          setTimeout(()=>{
             unSetGameState()

          },1500)

        //  if(gameMode === "multi-player"){
        //     socket.emit('update-scores',[1,0])
        //  }
      }
      else if(gameState.otherPlayer.length === 0 && gameState.playArea.length !== 0){
           setHasGameEnd(true)
           setTimeout(()=>{
              setScores((prevScores)=>{
                  let newScores = [...prevScores]
                  newScores[1]+=1
                  return newScores
              })
           },500)

           setTimeout(()=>{
            unSetGameState()
           },1500)

      }
  },[gameState])

    useEffect(()=>{

      let hostCardStore,remoteCardStore;

      if(hasGameEnd){
        console.log("Game Started...")
        console.log(gameMode)
        setTimeout(()=>{
          if(gameMode === "multi-player"){
              if(isHost === "host"){
              [hostCardStore,remoteCardStore] = cardsForRemoteAndHost()

                socket.emit("send-cards-to-remote",remoteCardStore)

                socket.on("remote-receive-cards",message=>{
                  console.log(message)
     
                  setCardStore(hostCardStore).then(()=>{
                     setCanShare(true)
                     setHasGameEnd(false)
                    //  setPlayerTurns("me")
                  })
               })
            }
          }
          else if(gameMode === "single player"){

            console.log("We share to single players")
              setCardStore().then(()=>{
                setCanShare(true)
              })
              setPlayerTurns("me")
              setHasGameEnd(false)
          }
        },2000)
      }

    },[hasGameEnd])

    const sendCardStoreToRemote = useRef(function(){

      const [hostCardStore,remoteCardStore] = cardsForRemoteAndHost()

      socket.on("opp-connected",(message)=>{
          console.log(message)

          socket.emit("send-cards-to-remote",remoteCardStore)

          socket.on("remote-receive-cards",message=>{
             console.log(message)

             setCardStore(hostCardStore).then(()=>{
                setCanShare(true)
                setPlayerTurns("me")
             })
          })
      })

      // console.log(localCardStore)
  })

  const receiveCardStoreFromHost = useRef(function(){

      socket.on("send-cards-to-remote",remoteCardStore=>{
          console.log("Cardstore sent by host...")
          console.log(remoteCardStore)

          socket.emit("remote-receive-cards","We received the cardstore...")

          setCardStore(remoteCardStore).then(()=>{
            setCanShare(true)
            setHasGameEnd(false)
            setPlayerTurns("otherPlayer")
          })
      })
  })

   function cardsForRemoteAndHost(){
       
    let localCardStore = initCardObj()

    let cardStoreForRemote = [...localCardStore.slice(0,localCardStore.length - 4),
                         ...localCardStore.slice(localCardStore.length - 2,localCardStore.length),
                         ...localCardStore.slice(localCardStore.length - 4,localCardStore.length - 2)]

     return [localCardStore,cardStoreForRemote]

   }

    return (
       <div className={playGroundStyle}>
         <Score/>
         <CardHolder type="otherPlayer"/>
         <CardStore mode={gameMode}/>
         <PlayArea mode={gameMode}/>   
         <CardHolder type="me" mode={gameMode}/>
         {showCardPicker && <CardPicker/>}
       </div>
    )
}
