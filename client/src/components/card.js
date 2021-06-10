import {cardStyle} from "../css/playground.module.css"
import {useCallback,useRef,useContext} from "react"
import {CardContext} from "../contexts/cardContext"
import {SocketContext} from "../contexts/socketContext"


export default function Card({width,left,top,cardObj,playCard,type,shouldAnimate})
{
    const cardRef = useRef()

    const {playerTurns,setPlayerTurns,pickACardCounter,setPenalty,gameState} = useContext(CardContext)

    const {socket} = useContext(SocketContext)

     
    const prevPlayedCard = gameState.playArea[gameState.playArea.length - 1]

    const localStyle = {
      left:left + "%",
      width:width + "%",
      top:top + "%",
      animation:`move${cardObj.id} 0.2s 1 linear`,
      // zIndex:1000
    }

    // if(type === "first") console.log(shouldAnimate)

    const addCardAnimation = useCallback((styleId,cssRule)=>
    {
      let style = document.createElement("style")
      style.id = styleId
      style.innerText = cssRule

      document.head.appendChild(style)

      setTimeout(()=>{
          document.head.querySelector(`style#${styleId}`).remove()
      },200)
    },[])

      switch(type){
        case "otherPlayer":
          if(shouldAnimate)
            addCardAnimation(cardObj.id,`@keyframes move${cardObj.id}
                                        { from {top:200%;left:90%;z-index:100;} 
                                          to{top:${top}%;left:${left}%;}
                                        }`)
          break
        case "me":
          if(shouldAnimate)
            addCardAnimation(cardObj.id,`@keyframes move${cardObj.id}
                                         { from {top:-200%;left:90%;z-index:100;} 
                                           to{top:${top}%;left:${left}%;}
                                          }`)
          break
        case "playarea":
          if(shouldAnimate)
            addCardAnimation(cardObj.id,`
                              @keyframes move${cardObj.id}
                              { from {top:${cardObj.type === "me" ? "200%":"-200%"};left:${cardObj.initialLeft * 10 - 450}%;z-index:100;} 
                                to{top:${top}%;left:${left}%;}
                              }`)
            break
        default:
  
      }

    function playThisCard()
    {
      if(type !== "me") return

      console.log(pickACardCounter)

      switch(pickACardCounter){
        case 2:
          return console.log("You have to pick 2 card from the stack")
        case 1:
          return console.log("You have to pick one more card from the stack")
        case -1:
          return console.log("Hold on...")
        default:
      }

      if(playerTurns !== type){
        console.log("Not your turn")
        return
      }

      if(prevPlayedCard){
        if(prevPlayedCard.icon !== cardObj.icon && prevPlayedCard.cardNum !== cardObj.cardNum)
        {
          console.log("Card do not match..")
          return
        }
      }

      let newCardObj = {...cardObj,type,initialLeft:left}

      switch(newCardObj.cardNum){
        case 1:
        case 8:
          if(Object.keys(socket).length){
              socket.emit("update-penalty",{from:"me",to:"otherPlayer",what:"Hold on"})
              socket.emit("card-played",newCardObj)
          }
          setPenalty({from:"me",to:"otherPlayer",what:"Hold on"})
          playCard(type,newCardObj)
          break
        case 2:
          if(Object.keys(socket).length) 
          {
              socket.emit("update-penalty",{from:"me",to:"otherPlayer",what:"Pick two"})
              socket.emit("card-played",newCardObj)
              socket.emit("switch-turn","me")
          }
          playCard(type,newCardObj)
          setPlayerTurns("otherPlayer")
          setPenalty({from:"me",to:"otherPlayer",what:"Pick two"})
          break
        case 14:
          if(Object.keys(socket).length){
              socket.emit("update-penalty",{from:"me",to:"otherPlayer",what:"Pick two"})
              socket.emit("card-played",newCardObj)
              socket.emit("switch-turn","me")
          }
          playCard(type,newCardObj)
          setPlayerTurns("otherPlayer")
          setPenalty({from:"me",to:"otherPlayer",what:"Go to market"})
          break
        default:
          if(Object.keys(socket).length){
            socket.emit("card-played",newCardObj)
            socket.emit("switch-turn","me")
            socket.emit("update-penalty",{from:"",to:"",what:""})
            socket.emit("set-remote-counter",0)
          }
          playCard(type,newCardObj)
          setPenalty({from:"",to:"",what:""})
          setPlayerTurns("otherPlayer")
      }
    }

    return (
        <div className={cardStyle} onClick={playThisCard} style={localStyle} ref={cardRef}>
          <div>{cardObj.icon}</div>
          <span>{cardObj.cardNum}</span>
        </div>
    )
}