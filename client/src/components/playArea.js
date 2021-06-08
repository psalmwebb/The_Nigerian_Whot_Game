import {useContext,useRef,useEffect} from "react"
import {CardContext} from "../contexts/cardContext"
import Card from "./card"
import {playAreaStyle} from "../css/playground.module.css"

export default function PlayArea()
{
    const {gameState} = useContext(CardContext)

    const cardPossessed = useRef([])

    useEffect(()=>{
        cardPossessed.current = gameState.playArea.map((obj)=> obj.id)

        // console.log(gameState.playArea)

        // console.log(cardPossessed.current)
    })

    return (
        <div className={playAreaStyle}>
            {
                gameState.playArea.map(cardObj=> 
                                <Card key={Math.random()} 
                                 type="playarea"
                                 shouldAnimate={!cardPossessed.current.includes(cardObj.id)}
                                cardObj ={cardObj} left ={0} 
                                top={0} playCard={()=>{}}/> )
            }
        </div>
    )
}