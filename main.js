"use strict";
class Command {
    constructor(name, argumentsNumber = 0) {
        this._name = name;
        this._argumentsNumber = argumentsNumber;
    }
    execute(bot, commandInfo) {
    }
    get name() {
        return this._name;
    }
    get argumentsNumber() {
        return this._argumentsNumber;
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
            this._commands.forEach(command => {
                if (command.name === name && command.argumentsNumber === commandArguments.length) {
                    const user = new User(userstate);
                    const commandInfo = new CommandInfo(channel, commandArguments, user);
                    command.execute(this, commandInfo);
                }
            });
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
class HelloCommand extends Command {
    execute(bot, commandInfo) {
        bot.say(commandInfo.channel, "Hello!");
    }
}
/// <reference path="helloCommand.ts" />
/// <reference path="clearCommand.ts" />
require("dotenv").config();
let bot = new Bot({
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_TOKEN,
    channels: ["jumpylion8"],
    debug: true
});
bot.addCommand(new HelloCommand("hello", 0));
bot.addCommand(new ClearCommand("clear", 0));
