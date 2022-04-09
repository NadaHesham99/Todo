const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./helper/jwt');

// app.set("view engine" ,"ejs");

app.use(cors());
app.options('*',cors);

require('dotenv/config');

const api = process.env.API_URL;

//routes
const ToDo = require('./models/todo');
const todolist = require('./routers/todo');
const group = require('./routers/group');
const user = require('./routers/users');
const res = require('express/lib/response');

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(auth());




app.use(`${api}/ToDoList` , todolist);
app.use(`${api}/ToDoListGroup` , group);
app.use(`${api}/User` , user);



mongoose 
 .connect(process.env.CONNECTION_STRING, {
    useNewURLParser: true,
    useUnifiedTopology: true
 })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

// app.get("/",(req,res)=>{
//    res.render("list");
// })


const port = process.env.PORT ||3000;
app.listen(port,()=>{});
