var app = require('../app');
var debug = require('debug')('backend-nodejs-ce:server');
var fs = require('fs');
var http = require('http');
const dotenv = require('dotenv');
const configData  = fs.readFileSync('.env');
const buf = Buffer.from(configData);
const config = dotenv.parse(buf);
const mongoose = require('mongoose');
const { normalize } = require('path');

//Get port from environment and store in Express
var port = normalizePort(process.env.PORT || config.PORT);
app.set('port',port);

//Create http server
var server = http.createServer(app);

//Listen on provided port, on all network interfaces
function startServer(){
    server.listen(port);
    server.on('error', onError);
    server.on('listening',onListening);
}

//Normalize a port into a number, string, or false

function normalizePort(val){
    var port = parseInt(val,10);

    if(isNaN(port)){return val;}
    if(port>=0){return port;}
    return false;
}

//Event listener for HTTP server "error" event
function onError(error){
    if(error.syscall !=='listen'){
        throw error;
    }

    var bind = typeof port ==='string'
        ? 'Pipe ' + port
        : 'Port ' + port;

        switch(error.code){
            case 'EACCES':
                console.error(bind +' requires elevated privilages');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind +'is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
}

//Event listener for HTTP server "listening" event

function onListening(){
    var addr = server.address();
    var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log("Start Server on",bind)
}

//Connect to DB and after that start server

function connectToDB(){
    mongoose.connect(`${config.MONGO_URL}/${config.DB}`)
    .then(()=>{
        startServer()
    })
    .catch(error => {
        console.error("ERROR_ON_CONNECTION_DB",error);
        setTimeout(()=>{
            connectToDB();
        },2000)
    })
}
connectToDB();