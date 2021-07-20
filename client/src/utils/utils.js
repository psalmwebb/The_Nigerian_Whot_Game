
const UTILS = {
    
  AI:class{
      constructor(gameState,playerTurns,setPlayerTurns,playCard,pickACard,penalty,
        setPenalty,setPickACardCounter,cardMustPlay,setCardMustPlay,setAlertMessage){
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
          this.setAlertMessage = setAlertMessage
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

  updatePlayerTurnsWithDelay(player){
    setTimeout(()=>{
      this.setPlayerTurns(player)
    },1000)
  }

  play(){

    if(!this.gameState.cardStore.length) return 

    if(this.playerTurns !== "otherPlayer") return 
    if(!this.gameState.me.length) return
    
    if(this.penalty.to === "otherPlayer"){
      switch(this.penalty.what){
        case "Pick two":
          // this.setAlertMessage("You --> Pick Two")
          this.setPenalty({from:"",to:"",what:""})
          this.autoPickCard(2)
          return this.setPlayerTurns("me")
        case "Hold on":
          // this.setAlertMessage("You --> Hold on")
          this.setPenalty({from:"",to:"",what:""})
          return this.setPlayerTurns("me")
        case "Go to market":
          // this.setAlertMessage("You --> Go to market...")
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

    let cardRequest;

    let hasWhotCard = this.ownedCards.map((card,i)=>({...card,type:"otherPlayer",initialLeft:cardsPosLeft[i]}))
                      .find(card=> card.icon === "whot")

    let cardsIconExceptWhot = this.ownedCards.map(card=>card.icon).filter(icon=> icon !== "whot")

    // console.log(cardsIconExceptWhot)

    if(this.cardMustPlay){
       cardsToPlay = this.ownedCards.map((card,i)=>({...card,type:"otherPlayer",initialLeft:cardsPosLeft[i]})).filter(card=> card.icon === this.cardMustPlay)
      //  console.log(cardsToPlay)
    }
    else if(hasWhotCard){
      cardsToPlay = [hasWhotCard]
    }
    else{
      cardsToPlay = this.lastCardPlayed ? this.ownedCards.map((card,i)=> ({...card,type:"otherPlayer",initialLeft:cardsPosLeft[i]}))
        .filter(card=> card.cardNum === this.lastCardPlayed?.cardNum || card.icon === this.lastCardPlayed?.icon)
        : this.ownedCards.map((card,i)=> ({...card,type:"otherPlayer",initialLeft:cardsPosLeft[i]}))
    }                                     

    if(cardsToPlay.length){

      cardChosen = cardsToPlay[Math.floor(Math.random() * cardsToPlay.length)]

      cardRequest = hasWhotCard && cardsIconExceptWhot[Math.floor(Math.random() * cardsIconExceptWhot.length)]

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
         this.setAlertMessage("Ai : Hold On")
         this.setPenalty({from:"otherPlayer",to:"me",what:"Hold on"})
         this.setPlayerTurns("otherPlayer")
         this.setCardMustPlay("")
         break
       case 2:
         this.setAlertMessage("Ai : Pick two")
         this.updatePlayerTurnsWithDelay("me")
         this.setPenalty({from:"otherPlayer",to:"me",what:"Pick two"})
         this.setCardMustPlay("")
         break
       case 14:
         this.setAlertMessage("Ai : Go to Market")
         this.updatePlayerTurnsWithDelay("me")
         this.setPenalty({from:"otherPlayer",to:"me",what:"Go to market"})
         this.setCardMustPlay("")
         break
       case 20:
         this.setAlertMessage(`Ai : Give me ${cardRequest ? cardRequest : "stars"}`)
         this.setCardMustPlay(cardRequest ? cardRequest : "stars")
         this.updatePlayerTurnsWithDelay("me")
         break
       default:
          this.updatePlayerTurnsWithDelay("me")
          this.setPenalty({from:"",to:"",what:""})
          this.setPickACardCounter(0)
          if(cardChosen.icon === this.cardMustPlay) this.setCardMustPlay("")
    }
   
  }
}
}


export default UTILS