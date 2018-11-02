declare interface IDiwugCommandActionCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'DiwugCommandActionCommandSetStrings' {
  const strings: IDiwugCommandActionCommandSetStrings;
  export = strings;
}
