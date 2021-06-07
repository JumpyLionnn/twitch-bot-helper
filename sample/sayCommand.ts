class SayCommand extends Command{
    public execute(bot: Bot, commandInfo: CommandInfo){
        console.log("executed say command");
        bot.send("say", "say", {message: commandInfo.commandArguments[0]});
    }
}