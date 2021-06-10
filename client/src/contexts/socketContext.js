import {createContext} from "react"
import {useContext,useState,useEffect} from "react"
import {CardContext} from "../contexts/cardContext"
import io from "socket.io-client"


export const SocketContext = createContext()

const URL = 'http://localhost:5000'

export default function SocketContextProvider({children}){
    
    const [socket,setSocket] = useState({})

    const [isHost,setIsHost] = useState(null)

    const [socketId,setSocketId] = useState(null)
    const {gameMode,setPenalty,playRemoteCard,setPickACardCounter, 
           pickRemoteCard,setPlayerTurns} = useContext(CardContext)

    useEffect(()=>{

        if(gameMode === "multi-player" && socketId){
            setSocket(io.connect(URL,{query:{username:socketId}}))
        }

    },[gameMode,socketId])


    useEffect(()=>{

         if(!Object.keys(socket).length) return

         socket.on("card-played",(newCardObj)=>{
            console.log(newCardObj)

            playRemoteCard(newCardObj)

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

         return ()=>{
             if(Object.keys(socket).length){
                 socket.off("card-played",()=>{})
                 socket.off("switch-turn",()=>{})
                 socket.off("remote-pick-card",()=>{})
             }
         }

    },[socket])

    return (
        <SocketContext.Provider value={{socketId,socket,isHost,setIsHost,setSocketId}}>
           {children}
        </SocketContext.Provider>
    )
}