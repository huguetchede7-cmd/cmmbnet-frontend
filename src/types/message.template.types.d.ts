
declare module 'message-template-type' {

  export interface MessageType {
    id: number;
    label: string;
  }

  export interface MessageList {
    id: number;
    type: number;
    description: string;
  }
}
