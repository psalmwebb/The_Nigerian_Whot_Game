import {scoreStyle} from "../css/playground.module.css"
import {useContext} from "react"
import {CardContext} from "../contexts/cardContext"

export default function Score(){

    const {scores,setHasGameEnd,unSetGameState} = useContext(CardContext)

    return (
        <div className={scoreStyle} onClick={()=> {setHasGameEnd(true);unSetGameState()}}>
            <div>
              <span>You</span>
              <span>{scores[0]}</span>
            </div> 
            <div>
                <span>N.P.C</span>
                <span>{scores[1]}</span>
            </div>
        </div>
    )
}