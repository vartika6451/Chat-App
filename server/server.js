wss.on("connection", (ws) => {
    console.log("Client Connected");

    ws.send("Welcome!");

    ws.on("message", (message) => {
        const text = message.toString();

        console.log(text);

        // Echo the message back
        ws.send(text);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});