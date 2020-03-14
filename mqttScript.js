var clientId = "AnythingyouName";
var client;
var loginFlag = 0;
var options = {
    onSuccess: onConnect,
    onFailure: doFail,
    userName: document.querySelector('#user').value,
    password: document.querySelector('#key').value
};

// connect the client
function login(){
    if(loginFlag == 0) {
        options = {
            onSuccess: onConnect,
            onFailure: doFail,
            userName: document.querySelector('#user').value,
            password: document.querySelector('#key').value
        };
        try {
            // Create a client instance
            clientId = document.querySelector('#user').value;
            client = new Paho.MQTT.Client("host(ex:127.0.0.1)", "port(ex:9001)", clientId);
                        
            // set callback handlers
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;
            client.connect(options);
        }
        finally {
            console.log(loginFlag);
        }
    }
}

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    message = new Paho.MQTT.Message("Connect from " + clientId);
    client.subscribe("login");
    client.subscribe("motor/status");
    client.subscribe("shaft/status");
    message = new Paho.MQTT.Message("Connect from " + clientId);
    message.destinationName = "login";
    client.send(message);
    loginFlag = 1;
}

function startMotor() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Start Motor");

    message = new Paho.MQTT.Message("startMotor");
    message.destinationName = "motor/speed";
    client.send(message);
}

function stopMotor() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("stopMotor");

    message = new Paho.MQTT.Message("stopMotor");
    message.destinationName = "motor/speed";
    client.send(message);
}

function adjustSpeed() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Adjust Speed");
    let pub_message = document.querySelector('#myRange').value;

    message = new Paho.MQTT.Message(pub_message);
    message.destinationName = "test/topic";
    client.send(message);
}


// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    try{
        if (message.destinationName == "motor/status"){
            if (message.payloadString == "on") {
                document.getElementById("out_messages").innerHTML += "Motor On" + "<br>";
                document.getElementById("statusBox").innerHTML = "Motor On: Normal";
                document.getElementById("statusBox").style.background = "rgb(218, 213, 213)";
            }
            if (message.payloadString == "off") {
                document.getElementById("out_messages").innerHTML += "Motor Off" + "<br>";
                // document.getElementById("statusBox").style.background = "rgb(255, 60, 60)";
                document.getElementById("statusBox").innerHTML = "Motor Off";
                document.getElementById("statusBox").style.background = "rgb(218, 213, 213)";
            }
        }
        else if (message.destinationName == "shaft/status") {
            document.getElementById("out_messages").innerHTML += message.payloadString + "<br>";
            var conditionChance = message.payloadString.split(" ");
            if (message.payloadString == "normal") {
                document.getElementById("statusBox").innerHTML = "Motor On: Normal";
                document.getElementById("statusBox").style.background = "rgb(218, 213, 213)";
            }
            else if (message.payloadString == "lean") {
                document.getElementById("statusBox").innerHTML = "Lean";
                document.getElementById("statusBox").style.background = "rgb(255, 60, 60)";
            }
            else if (message.payloadString == "notAlign") {
                document.getElementById("statusBox").innerHTML = "Not Align";
                document.getElementById("statusBox").style.background = "rgb(255, 60, 60)";
            }
            else if (message.payloadString == "loose") {
                document.getElementById("statusBox").innerHTML = "Loose";
                document.getElementById("statusBox").style.background = "rgb(255, 60, 60)";
            }
            else if (message.payloadString == "noOperating") {
                document.getElementById("statusBox").innerHTML = "No Operating";
                document.getElementById("statusBox").style.background = "rgb(218, 213, 213)";
            }
        }
        else if (message.destinationName == "login"){
            console.log("zero");
            document.getElementById("statusBox").innerHTML = "Connected";
            document.getElementById("out_messages").innerHTML += message.payloadString + "<br>";
        }
    }
    catch(err){
        document.getElementById("out_messages").innerHTML=err.message + "<br>";
    }

    chatWindow = document.getElementById("out_messages");
    var xH = chatWindow.scrollHeight;
    chatWindow.scrollTo(0, xH);

    console.log("onMessageArrived:"+message.payloadString);
}

function doFail(e) {
    console.log(e);
    document.getElementById("out_messages").innerHTML += e.errorMessage + "<br>";
    loginFlag = 0;
    chatWindow = document.getElementById("out_messages");
    var xH = chatWindow.scrollHeight;
    chatWindow.scrollTo(0, xH);
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
