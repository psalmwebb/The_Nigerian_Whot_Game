const express = require("express")

const app = express()

const socket = require("socket.io")


const server = app.listen(5000,()=> console.log("Serving on port 5000"))


const io = socket(server,{
    cors:{
        origin:"http://localhost:3000"
    }
})


io.on("connection",(socket:any)=>{
    console.log(socket.id," just connected")

    socket.join(socket.handshake.query.id)

    socket.to(socket.handshake.query.id).emit("opp-connected",socket.id + " just connected")

    socket.on("send-cards-to-remote",(hostCardStore:[])=>{
        socket.broadcast.to(socket.handshake.query.id).emit("send-cards-to-remote",hostCardStore)
    })

    socket.on("remote-receive-cards",(message:String)=>{
        socket.broadcast.to(socket.handshake.query.id).emit("remote-receive-cards",message)
    })

    socket.on("card-played",(newCardObj:object)=>{
       socket.broadcast.to(socket.handshake.query.id).emit("card-played",newCardObj)
    })

    socket.on("switch-turn",(myTurn:string)=>{
        socket.broadcast.to(socket.handshake.query.id).emit("switch-turn",myTurn)
    })

    socket.on("remote-pick-card",(message:string)=>{
       socket.broadcast.to(socket.handshake.query.id).emit("remote-pick-card",message)
    })

    socket.on("update-penalty",(penalty:Object)=>{
        socket.broadcast.to(socket.handshake.query.id).emit("update-penalty",penalty)
    })

    socket.on("set-remote-counter",(counter:Number)=>{
        socket.broadcast.to(socket.handshake.query.id).emit("set-remote-counter",counter)
    })

    socket.on("disconnect",()=>{
        console.log(socket.id, " just disconnected")
    })
})