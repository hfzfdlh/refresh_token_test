const express = require('express')
const app = express ()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userData = [
    {
        email:"jim@mail.com",
        password:"12345"
    },
    {
        email:"kim@mail.com",
        password:"12345"
    }
]

const refreshKey = {}

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/login',async (req,res)=>{
    const {email, password} = req.body
    let token = ''
    let refresh_token = ''
    let status = false
    userData.forEach(el=>{
        if (el.email == email){
            if (el.password == password){
                token = jwt.sign({email:email},process.env.APP_TOKEN_SECRET, {expiresIn:'15s'})
                refresh_token = jwt.sign({email:email}, process.env.APP_REFRESH_TOKEN)
                refreshKey[token] = refresh_token
                console.log("ADD KEY>>>>>",refreshKey)
                status = true
            }
        }
    })

    if (status){
        res.send({token})
    } else{
        res.sendStatus(401)
    }
})

const authentication = async(req,res,next)=>{
    const token = req.headers['authorization']
    console.log(req.headers)
    const tokenVal = token.split(' ')[1]

    if (!tokenVal){
        res.sendStatus(401)
    }

    jwt.verify(tokenVal, process.env.APP_TOKEN_SECRET,(err,user)=>{
        console.log("ERR",err)
        if (err !=null){
            if (err.name == "TokenExpiredError") {
                //check if token has refresh-token pair
                const refresh_token = refreshKey[tokenVal]
                if (!refresh_token){
                    res.sendStatus(401)
                } 
                console.log("REFRESH111>>>>",refreshKey)
                console.log("REFRESH>>>>",refresh_token)
                const user = jwt.verify(refresh_token, process.env.APP_REFRESH_TOKEN)
                const newToken = jwt.sign({email:user.email}, process.env.APP_TOKEN_SECRET, {expiresIn:'15s'})
                
                refreshKey[newToken] = refresh_token
                delete refreshKey[tokenVal]
                req.user = {token: newToken}
                next()
            } else{
                res.sendStatus(403)
                next()
            }

        } 
        
        next()
    })

 
    
}


app.get('/post',authentication,async (req,res)=>{
    console.log("REQ USER>>>>>",req.user)
    if(req.user !== undefined){
        res.send({
            "token":req.user.token,
            "data":"sdbgiesugbesr"
        })
    } else{
        res.send({
           "data":"sdbgiesugbesr"
        })
    }
})






app.listen(3000)