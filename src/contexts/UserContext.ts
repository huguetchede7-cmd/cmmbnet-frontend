
import { UserModelTypes } from '@/types/UserModelTypes';
import { createContext, useContext } from 'react';
export const UserContext = createContext<UserModelTypes | null>(null);

export function useUser() {
  return useContext(UserContext);
}