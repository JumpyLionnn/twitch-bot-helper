abstract class Command{
    private _name: string;
    private _commandArguments: ArgumentsTypes[];
    constructor(name: string, commandArguments: ArgumentsTypes[] = []){
        this._name = name;
        this._commandArguments = commandArguments;
    }


    public execute(bot: Bot, commandInfo: CommandInfo){

    }


    public get name(): string{
        return this._name;
    }

    public get commandArguments(): ArgumentsTypes[]{
        return this._commandArguments;
    }
}

interface iCommand{
    name: string;
    commandArguments: ArgumentsTypes[];
    executor: (bot: Bot, commandInfo: CommandInfo)=>void;
}