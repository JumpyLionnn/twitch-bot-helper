class BrowserSource{
    private _name: string;
    constructor(name: string, browserSourceData: BrowserSourceData){
        this._name = name;
    }

    public get name(): string{
        return this._name;
    }
}