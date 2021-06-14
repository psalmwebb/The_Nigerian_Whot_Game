import Card from "./card"
import {useContext,useRef,useEffect} from "react"
import {CardContext} from "../contexts/cardContext"
import {SocketContext} from "../contexts/socketContext"
import {cardStoreStyle} from "../css/playground.module.css"


export default function CardStore()
{
      
    const {gameState,hasGameEnd,shareCard,playerTurns,
        pickACard,canShare,pickACardCounter,
        setPickACardCounter,setPenalty,setPlayerTurns} = useContext(CardContext)

    const {socket} = useContext(SocketContext)

    const cardStoreObj = useRef()

    let cardStore = gameState.cardStore.map((cardObj,i)=> 
          <Card key={i} left={0} top={0} cardObj = {cardObj} playCard={()=>{}}/>)


    // console.log(isHost)

    // console.log(cardStore)

    
    useEffect(()=>{
    
        if(canShare === true){
            distCard.current()
        }

    },[canShare])


    const distCard = useRef(function()
    {
        let counter = 0
        let s = setInterval(()=>{
            ++counter
            if(counter > 2){
                shareCard("otherPlayer")
            }
            else{
                shareCard("me")
            }
            if(counter === 4) clearInterval(s)
        },300)
    })

    function handleCardStoreClick(){

        if(hasGameEnd) return

        if(playerTurns !== "me") return

        if(pickACardCounter === -1){
            if(Object.keys(socket).length){
                socket.emit("switch-turn","me")
            }
            return setPlayerTurns("otherPlayer")
        }
        else if(pickACardCounter === 2){
            if(Object.keys(socket).length){
                socket.emit("remote-pick-card","")
            }
            pickACard("me")
            return setPickACardCounter(1)
        }
        else if(pickACardCounter === 1){
            if(Object.keys(socket).length){
                socket.emit("remote-pick-card","")
                socket.emit("switch-turn","me")
            }
            pickACard("me")
            setPickACardCounter(0)
            return setPlayerTurns("otherPlayer")
        }
        else{
            if(Object.keys(socket).length){
                socket.emit("switch-turn","me")
                socket.emit("remote-pick-card","")
                socket.emit("update-penalty",{from:"",to:"",what:""})
                socket.emit("set-remote-counter",0)
            }
            pickACard("me")
            setPlayerTurns("otherPlayer")
            setPenalty({from:"",to:"",what:""})
        }
    }

    return (
        <div className={cardStoreStyle} ref={cardStoreObj} onClick={handleCardStoreClick}>
           {cardStore}
        </div>
    )
}