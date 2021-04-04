const tmi = require("tmi.js");

class Bot{
    private client: any;
    constructor(config: botConfig){
        this.client = new tmi.Client({
            options: {
                debug: config.debug || false,
                messagesLogLevel: config.messagesLogLevel || "info" 
            },
            connection: {
                reconnect: config.reconnect || true,
                secure: config.secure || true
            },
            identity: {
                username: config.username,
                password: config.password
            },
            channels: config.channels
        });
        if(config.color){
            this.client.color(config.color);
        }
        this.client.connect();
    }
}