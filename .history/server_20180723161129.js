var express =  require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
clientIPs = [];

server.listen(process.env.PORT || 3000);
console.log('server is running....')
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    // connect
    console.log('Connected: %s sockets connected', connections.length);
    connections.push(socket);

    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;
    socket.clientIp = socket.request.connection.remoteAddress;
    clientIPs.push(socket.clientIp+"");

    console.log("ip address: "+clientIp+" Id: "+ socketId)
    var random =  Math.floor((Math.random() * 100) + 1);
    
    

    // disconnect
    socket.on('disconnect', function(data){
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets disconnected', connections.length);
    });

    // send messages
    socket.on('send message',function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username, ip: socket.clientIp});
        socket.to(socket.username).emit(msg: data, "");
        // sending to individual socketid (private message)
        // socket.to(<socketid>).emit('hey', 'I just met you');
    });

    // new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push("username: " + socket.username+ " | ip address" + socket.clientIp);
        
        updateUsernames();
    });

    
    

    function updateUsernames(){
        io.sockets.emit('get users', users);
        
        console.log("new user");
    }

    //private message
    // client.on("private", function(data) {        
    //     io.sockets.sockets[data.to].emit("private", { from: client.id, to: data.to, msg: data.msg });
    // client.emit("private", { from: client.id, to: data.to, msg: data.msg });
    // });
});



