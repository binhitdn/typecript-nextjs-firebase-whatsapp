import { useCollection } from 'react-firebase-hooks/firestore';

import { getRecipientEmail } from '@/utils/getRecipientEmail';
import { auth, db } from 'config/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Conversation, AppUser } from './../types/index';
export const useRecipient = (conversationUsers: Conversation['users']) => {
    //get logged in user
    const [loggedInUser, _loading, _error] = useAuthState(auth)

	// get recipient email
	const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser)
  //get recipient avatar
  const queryGetRecipient = query(
    collection(db, 'users'),
    where('email', '==', recipientEmail)
  )
    const [recipientsSnapshot] = useCollection(queryGetRecipient)

    //recipient snapshot
    const recipient = recipientsSnapshot?.docs?.[0]?.data() as AppUser | undefined
  return {
    recipientEmail,
    recipient
  }
}