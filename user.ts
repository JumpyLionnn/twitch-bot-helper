class User{
    private _name: string;
    private _displayName: string;
    private _id: number;
    private _color: string;
    private _broadcaster: boolean;
    private _mod: boolean;
    private _subscriber: boolean;
    constructor(userstate: any){
        this._name = userstate.username;
        this._displayName = userstate["display-name"];
        this._id = userstate["user-id"];
        this._color = userstate.color;
        this._broadcaster = userstate.broadcaster;
        this._mod = userstate.mod;
        this._subscriber = userstate.subscriber;
    }

    public isSubscribed(): boolean{
        return this._subscriber;
    }

    public isMod(): boolean{
        return this._mod;
    }

    public isBroadcaster(): boolean{
        return this._broadcaster;
    }

    public get name(): string{
        return this._name;
    }

    public get displayName(): string{
        return this._displayName;
    }

    public get id(): number{
        return this._id;
    }

    public get color(): string{
        return this._color;
    }
}