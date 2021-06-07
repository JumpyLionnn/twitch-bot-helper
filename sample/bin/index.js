"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var tmi = require("tmi.js");
var express = require("express");
var http = require("http");
var Server = require("socket.io").Server;
var Bot = /** @class */ (function () {
    function Bot(config) {
        this._commands = [];
        this._browserSources = [];
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
        this._debug = config.debug || false;
        this._invalidCommandOutput = config.invalidCommandOutput === "" ? "" : "Invalid command!";
        this._invalidCommandArgumentsOutput = config.invalidCommandArgumentsOutput === "" ? "" : "Invalid command arguments!";
        if (config.server) {
            this._httpServer = express();
            this._io = new Server(http.createServer(this._httpServer));
            this._io.on("connection", this.onSocketConnection.bind(this));
            console.log("setup server");
            if (this._debug) {
                console.log("starting server on port " + (config.server.port || 3000) + "...");
            }
            this._io.listen(config.server.port || 3000, {
                cors: {
                    origin: "*",
                },
            });
        }
        this._client.on("message", this.messageHandler.bind(this));
        this._client.connect();
    }
    Bot.prototype.addCommand = function (command) {
        this._commands.push(command);
    };
    Bot.prototype.messageHandler = function (channel, userstate, message, self) {
        if (self) {
            return;
        }
        message = message.trim();
        if (message.startsWith(this._prefix)) {
            var splitedCommand = message.split(" ");
            var name_1 = splitedCommand[0].substring(this._prefix.length, splitedCommand[0].length);
            var commandArguments = splitedCommand.splice(1, splitedCommand.length);
            userstate.broadcaster = channel.substring(1, channel.length) === userstate.username;
            var parsedArguments = [];
            for (var _i = 0, _a = this._commands; _i < _a.length; _i++) {
                var command = _a[_i];
                if (command.name === name_1) {
                    if (commandArguments.length === command.commandArguments.length) {
                        for (var i = 0; i < command.commandArguments.length; i++) {
                            if ((command.commandArguments[i] === ArgumentsTypes.number || command.commandArguments[i] === ArgumentsTypes.any) && Number(commandArguments[i])) {
                                parsedArguments.push(Number(commandArguments[i]));
                            }
                            else if (command.commandArguments[i] === ArgumentsTypes.string || command.commandArguments[i] === ArgumentsTypes.any) {
                                parsedArguments.push(commandArguments[i]);
                            }
                            else {
                                if (!(this._invalidCommandArgumentsOutput === "")) {
                                    this._client.say(channel, this._invalidCommandArgumentsOutput);
                                }
                                return;
                            }
                        }
                    }
                    else {
                        if (!(this._invalidCommandArgumentsOutput === "")) {
                            this._client.say(channel, this._invalidCommandArgumentsOutput);
                        }
                        return;
                    }
                    var user = new User(userstate);
                    var commandInfo = new CommandInfo(channel, parsedArguments, user);
                    command.executor(this, commandInfo);
                    return;
                }
            }
            ;
            if (this._invalidCommandOutput !== "") {
                this._client.say(channel, this._invalidCommandOutput);
            }
        }
    };
    Bot.prototype.say = function (channel, message, type) {
        if (type === void 0) { type = MessageType.normal; }
        if (MessageType.normal === type) {
            this._client.say(channel, message);
        }
        else {
            this._client.action(channel, message);
        }
    };
    Bot.prototype.clear = function (channel) {
        this._client.clear(channel);
    };
    Bot.prototype.ban = function (channel, name, reason) {
        this._client.ban(channel, name, reason);
    };
    Bot.prototype.unban = function (channel, name) {
        this._client.unban(channel, name);
    };
    Bot.prototype.timeout = function (channel, username, duration, reason) {
        this._client.timeout(channel, username, duration, reason);
    };
    Bot.prototype.emoteOnly = function (channel, state) {
        if (state) {
            this._client.emoteonly(channel);
        }
        else {
            this._client.emoteonlyoff(channel);
        }
    };
    Bot.prototype.followerOnly = function (channel, state, duration) {
        if (state) {
            this._client.followersonly(channel, duration);
        }
        else {
            this._client.followersonlyoff(channel);
        }
    };
    Bot.prototype.host = function (channel, targetChannel) {
        this._client.host(channel, targetChannel);
    };
    Bot.prototype.unhost = function (channel) {
        this._client.unhost(channel);
    };
    Bot.prototype.addChannel = function (channel) {
        this._client.join(channel);
    };
    Bot.prototype.removeChannel = function (channel) {
        this._client.part(channel);
    };
    Bot.prototype.mod = function (channel, username) {
        this._client.mod(channel, username);
    };
    Bot.prototype.unmod = function (channel, username) {
        this._client.unmod(channel, username);
    };
    Bot.prototype.mods = function (channel) {
        return this._client.mods(channel);
    };
    Bot.prototype.ping = function (callback) {
        this._client.ping().then(function (data) {
            callback(data[0]);
        });
    };
    Bot.prototype.slowMode = function (channel, state, seconds) {
        if (state) {
            this._client.slow(channel, seconds);
        }
        else {
            this._client.slowoff(channel);
        }
    };
    Bot.prototype.subscriberOnly = function (channel, state, duration) {
        if (state) {
            this._client.subscribers(channel, duration);
        }
        else {
            this._client.subscribersoff(channel);
        }
    };
    Bot.prototype.vip = function (channel, username) {
        this._client.vip(channel, username);
    };
    Bot.prototype.unvip = function (channel, username) {
        this._client.unvip(channel, username);
    };
    Bot.prototype.vips = function (channel) {
        return this._client.vips(channel);
    };
    Bot.prototype.whisper = function (username, message) {
        this._client.whisper(username, message);
    };
    Bot.prototype.on = function (eventType, callback) {
        this._client.on(eventType, callback);
    };
    Bot.prototype.addBrowserSource = function (browserSource) {
        if (this._io) {
            this._httpServer.get("/test/overlay/index.html", function (req, res) {
                console.log("get");
                res.sendFile(__dirname + browserSource.data.htmlPath);
            });
            this._browserSources.push(browserSource);
        }
        else {
            throw new Error("Cannt add a browser source since there is no server.");
        }
    };
    Bot.prototype.onSocketConnection = function (socket) {
        var _this = this;
        if (this._debug) {
            console.log("New client has connected...");
        }
        socket.on("sign-in", function (data) {
            if (data.type === "browserSource") {
                for (var _i = 0, _a = _this._browserSources; _i < _a.length; _i++) {
                    var browserSource = _a[_i];
                    if (browserSource.name === data.name) {
                        socket.join(browserSource.name);
                    }
                }
            }
        });
    };
    Bot.prototype.send = function (name, messageType, content) {
        if (this._io) {
            if (this._debug) {
                console.log("A " + messageType + " message was sent to " + name + ".");
            }
            this._io.to(name).emit(messageType, content);
        }
        else {
            throw new Error("Cannt send data to a browser source since there is no server.");
        }
    };
    Bot.prototype.onBrowserSource = function (name, eventType, callback) {
        this._io.to(name).on(eventType, callback);
    };
    return Bot;
}());
var MessageType;
(function (MessageType) {
    MessageType[MessageType["normal"] = 0] = "normal";
    MessageType[MessageType["action"] = 1] = "action";
})(MessageType || (MessageType = {}));
var User = /** @class */ (function () {
    function User(userstate) {
        this._name = userstate.username;
        this._displayName = userstate["display-name"];
        this._id = userstate["user-id"];
        this._color = userstate.color;
        this._broadcaster = userstate.broadcaster;
        this._mod = userstate.mod;
        this._subscriber = userstate.subscriber;
    }
    User.prototype.isSubscribed = function () {
        return this._subscriber;
    };
    User.prototype.isMod = function () {
        return this._mod;
    };
    User.prototype.isBroadcaster = function () {
        return this._broadcaster;
    };
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "displayName", {
        get: function () {
            return this._displayName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: false,
        configurable: true
    });
    return User;
}());
var BrowserSource = /** @class */ (function () {
    function BrowserSource(name, browserSourceData) {
        this._name = name;
        this._data = browserSourceData;
    }
    Object.defineProperty(BrowserSource.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserSource.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    return BrowserSource;
}());
var ArgumentsTypes;
(function (ArgumentsTypes) {
    ArgumentsTypes[ArgumentsTypes["number"] = 0] = "number";
    ArgumentsTypes[ArgumentsTypes["string"] = 1] = "string";
    ArgumentsTypes[ArgumentsTypes["any"] = 2] = "any";
})(ArgumentsTypes || (ArgumentsTypes = {}));
var CommandInfo = /** @class */ (function () {
    function CommandInfo(channel, commandArguments, user) {
        this._channel = channel;
        this._commandArguments = commandArguments;
        this._user = user;
    }
    Object.defineProperty(CommandInfo.prototype, "commandArguments", {
        get: function () {
            return this._commandArguments;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommandInfo.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommandInfo.prototype, "user", {
        get: function () {
            return this._user;
        },
        enumerable: false,
        configurable: true
    });
    return CommandInfo;
}());
var Command = /** @class */ (function () {
    function Command(name, commandArguments) {
        if (commandArguments === void 0) { commandArguments = []; }
        this._name = name;
        this._commandArguments = commandArguments;
    }
    Command.prototype.execute = function (bot, commandInfo) {
    };
    Object.defineProperty(Command.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "commandArguments", {
        get: function () {
            return this._commandArguments;
        },
        enumerable: false,
        configurable: true
    });
    return Command;
}());
var SayCommand = /** @class */ (function (_super) {
    __extends(SayCommand, _super);
    function SayCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SayCommand.prototype.execute = function (bot, commandInfo) {
        console.log("executed say command");
        bot.send("say", "say", { message: commandInfo.commandArguments[0] });
    };
    return SayCommand;
}(Command));
/// <reference path="sayCommand.ts" />
require("dotenv").config();
var bot = new Bot({
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_TOKEN,
    channels: ["jumpylion8"],
    debug: true,
    invalidCommandOutput: "",
    server: {}
});
bot.addCommand({
    name: "hello",
    commandArguments: [],
    executor: function (bot, commandInfo) {
        bot.say(commandInfo.channel, "Hello!");
    }
});
bot.addCommand({
    name: "sad",
    commandArguments: [],
    executor: function (bot, commandInfo) {
        bot.say(commandInfo.channel, ":(");
    }
});
bot.addCommand({
    name: "clear",
    commandArguments: [],
    executor: function (bot, commandInfo) {
        if (commandInfo.user.isBroadcaster() || commandInfo.user.isMod()) {
            bot.clear(commandInfo.channel);
        }
        else {
            bot.say(commandInfo.channel, "You dont have the reqiured premisions to performs this command!");
        }
    }
});
bot.addCommand({
    name: "so",
    commandArguments: [ArgumentsTypes.string],
    executor: function (bot, commandInfo) {
        if (commandInfo.user.isBroadcaster() || commandInfo.user.isMod()) {
            bot.say(commandInfo.channel, "Go and check out " + commandInfo.commandArguments[0] + " in https://www.twitch.tv/" + commandInfo.commandArguments[0] + "!", MessageType.action);
        }
        else {
            bot.say(commandInfo.channel, "You dont have the reqiured premisions to performs this command!");
        }
    }
});
bot.addCommand({
    name: "emoteonlychat",
    commandArguments: [ArgumentsTypes.number],
    executor: function (bot, commandInfo) {
        bot.emoteOnly(commandInfo.channel, true);
        setTimeout(function () {
            bot.emoteOnly(commandInfo.channel, false);
        }, commandInfo.commandArguments[0] * 1000);
    }
});
bot.addBrowserSource(new BrowserSource("say", {
    htmlPath: "/test/overlay/index.html"
}));
