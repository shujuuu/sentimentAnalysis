// HTTP Portion
var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(5000);

// var options = {
//     key: fs.readFileSync('my-key.pem'),
//     cert: fs.readFileSync('my-cert.pem')
// };

function requestHandler(req, res) {

    var parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);

    fs.readFile(__dirname + parsedUrl.pathname,

        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + parsedUrl.pathname);
            }

            res.writeHead(200);
            res.end(data);
        }
    );
}
console.log('sentiment analysis running on 5000');

//sentiment analysis
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

//serial port
var connected = false;
var SerialPort = require('serialport');
var serialPort = new SerialPort("/dev/cu.usbmodem14101", {
    baudRate: 9600
});
// var Readline = SerialPort.parsers.Readline;
// var parser = new Readline();

serialPort.on("open", function () {
    console.log("serial port open & connected");
});

let webSocketServer = require('ws').Server;
// WebSocket Portion
var io = require('socket.io').listen(httpServer);
// var five = require("johnny-five");
// var board = new five.Board();
let overwrite = 'quarantine zoom distancing isolation corona covid 19';
let options = {
    language: 'en',
    extras: {
        'cats': 5,
        'quarantine': -5,
        'zoom': -3,
        'distancing': -10,
        'isolation': -2,
        'covid': -1,
        '19': -1,
        'lockdown': -5
    }
};

//add new language
// sentiment.registerLanguage(languageCode, language)

io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
        console.log("We have a new client: " + socket.id);

        socket.on('sendTranscript', function (data) {

            // console.log("Received: " + data);
            var result = sentiment.analyze(data, options);
            console.log(result.score); //total score
            // console.log(result.comparative) //
            console.log(result.calculation) //
            // console.log(result.tokens); //all the words
            // console.log(result.words); //reacted words
            // console.log(result.positive) //positive words
            // console.log(result.negative) //negative words

            //option1: for local server only, send data
            socket.emit('result', result);

            if (result.score < "0") {
                console.log('bad result');
                let signalArduino = 1;
                serialPort.write(signalArduino.toString());
                // serialPort.write(52);

                //johnny five
                // board.on("ready", function () {
                //     //LED
                //     // Create a standard `led` component instance
                //     var led = new five.Led(13);
                //     // "blink" the led in 500ms
                //     // on-off phase periods
                //     led.blink(1000);

                //     //MOTOR
                //     var servo = new five.Servo(10);
                //     servo.to(90);
                //     servo.to(90, 500);
                //     servo.to(90, 500, 10);
                //     servo.sweep();
                // });

            } else {
                console.log('mehhhh');
            }

            //option 2: for node server by anthony
            // socket.emit("result", result);
        });


        socket.on('disconnect', function () {
            console.log("Client has disconnected " + socket.id);
        });
    }
);