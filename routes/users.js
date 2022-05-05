import express from "express";
import pool from '../dbConfig.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from "../middleware/authorization.js";
const router=express.Router();

//fetching user's data
router.get('/data',authenticateToken, async (req,res)=> {
    try{
        const users = await pool.query('SELECT * FROM users where user_id = $1',[req.user.user_id]);
        const data=users.rows[0];
        delete data.user_password;
        res.json({users: data});
    } catch(error){
        res.status(500).json({error:error.message})
    }
})

//sign-up new user
router.post('/signup',async (req,res)=>{
    try{
        const hashedPassword= await bcrypt.hash(req.body.password,10);
        const newUser = await pool.query(
            'INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *',
            [req.body.name,req.body.email,hashedPassword]);
        res.json({users: newUser.rows[0]});
    } catch(error){
        res.status(500).json({error:error.message})
    }
})

export default router;