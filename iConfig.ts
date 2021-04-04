interface botConfig{
    username: string,
    password: string
    channels: string[],
    
    reconnect?: boolean,
    secure?: boolean,
    color?: string,
    debug?: boolean,
    messagesLogLevel?: string
}