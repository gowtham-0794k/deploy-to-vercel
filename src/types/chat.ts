// types
import { UserProfile } from 'types/user-profile';

// ==============================|| TYPES - CHAT ||============================== //

export type History = {
  id?:number;
  from?: string;
  to?: string;
  time?: string;
  text?: string;
  files?: string[];
  file?: string;
};

export interface ChatHistory {
  id?: number;
  from?: string;
  to?: string;
  text?: string;
  time?: string;
  user?:string;
  files?: string[];
  file?: string;
}

export interface ChatStateProps {
  chats: ChatHistory[];
  user: UserProfile;
  users: UserProfile[];
  error: object | string | null;
}
// interface NewMessage {
//   id: number
//   from: string
//   to: string
//   text: string
//   time: string
//   user: UserProfile
// }
export interface Message {
  files: string;
  
}




