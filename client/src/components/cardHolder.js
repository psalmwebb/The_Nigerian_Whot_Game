import {cardHolderStyle} from "../css/playground.module.css"
import Card from "./card"
import {CardContext} from "../contexts/cardContext"
import {useContext,useEffect,useRef} from "react"
import UTILS from "../utils/utils"

export default function CardHolder({type}){

    const {gameState,playCard,penalty,setPenalty,pickACard,playerTurns,setPlayerTurns} = useContext(CardContext)

    const cardPossessed = useRef([])

    const cardObjs = type === "otherPlayer" ? gameState.otherPlayer : gameState.me

    // console.log(cardObjs)

    let addStyle = {
        top:type === "otherPlayer" ? "0" : null,
        bottom:type === "me" ? "0" : null
    }

    useEffect(()=>{
        cardPossessed.current = cardObjs.map((obj)=> obj.id)

        if(type === "otherPlayer" && playerTurns === "otherPlayer"){
            new UTILS.AI(gameState,playerTurns,setPlayerTurns,playCard,pickACard,penalty,setPenalty).play()
        }
    })

    return (
        <div className={cardHolderStyle} style={addStyle} id={type}>
           {
               cardObjs.map((cardObj,i)=>{
                return <Card left={i * 15 + 3} top={0} id={cardObj.id}
                             width ={10} key={Math.random()} 
                             shouldAnimate={!cardPossessed.current.includes(cardObj.id)}
                             cardObj = {cardObj} playCard={playCard} type ={type}/>
               })
           }
        </div>

        // i * 15 + 2
    )
}