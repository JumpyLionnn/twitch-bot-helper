class CommandInfo{
    private _commandArguments: string[];
    private _channel: string;

    private _user: User;

    public constructor(channel: string, commandArguments: string[], user: User){
        this._channel = channel;
        this._commandArguments = commandArguments;
        this._user = user;
    }


    public get commandArguments(): string[]{
        return this._commandArguments;
    }

    public get channel(): string{
        return this._channel;
    }

    public get user(): User{
        return this._user;
    }



}