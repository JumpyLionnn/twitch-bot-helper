class BrowserSource{
    private _name: string;
    private _data: BrowserSourceData;
    constructor(name: string, browserSourceData: BrowserSourceData){
        this._name = name;
        this._data = browserSourceData;
    }

    public get name(): string{
        return this._name;
    }

    public get data(): BrowserSourceData{
        return this._data;
    }
}