"use strict";
var ArgumentsTypes;
(function (ArgumentsTypes) {
    ArgumentsTypes[ArgumentsTypes["number"] = 0] = "number";
    ArgumentsTypes[ArgumentsTypes["string"] = 1] = "string";
    ArgumentsTypes[ArgumentsTypes["any"] = 2] = "any";
})(ArgumentsTypes || (ArgumentsTypes = {}));
class Command {
    constructor(name, commandArguments = []) {
        this._name = name;
        this._commandArguments = commandArguments;
    }
    execute(bot, commandInfo) {
    }
    get name() {
        return this._name;
    }
    get commandArguments() {
        return this._commandArguments;
    }
}
class CommandInfo {
    constructor(channel, commandArguments, user) {
        this._channel = channel;
        this._commandArguments = commandArguments;
        this._user = user;
    }
    get commandArguments() {
        return this._commandArguments;
    }
    get channel() {
        return this._channel;
    }
    get user() {
        return this._user;
    }
}
const tmi = require("tmi.js");
class Bot {
    constructor(config) {
        this._commands = [];
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
        if (config.color) {
            this._client.color(config.color);
        }
        this._prefix = config.prefix || "!";
        this._invalidCommandOutput = config.invalidCommandOutput || "Invalid command!";
        this._invalidCommandArgumentsOutput = config.invalidCommandArgumentsOutput || "Invalid command arguments!";
        this._client.on("message", this.messageHandler.bind(this));
        this._client.connect();
    }
    addCommand(command) {
        this._commands.push(command);
    }
    messageHandler(channel, userstate, message, self) {
        if (self) {
            return;
        }
        message = message.trim();
        if (message.startsWith(this._prefix)) {
            const splitedCommand = message.split(" ");
            const name = splitedCommand[0].substring(this._prefix.length, splitedCommand[0].length);
            const commandArguments = splitedCommand.splice(1, splitedCommand.length);
            userstate.broadcaster = channel.substring(1, channel.length) === userstate.username;
            const parsedArguments = [];
            for (let command of this._commands) {
                if (command.name === name) {
                    if (commandArguments.length === command.commandArguments.length) {
                        for (let i = 0; i < command.commandArguments.length; i++) {
                            if ((command.commandArguments[i] === ArgumentsTypes.number || command.commandArguments[i] === ArgumentsTypes.any) && Number(commandArguments[i])) {
                                parsedArguments.push(Number(commandArguments[i]));
                            }
                            else if (command.commandArguments[i] === ArgumentsTypes.string || command.commandArguments[i] === ArgumentsTypes.any) {
                                parsedArguments.push(commandArguments[i]);
                            }
                            else {
                                this._client.say(channel, this._invalidCommandArgumentsOutput);
                                return;
                            }
                        }
                    }
                    else {
                        this._client.say(channel, this._invalidCommandArgumentsOutput);
                        return;
                    }
                    const user = new User(userstate);
                    const commandInfo = new CommandInfo(channel, parsedArguments, user);
                    command.execute(this, commandInfo);
                    return;
                }
            }
            ;
            this._client.say(channel, this._invalidCommandOutput);
        }
    }
    say(channel, message, type = MessageType.normal) {
        if (MessageType.normal === type) {
            this._client.say(channel, message);
        }
        else {
            this._client.action(channel, message);
        }
    }
    clear(channel) {
        this._client.clear(channel);
    }
    ban(channel, name, reason) {
        this._client.ban(channel, name, reason);
    }
    emoteOnly(channel, state) {
        if (state) {
            this._client.emoteonly(channel);
        }
        else {
            this._client.emoteonlyoff(channel);
        }
    }
    followerOnly(channel, state, duration) {
        if (state) {
            this._client.followersonly(channel, duration);
        }
        else {
            this._client.followersonlyoff(channel);
        }
    }
    host(channel, targetChannel) {
        this._client.host(channel, targetChannel);
    }
    addChannel(channel) {
        this._client.join(channel);
    }
    removeChannel(channel) {
        this._client.part(channel);
    }
    mod(channel, username) {
        this._client.mod(channel, username);
    }
    get mods() {
        return this._client.mods();
    }
    ping(callback) {
        this._client.ping().then((data) => {
            callback(data[0]);
        });
    }
    slowMode(channel, state, seconds) {
        if (state) {
            this._client.slow(channel, seconds);
        }
        else {
            this._client.slowoff(channel);
        }
    }
}
var MessageType;
(function (MessageType) {
    MessageType[MessageType["normal"] = 0] = "normal";
    MessageType[MessageType["action"] = 1] = "action";
})(MessageType || (MessageType = {}));
class User {
    constructor(userstate) {
        this._name = userstate.username;
        this._displayName = userstate["display-name"];
        this._id = userstate["user-id"];
        this._color = userstate.color;
        this._broadcaster = userstate.broadcaster;
        this._mod = userstate.mod;
        this._subscriber = userstate.subscriber;
    }
    isSubscribed() {
        return this._subscriber;
    }
    isMod() {
        return this._mod;
    }
    isBroadcaster() {
        return this._broadcaster;
    }
    get name() {
        return this._name;
    }
    get displayName() {
        return this._displayName;
    }
    get id() {
        return this._id;
    }
    get color() {
        return this._color;
    }
}
class ClearCommand extends Command {
    execute(bot, commandInfo) {
        if (commandInfo.user.isBroadcaster() || commandInfo.user.isMod()) {
            bot.clear(commandInfo.channel);
        }
        else {
            bot.say(commandInfo.channel, "You dont have the reqiured premisions to performs this command!");
        }
    }
}
class EmoteCommand extends Command {
    execute(bot, commandInfo) {
        bot.emoteOnly(commandInfo.channel, true);
        setTimeout(() => {
            bot.emoteOnly(commandInfo.channel, false);
        }, commandInfo.commandArguments[0] * 1000);
    }
}
class HelloCommand extends Command {
    execute(bot, commandInfo) {
        bot.say(commandInfo.channel, "Hello!");
    }
}
class SoCommand extends Command {
    execute(bot, commandInfo) {
        if (commandInfo.user.isBroadcaster() || commandInfo.user.isMod()) {
            bot.say(commandInfo.channel, `Go and check out ${commandInfo.commandArguments[0]} in https://www.twitch.tv/${commandInfo.commandArguments[0]}!`, MessageType.action);
        }
        else {
            bot.say(commandInfo.channel, "You dont have the reqiured premisions to performs this command!");
        }
    }
}
/// <reference path="helloCommand.ts" />
/// <reference path="clearCommand.ts" />
/// <reference path="soCommand.ts" />
/// <reference path="emoteChatCommand.ts" />
/// <reference path="../argumetsType.ts" />
require("dotenv").config();
let bot = new Bot({
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_TOKEN,
    channels: ["jumpylion8"],
    debug: true,
});
bot.addCommand(new HelloCommand("hello"));
bot.addCommand(new ClearCommand("clear"));
bot.addCommand(new SoCommand("so", [ArgumentsTypes.string]));
bot.addCommand(new EmoteCommand("emoteonlychat", [ArgumentsTypes.number]));
