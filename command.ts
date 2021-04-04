abstract class Command{
    private _name: string;
    private _argumentsNumber: number;
    constructor(name: string, argumentsNumber: number = 0){
        this._name = name;
        this._argumentsNumber = argumentsNumber;
    }


    public execute(commandInfo: CommandInfo){

    }


    public get name(): string{
        return this._name;
    }

    public get argumentsNumber(): number{
        return this._argumentsNumber;
    }
}