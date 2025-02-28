// types.ts
export interface Conversation {
    id: string;
    title: string;
    lastMessage?: string;
    isGroup: boolean;
    members: string[];
  }