import express from "express";
import pool from '../dbConfig.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {jwtToken} from '../utils/jwt-helpers.js';

const router=express.Router();

//log-in
router.post('/login',async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await pool.query(
            'SELECT * FROM users WHERE user_email=$1',
            [email]);
        if (user.rows.length === 0) return res.status(401).json({error: "Email doesn't existed"});
        const validPassword= bcrypt.compare(password,user.rows[0].user_password);
        if(!validPassword) return res.status(401).json({error: "Invalid password"});
        let tokens= jwtToken(user.rows[0]);
        res.cookie('refresh_token',tokens.refreshToken,{httpOnly:true});
        res.json(tokens);
    } catch(error){
        res.status(401).json({error:error.message});
    }
})

//regenerating new tokens
router.get('/refresh_token', (req,res) =>{
    try{
        const refreshToken= req.cookies.refresh_token;
        if(refreshToken === null) return res.status(401).json({error:'Null refresh token'});
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (error,user) =>{
            if(error) return res.status(403).json({error:error.message});
            let tokens=jwtToken(user);
            res.cookie('refresh_token',tokens.refreshToken,{httpOnly:true});
        res.json(tokens);
        })
    }
    catch(error){
        res.status(401).json({error:error.message})
    }
})

export default router;