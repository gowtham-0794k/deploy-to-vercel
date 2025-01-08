// types

import { UserProfile } from "./user-profile";

// ==============================|| TYPES - CONTACT ||============================== //

export interface ContactStateProps {
  contacts: UserProfile[];
  error: object | string | null;
}
