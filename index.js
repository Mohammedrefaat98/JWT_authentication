// import cors from 'cors';
import express, {json, urlencoded} from "express"
import dotenv from 'dotenv'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import cookies from "cookie-parser"
dotenv.config();
const app = express();
//we have to use json & urlencoded in case of using 
app.use(json(
    {extended:true}
));
app.use(urlencoded(
    {extended:true}
));
app.use(cookies());

app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/users',usersRouter);
app.use('/api/auth',authRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));