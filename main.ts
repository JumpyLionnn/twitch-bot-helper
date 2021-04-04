const tmi = require("tmi.js");

class Bot{
    private _client: any;
    private _commands: Command[] = [];
    private _prefix: string;
    constructor(config: botConfig){
        this._client = new tmi.Client({
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
            this._client.color(config.color);
        }

        this._prefix = config.prefix || "!";

        this._client.on("message", this.messageHandler.bind(this));


        this._client.connect();
    }


    public addCommand(command: Command){
        this._commands.push(command);
    }


    private messageHandler(channel: string, userstate: any, message: string, self: any){
        if(self){return;}

        if(message.startsWith(this._prefix)){
            const splitedCommand = this._prefix.split(" ");
            const name = splitedCommand[0].substring(1, splitedCommand[0].length);
            const commandArguments = splitedCommand.splice(0, 1);
            userstate.broadcaster = channel.substring(1, channel.length) === userstate.name;
            this._commands.forEach(command => {
                if(command.name === name && command.argumentsNumber === commandArguments.length){
                    const user = new User(userstate);
                    const commandInfo = new CommandInfo(channel, commandArguments, user);
                    command.execute(commandInfo);
                }
            });
        }
    }
}