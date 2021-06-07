/// <reference path="sayCommand.ts" />

require("dotenv").config();

let bot = new Bot({    
    username: process.env.TWITCH_USERNAME as string,
    password: process.env.TWITCH_TOKEN as string,
    channels: ["jumpylion8"],
    debug: true,
    invalidCommandOutput: "",
    server: {
        
    }
});


bot.addCommand({
    name: "hello",
    commandArguments: [],
    executor: (bot: Bot, commandInfo: CommandInfo)=>{
        bot.say(commandInfo.channel, "Hello!");
    }
});

bot.addCommand({
    name: "sad",
    commandArguments: [],
    executor: (bot: Bot, commandInfo: CommandInfo)=>{
        bot.say(commandInfo.channel, ":(");
    }
});

bot.addCommand({
    name: "clear",
    commandArguments: [],
    executor: (bot: Bot, commandInfo: CommandInfo)=>{
        if(commandInfo.user.isBroadcaster() || commandInfo.user.isMod()){
            bot.clear(commandInfo.channel);
        }
        else{
            bot.say(commandInfo.channel, "You dont have the reqiured premisions to performs this command!");
        }
    }
});
bot.addCommand({
    name: "so",
    commandArguments: [ArgumentsTypes.string],
    executor: (bot: Bot, commandInfo: CommandInfo)=>{
        if(commandInfo.user.isBroadcaster() || commandInfo.user.isMod()){
            bot.say(commandInfo.channel, `Go and check out ${commandInfo.commandArguments[0]} in https://www.twitch.tv/${commandInfo.commandArguments[0]}!`, MessageType.action);
        }
        else{
            bot.say(commandInfo.channel, "You dont have the reqiured premisions to performs this command!");
        }
    }
});
bot.addCommand({
    name: "emoteonlychat",
    commandArguments: [ArgumentsTypes.number],
    executor: (bot: Bot, commandInfo: CommandInfo)=>{
        bot.emoteOnly(commandInfo.channel, true);
        setTimeout(()=>{
            bot.emoteOnly(commandInfo.channel, false);
        }, commandInfo.commandArguments[0] as number * 1000);
    }
});


bot.addBrowserSource(new BrowserSource("say", {
    htmlPath: "/test/overlay/index.html"
}));