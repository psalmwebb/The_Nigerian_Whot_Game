import {useContext,useRef,useEffect} from "react"
import {CardContext} from "../contexts/cardContext"
import Card from "./card"
import {playAreaStyle} from "../css/playground.module.css"

export default function PlayArea()
{
    const {gameState} = useContext(CardContext)

    const cardPossessed = useRef([])

    const currentCardObj  = gameState.playArea[gameState.playArea.length - 1]

    useEffect(()=>{
        cardPossessed.current = gameState.playArea.map((obj)=> obj.id)

        // console.log(gameState.playArea)

        // console.log(cardPossessed.current)
    })

    return (
        <div className={playAreaStyle}>
            {/* { currentCardObj &&
                                <Card key={Math.random()} 
                                 type="playarea" isFront={true}
                                 shouldAnimate={!cardPossessed.current.includes(currentCardObj.id)}
                                cardObj ={currentCardObj} left ={0} 
                                top={0} playCard={()=>{}}/>
            } */}

            {
                gameState.playArea.map(cardObj=>(
                    <Card key={Math.random()} 
                    type="playarea" isFront={true}
                    shouldAnimate={!cardPossessed.current.includes(cardObj.id)}
                   cardObj ={cardObj} left ={0} 
                   top={0} playCard={()=>{}}/>
                ))
            }
        </div>
    )
}