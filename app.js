const express = require('express');
const app = express();

//import modules
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//import routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//open conection with mongoose
const  mongoAtlasUri = process.env.MONGO_CONNECT_STRING;

mongoose 
.connect(mongoAtlasUri, {
        useNewUrlParser: true
        })   
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//avoid CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});

//use routes
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);



//handle errors
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404 ;
    next(error);

});
app.use((error,req,res,next)=>{
    res.status((error.status) || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;