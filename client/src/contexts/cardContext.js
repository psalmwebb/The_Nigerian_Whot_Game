import {createContext,useState,useEffect} from "react"

export const CardContext = createContext()

export default function CardContextProvider({children})
{

    const [gameState,setGameState] = useState(
        {
            otherPlayer:[],
            me:[],
            cardStore:[...initCardObj()],
            playArea:[]
        }
    )

    const [playerTurns,setPlayerTurns] = useState("me")

    const [pickACardCounter,setPickACardCounter] = useState(0)
   
    const [penalty,setPenalty] = useState({
        from:"",
        to:"",
        what:""
    })

    console.log(penalty)

    
    useEffect(()=>{
        if(penalty.to === "me"){
            switch(penalty.what){
                case "Pick two":
                   setPickACardCounter(2)
                   break
                case "Hold on":
                    setPickACardCounter(-1)
                   break
                case "Go to market":
                    setPickACardCounter(1)
                    break
                default:

            }
        }
    },[penalty])

    function shareCard(player)
    {
      if(!gameState.cardStore.length) return 

       setGameState((prevGameState)=>{
            let newGameState = {
                ...prevGameState,
                [player]:[...prevGameState[player],prevGameState.cardStore[prevGameState.cardStore.length - 1]],
                cardStore:[...prevGameState.cardStore.slice(0,prevGameState.cardStore.length - 1)]
            }

            return newGameState
       })
    }

    function playCard(type,cardObj){
       
        setGameState(prevGameState=>{
            let newGameState = {
                ...prevGameState,
                playArea:[...prevGameState.playArea,cardObj],
                [type] : [...prevGameState[type].filter(obj=> obj.id !== cardObj.id)]
            }

            return newGameState
        })
    }

    function pickACard(type){
        
        setGameState(prevGameState=>{
            let newGameState = {
                ...prevGameState,
                [type]:[...prevGameState[type],prevGameState.cardStore[prevGameState.cardStore.length - 1]],
                cardStore:[...prevGameState.cardStore.slice(0,prevGameState.cardStore.length - 1)]
            }
            return newGameState
        })
    }

    function initCardObj()
    {

      let cardPacks = {
          "circle":[1,2,3,4,5,7,8,10,11,12,13,14],
          "triangle":[1,2,3,4,5,7,8,10,11,12,13,14],
          "crosses":[1,2,3,5,7,10,11,13,14],
          "squares":[1,2,3,5,7,10,11,13,14],
          "stars":[1,2,3,4,5,7,8],
          "whot":[20,20,20,20,20]
      }

      let cardObjsArr = []

      for(let icon in cardPacks){
          for(let i=0;i<cardPacks[icon].length;i++){
            // console.log(cardPacks[icon][i])
            let cardNum = cardPacks[icon][i]
            cardObjsArr.push({
                cardNum,
                icon,
                punishment:setPunishment(cardNum),
                id:`${icon}${cardNum}_${i}`
            })
          }
      }

      return shuffleCardObjsArr(cardObjsArr)
    }

    function setPunishment(cardNum)
    {
       switch(cardNum){
           case 2:
               return "Pick two";
           case 14:
               return "Suspended";
           case 1:
               return "Hold On";
           case 20:
               return "Ask for a number";
           default:
       }
    }

    function shuffleCardObjsArr(cardObjsArr){
        for(let i=0;i<cardObjsArr.length;i++){
            let j = Math.round(Math.random() * (cardObjsArr.length - 1))

            let temp = cardObjsArr[i]
            cardObjsArr[i] = cardObjsArr[j]
            cardObjsArr[j] = temp
        }
        return cardObjsArr
    }

    return (
        <CardContext.Provider value={{gameState,shareCard,playCard,playerTurns,setPickACardCounter,pickACardCounter,setPlayerTurns,penalty,setPenalty,pickACard}}>
            {children}
        </CardContext.Provider>
    )
}