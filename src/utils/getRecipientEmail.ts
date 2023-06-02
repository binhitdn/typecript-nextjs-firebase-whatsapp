import { Conversation } from "@/types"
import { User } from "firebase/auth"

export const getRecipientEmail = 
(conversations: Conversation['users'], userLoggedIn: User) => {
  return conversations?.filter((userToFilter) => userToFilter !== userLoggedIn.email)[0]
}

