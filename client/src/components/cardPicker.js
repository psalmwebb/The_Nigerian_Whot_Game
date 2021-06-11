import {cardPickerStyle} from "../css/playground.module.css"
import {useContext} from "react"
import {CardContext} from "../contexts/cardContext"
import {SocketContext} from "../contexts/socketContext"

export default function CardPicker(){

    const {setShowCardPicker,setCardMustPlay,setPlayerTurns} = useContext(CardContext)
    const {socket} = useContext(SocketContext)
    const icons = ["circle","triangle","squares","stars","crosses"]
    
    function handleClick(e)
    {
       console.log(e.target.id)
       setCardMustPlay(e.target.id.toLowerCase())
       setShowCardPicker(false)
       setPlayerTurns("otherPlayer")
       socket.emit("card-must-play",e.target.id.toLowerCase())
       socket.emit("switch-turn","me")
    }
    
    return (
        <div className={cardPickerStyle}>
          {icons.map(icon=> <div id={icon} key={Math.random()} onClick={handleClick}>{icon}</div>)}
        </div>
    )
}