import {cardHolderStyle} from "../css/playground.module.css"
import Card from "./card"
import {CardContext} from "../contexts/cardContext"
import {useContext,useEffect,useRef} from "react"
import UTILS from "../utils/utils"

export default function CardHolder({type,isFront}){

    const {gameState,hasGameEnd,playCard,penalty,
           setPenalty,pickACard,playerTurns,setPickACardCounter,
           gameMode,setPlayerTurns,cardMustPlay,setCardMustPlay,setAlertMessage} = useContext(CardContext)

    const cardPossessed = useRef([])

    const cardObjs = type === "otherPlayer" ? gameState.otherPlayer : gameState.me

    // console.log(cardObjs)

    let addStyle = {
        top:type === "otherPlayer" ? "0" : null,
        bottom:type === "me" ? "0" : null
    }

    const AI = new UTILS.AI(gameState,playerTurns,setPlayerTurns,playCard,
               pickACard,penalty,setPenalty,setPickACardCounter,cardMustPlay,setCardMustPlay,setAlertMessage)

    useEffect(()=>{
        cardPossessed.current = cardObjs.map((obj)=> obj.id)

        if(type === "otherPlayer" && playerTurns === "otherPlayer" && gameMode === "single player" && hasGameEnd !== true){
            AI.play()
        }

        if(gameState.otherPlayer.length === 2 && gameState.playArea.length){
            setAlertMessage("AI : semi last card")
        }
        else if(gameState.otherPlayer.length === 1 && gameState.playArea.length){
            setAlertMessage("AI : Last card")
        }

    },[cardObjs,gameMode,playerTurns,type])

    // console.log(cardObjs)

    return (
        <div className={cardHolderStyle} style={addStyle} id={type}>
           {
               cardObjs.length ? cardObjs.map((cardObj,i)=>{
                return <Card left={i * 15 + 3} top={0} id={cardObj?.id} isFront={isFront}
                             width ={10} key={Math.random()} 
                             shouldAnimate={!cardPossessed.current?.includes(cardObj?.id)}
                             cardObj = {cardObj} playCard={playCard} type ={type}/>
               }) : null

           }
        </div>

        // i * 15 + 2
    )
}