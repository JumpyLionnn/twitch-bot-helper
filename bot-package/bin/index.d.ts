declare const tmi: any;
declare const express: any;
declare const http: any;
declare const Server: any;
declare class Bot {
    private _client;
    private _commands;
    private _prefix;
    private _debug;
    private _invalidCommandOutput;
    private _invalidCommandArgumentsOutput;
    private _httpServer;
    private _io;
    private _browserSources;
    constructor(config: botConfig);
    addCommand(command: iCommand): void;
    private messageHandler;
    say(channel: string, message: string, type?: MessageType): void;
    clear(channel: string): void;
    ban(channel: string, name: string, reason?: string): void;
    unban(channel: string, name: string): void;
    timeout(channel: string, username: string, duration?: number, reason?: string): void;
    emoteOnly(channel: string, state: boolean): void;
    followerOnly(channel: string, state: boolean, duration?: number): void;
    host(channel: string, targetChannel: string): void;
    unhost(channel: string): void;
    addChannel(channel: string): void;
    removeChannel(channel: string): void;
    mod(channel: string, username: string): void;
    unmod(channel: string, username: string): void;
    mods(channel: string): string[];
    ping(callback: Function): void;
    slowMode(channel: string, state: boolean, seconds?: number): void;
    subscriberOnly(channel: string, state: boolean, duration?: number): void;
    vip(channel: string, username: string): void;
    unvip(channel: string, username: string): void;
    vips(channel: string): string[];
    whisper(username: string, message: string): void;
    on(eventType: string, callback: Function): void;
    addBrowserSource(browserSource: BrowserSource): void;
    private onSocketConnection;
    send(name: string, messageType: string, content: any): void;
    onBrowserSource(name: string, eventType: string, callback: Function): void;
}
interface botConfig {
    username: string;
    password: string;
    channels: string[];
    reconnect?: boolean;
    secure?: boolean;
    color?: string;
    debug?: boolean;
    messagesLogLevel?: string;
    prefix?: string;
    invalidCommandOutput?: string;
    invalidCommandArgumentsOutput?: string;
    server?: ServerConfig;
}
interface ServerConfig {
    port?: number;
}
declare enum MessageType {
    normal = 0,
    action = 1
}
declare class User {
    private _name;
    private _displayName;
    private _id;
    private _color;
    private _broadcaster;
    private _mod;
    private _subscriber;
    constructor(userstate: any);
    isSubscribed(): boolean;
    isMod(): boolean;
    isBroadcaster(): boolean;
    get name(): string;
    get displayName(): string;
    get id(): number;
    get color(): string;
}
declare class BrowserSource {
    private _name;
    private _data;
    constructor(name: string, browserSourceData: BrowserSourceData);
    get name(): string;
    get data(): BrowserSourceData;
}
interface BrowserSourceData {
    htmlPath: string;
    jsPath?: string[];
    cssPath?: string[];
}
declare enum ArgumentsTypes {
    number = 0,
    string = 1,
    any = 2
}
declare class CommandInfo {
    private _commandArguments;
    private _channel;
    private _user;
    constructor(channel: string, commandArguments: (string | number)[], user: User);
    get commandArguments(): (string | number)[];
    get channel(): string;
    get user(): User;
}
declare abstract class Command {
    private _name;
    private _commandArguments;
    constructor(name: string, commandArguments?: ArgumentsTypes[]);
    execute(bot: Bot, commandInfo: CommandInfo): void;
    get name(): string;
    get commandArguments(): ArgumentsTypes[];
}
interface iCommand {
    name: string;
    commandArguments: ArgumentsTypes[];
    executor: (bot: Bot, commandInfo: CommandInfo) => void;
}
