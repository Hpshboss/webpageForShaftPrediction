var clientId = "AnythingouName";
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
            client = new Paho.MQTT.Client("host(ex:127.0.0.1)", Number(1883), "/ws", clientId);
                        
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
    message.destinationName = "topic";
    client.send(message);
    client.subscribe("topic")
    message = new Paho.MQTT.Message("Connect from " + clientId);
    message.destinationName = "topic";
    client.send(message);
    loginFlag = 1;
}

function startMotor() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Start Motor");
    
    message = new Paho.MQTT.Message("Start Motor");
    message.destinationName = "topic";
    client.send(message);
}

function stopMotor() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Stop Motor");
    
    message = new Paho.MQTT.Message("Stop Motor");
    message.destinationName = "topic";
    client.send(message);
}

function adjustSpeed() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Adjust Speed");
    let pub_message = document.querySelector('#myRange').value;
    
    message = new Paho.MQTT.Message(pub_message);
    message.destinationName = "topic";
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
        document.getElementById("out_messages").innerHTML+=message.payloadString + "<br>";
    }
    catch(err){
        document.getElementById("out_messages").innerHTML=err.message + "<br>";
    }

    console.log("onMessageArrived:"+message.payloadString);
}

function doFail(e) {
    console.log(e);
    document.getElementById("out_messages").innerHTML=e.errorMessage + "<br>";
    loginFlag = 0;
}