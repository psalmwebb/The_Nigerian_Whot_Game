import Card from "./card"
import {useContext,useRef,useEffect} from "react"
import {CardContext} from "../contexts/cardContext"
import {cardStoreStyle} from "../css/playground.module.css"


export default function CardStore({addTempCard})
{
      
    const {gameState,shareCard,playerTurns,pickACard,pickACardCounter,setPickACardCounter,setPlayerTurns} = useContext(CardContext)
    const turns = useRef("otherPlayer")
    const cardStoreObj = useRef()

    let cardStore = gameState.cardStore.map((cardObj,i)=> 
          <Card key={i} left={0} top={0} cardObj = {cardObj} playCard={()=>{}}/>)


    const distCard = useRef(function()
    {
        if(turns.current === "otherPlayer"){
            shareCard("otherPlayer")
           turns.current = "me"
        }
        else{
            shareCard("me")
            turns.current = "otherPlayer"
        }
        // console.log("Clicked...")

    })

    useEffect(()=>{
 
       let counter = 0
       let s = setInterval(()=>{
           ++counter
           distCard.current()
           if(counter === 10) clearInterval(s)
       },300)
    },[])

    function handleCardStoreClick(){

        console.log(playerTurns)
        if(pickACardCounter === -1){
            return setPlayerTurns("otherPlayer")
        }
        else if(pickACardCounter === 2){
            pickACard("me")
            return setPickACardCounter(1)
        }
        else if(pickACardCounter === 1){
            pickACard("me")
            setPickACardCounter(0)
            return setPlayerTurns("otherPlayer")
        }

           pickACard("me")
           setPlayerTurns("otherPlayer")
    }

    return (
        <div className={cardStoreStyle} ref={cardStoreObj} onClick={handleCardStoreClick}>
           {cardStore}
        </div>
    )
}