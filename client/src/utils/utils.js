
const UTILS = {
    
  AI:class{
      constructor(gameState,playerTurns,setPlayerTurns,playCard,pickACard,penalty,
        setPenalty,setPickACardCounter,cardMustPlay,setCardMustPlay){
          this.gameState = gameState
          this.ownedCards = gameState.otherPlayer
          this.numOfCards = gameState.otherPlayer.length
          this.playerTurns = playerTurns
          this.lastCardPlayed = gameState.playArea[gameState.playArea.length - 1]
          this.playCard = playCard
          this.pickACard = pickACard
          this.setPlayerTurns = setPlayerTurns
          this.penalty = penalty
          this.setPenalty = setPenalty
          this.setPickACardCounter = setPickACardCounter
          this.cardMustPlay = cardMustPlay
          this.setCardMustPlay = setCardMustPlay
      }  
      
  autoPickCard(numOfTimes){

    let count = numOfTimes
    let s = setInterval(()=>{
      
      --count
      this.pickACard("otherPlayer")

      if(count === 0) clearInterval(s)
    },numOfTimes > 1 ? 1000 : 2000)
  }


  autoPlayCard(player,cardObj,numOfTimes){

    let count = numOfTimes
    let s = setInterval(()=>{
      
      --count
      this.playCard(player,cardObj)

      if(count === 0){
        clearInterval(s)
      }
    },1000)


  }

  play(){

    if(!this.gameState.cardStore.length) return 
    
    if(this.penalty.to === "otherPlayer"){
      switch(this.penalty.what){
        case "Pick two":
          console.log("Pick Two")
          this.setPenalty({from:"",to:"",what:""})
          this.autoPickCard(2)
          return this.setPlayerTurns("me")
        case "Hold on":
          console.log("Hold on")
          this.setPenalty({from:"",to:"",what:""})
          return this.setPlayerTurns("me")
        case "Go to market":
          console.log("Go to market...")
          this.setPenalty({from:"",to:"",what:""})
          this.autoPickCard(1)
          return this.setPlayerTurns("me")
        default:
      }
    }
     
    
    let cards = document.querySelector(`#otherPlayer`).children

  // console.log(this.ownedCards)
   
    let cardChosen = {}
    let cardsToPlay;

    let cardsPosLeft = Array.from(cards).map((card)=> card.style.left.replace(/%/,""))

    // console.log(this.cardMustPlay)

    if(this.cardMustPlay){
       cardsToPlay = this.ownedCards.filter(card=> card.icon === this.cardMustPlay).map((card,i)=>({...card,type:"otherPlayer",initialLeft:cardsPosLeft[i]}))
      //  console.log(cardsToPlay)
    }
    else{
      cardsToPlay = this.lastCardPlayed ? this.ownedCards.map((card,i)=> ({...card,type:"otherPlayer",initialLeft:cardsPosLeft[i]}))
        .filter(card=> card.cardNum === this.lastCardPlayed?.cardNum || card.icon === this.lastCardPlayed?.icon)
        : this.ownedCards.map((card,i)=> ({...card,type:"otherPlayer",initialLeft:cardsPosLeft[i]}))
    }                                     

    if(cardsToPlay.length){
      cardChosen = cardsToPlay[Math.floor(Math.random() * cardsToPlay.length)]
      setTimeout(()=>{
         this.autoPlayCard("otherPlayer",cardChosen,1)
      },2000)
    }
    else{
       this.autoPickCard(1)
    }
  

    switch(cardChosen.cardNum){
       case 1:
       case 8:
         console.log("Ai - Hold On")
         this.setPenalty({from:"otherPlayer",to:"me",what:"Hold on"})
         this.setPlayerTurns("otherPlayer")
         break
       case 2:
         console.log("Ai - Pick two")
         this.setPlayerTurns("me")
         this.setPenalty({from:"otherPlayer",to:"me",what:"Pick two"})
         break
       case 14:
         console.log("Ai - Go to Market")
         this.setPlayerTurns("me")
         this.setPenalty({from:"otherPlayer",to:"me",what:"Go to market"})
         break
       default:
          this.setPlayerTurns("me")
          this.setPenalty({from:"",to:"",what:""})
          this.setPickACardCounter(0)
    }

    // this.setCardMustPlay("")
  }
}
}


export default UTILS