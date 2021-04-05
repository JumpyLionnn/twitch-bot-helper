const tmi = require("tmi.js");

class Bot{
    private _client: any;
    private _commands: Command[] = [];
    private _prefix: string;

    private _invalidCommandOutput: string;
    private _invalidCommandArgumentsOutput: string;
    constructor(config: botConfig){
        this._client = new tmi.Client({
            options: {
                debug: config.debug || false,
                messagesLogLevel: config.messagesLogLevel
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

        this._invalidCommandOutput = config.invalidCommandOutput || "Invalid command!";
        this._invalidCommandArgumentsOutput = config.invalidCommandArgumentsOutput || "Invalid command arguments!";

        this._client.on("message", this.messageHandler.bind(this));


        this._client.connect();
    }


    public addCommand(command: Command){
        this._commands.push(command);
    }


    private messageHandler(channel: string, userstate: any, message: string, self: any){
        if(self){return;}
        message = message.trim();
        if(message.startsWith(this._prefix)){
            const splitedCommand = message.split(" ");
            const name = splitedCommand[0].substring(this._prefix.length, splitedCommand[0].length);
            const commandArguments = splitedCommand.splice(1, splitedCommand.length);
            userstate.broadcaster = channel.substring(1, channel.length) === userstate.username;
            const parsedArguments = [];
            for(let command of this._commands) {

                if(command.name === name){
                    if(commandArguments.length === command.commandArguments.length){
                        for(let i = 0; i < command.commandArguments.length; i++){
                            if((command.commandArguments[i] === ArgumentsTypes.number || command.commandArguments[i] === ArgumentsTypes.any) && Number(commandArguments[i])){
                                parsedArguments.push(Number(commandArguments[i]));
                            }
                            else if(command.commandArguments[i] === ArgumentsTypes.string|| command.commandArguments[i] === ArgumentsTypes.any){
                                parsedArguments.push(commandArguments[i]);
                            }
                            else{
                                this._client.say(channel, this._invalidCommandArgumentsOutput);
                                return;
                            }
                        }
                    }
                    else{
                        this._client.say(channel, this._invalidCommandArgumentsOutput);
                        return;
                    }
                    const user = new User(userstate);
                    const commandInfo = new CommandInfo(channel, parsedArguments, user);
                    command.execute(this, commandInfo);
                    return;
                }
            };
            this._client.say(channel, this._invalidCommandOutput);
        }
    }


    public say(channel: string, message: string, type: MessageType = MessageType.normal){
        if(MessageType.normal === type){
            this._client.say(channel, message);
        }
        else{
            this._client.action(channel, message);
        } 
    }

    public clear(channel: string){
        this._client.clear(channel);
    }

    public ban(channel: string, name: string, reason?:string){
        this._client.ban(channel, name, reason);
    }

    public emoteOnly(channel:string, state: boolean){
        if(state){
            this._client.emoteonly(channel);
        }
        else{
            this._client.emoteonlyoff(channel);
        }
    }

    public followerOnly(channel: string, state: boolean, duration?: number){
        if(state){
            this._client.followersonly(channel, duration);
        }
        else{
            this._client.followersonlyoff(channel);
        }
    }

    public host(channel: string, targetChannel: string){
        this._client.host(channel, targetChannel);
    }

    public addChannel(channel: string){
        this._client.join(channel);
    }

    public mod(channel: string, username: string){
        this._client.mod(channel, username);
    }

    public get mods(): string[]{
        return this._client.mods();
    }
}