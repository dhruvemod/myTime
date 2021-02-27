const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');
// Importing routes
const projectsRoute = require('./routes/api/project');
const projectFeature = require('./routes/api/projectFeatures');
const dailyTaskRoute = require('./routes/api/dailyTasks');
const toDoTaskRoute = require('./routes/api/toDo');
app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());


// Connection to mongoose db
try{
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false }, ()=>console.log(mongoose.connection.readyState));
}catch(err){
    console.log(err);
}

app.use('/projects', projectsRoute);
app.use('/projects', projectFeature);
app.use('/projects', dailyTaskRoute);
app.use('/projects', toDoTaskRoute);



app.get('/', (req, res) => res.send('<h1>Hello World!</h1>'));




// Port to listen to for the application
app.listen(process.env.PORT || 3000);
