import {createContext} from "react"
import {useContext,useState,useEffect} from "react"
import {CardContext} from "../contexts/cardContext"
import io from "socket.io-client"


export const SocketContext = createContext()

const URL = process.env.REACT_APP_MODE === "development" ? 'http://localhost:5000' : "/"

export default function SocketContextProvider({children}){
    
    const [socket,setSocket] = useState({})

    const [isHost,setIsHost] = useState(null)

    const [socketId,setSocketId] = useState(null)
    const {gameMode,setPenalty,setCardMustPlay,playCard,setPickACardCounter, 
           pickRemoteCard,setPlayerTurns,setHasGameEnd,setScores,unSetGameState} = useContext(CardContext)

    useEffect(()=>{

        if(gameMode === "multi-player" && socketId){
            setSocket(io.connect(URL,{query:{id:socketId}}))
        }

    },[gameMode,socketId])


    useEffect(()=>{

         if(!Object.keys(socket).length) return

         socket.on("card-played",(newCardObj)=>{

            newCardObj.type = "otherPlayer"
            // newCardObj.initialLeft = -newCardObj.initialLeft

            playCard("otherPlayer",newCardObj)

         })

         socket.on("switch-turn",myTurn=>{
            setPlayerTurns(myTurn)
            console.log("Called...")
         })

         socket.on("remote-pick-card",()=>{
           pickRemoteCard()
         })

         socket.on("update-penalty",({what})=>{
            console.log("Penalty set")
            if(what){
                setPenalty({from:"otherPlayer",to:"me",what})
            }
            else{
                setPenalty({from:"",to:"",what}) 
            }
         })

         socket.on("set-remote-counter",(counter)=>{
            setPickACardCounter(counter)
         })

         socket.on("card-must-play",cardMustPlay=>{
            setCardMustPlay(cardMustPlay)

            console.log("Give me ",cardMustPlay)
         })

        //  socket.on("game-ended",bValue=>{
        //     setHasGameEnd(bValue)
        //  })

        //  socket.on("unset-gamestate",(message)=>{
        //     unSetGameState()
        //  })

        //  socket.on("update-scores",(scores)=>{
        //     setScores(prevScores=>{
        //         let newScores = [...prevScores].map((newScore,i)=> newScore + scores[i])

        //         return newScores
        //     })
        //  })

         return ()=>{
             if(Object.keys(socket).length){
                 socket.off("card-played",()=>{})
                 socket.off("switch-turn",()=>{})
                 socket.off("remote-pick-card",()=>{})
                 socket.off("card-must-play",()=>{})
                 socket.off("game-ended",()=>{})
                 socket.off("unset-gamestate",()=>{})
             }
         }

    },[socket])


    return (
        <SocketContext.Provider value={{socketId,socket,isHost,setIsHost,setSocketId}}>
           {children}
        </SocketContext.Provider>
    )
}