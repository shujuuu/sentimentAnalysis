var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
    //LED
    // Create a standard `led` component instance
    var led = new five.Led(13);

    // "blink" the led in 500ms
    // on-off phase periods
    led.blink(1000);

    //MOTOR
    var servo = new five.Servo(11);
    servo.to(90);
    servo.to(90, 500);
    servo.to(90, 500, 10);
    servo.sweep();
});