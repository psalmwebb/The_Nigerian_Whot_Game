import {alertStyle} from "../css/playground.module.css"
import {useRef,useEffect,useContext} from "react"
import {CardContext} from "../contexts/cardContext"


export default function Alert()
{
    const alertRefObj = useRef()
    const {alertMessage,setAlertMessage} = useContext(CardContext)

    useEffect(()=>{
      
      if(!alertMessage) return 

      let s1 = setTimeout(()=>{
        alertRefObj.current.style.right = "0"  
      },1000)

      let s2 = setTimeout(()=>{
        alertRefObj.current.style.right = "-25%"
        setAlertMessage("")
      },5000)

      return ()=>{
          clearTimeout(s1)
          clearTimeout(s2)
      }

    },[alertMessage])

    return (
        <main className={alertStyle} ref={alertRefObj}>
           {alertMessage}
        </main>
    )
}