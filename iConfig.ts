interface botConfig{
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
}