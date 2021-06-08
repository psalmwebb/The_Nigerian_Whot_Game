import {playGroundStyle} from "../css/playground.module.css"
import CardHolder from "./cardHolder"
import CardStore from "./cardStore"
// import {CardContext} from "../contexts/cardContext"
import PlayArea from "./playArea"
// import { CardContext } from "../contexts/cardContext"

export default function PlayGround() {

    return (
       <div className={playGroundStyle}>
         <CardHolder type="otherPlayer"/>
         <CardStore/>
         <PlayArea/>
         <CardHolder type="me"/>
       </div>
    )
}
