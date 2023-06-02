import Sidebar from '@/components/Sidebar'
import { Conversation, IMessage } from '@/types'
import { generateQueryGetMessages, generateQueryMessages, transformMessage } from '@/utils/getMessagesInConversation'
import { getRecipientEmail } from '@/utils/getRecipientEmail'
import { auth, db } from 'config/firebase'
import { doc, getDoc, getDocs } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar'
import useRecipient from '@/hooks/useRecipient'
const StyledContainer = styled.div`
    display: flex;

`
interface Props {
    conversation: Conversation,
    messags: IMessage[]
}
const StyledChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`
const StyledChatHeader = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 100;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #ccc;
`
const StyledChatHeaderInfo = styled.div``
const StyledChatHeaderIcons = styled.div``

const Conversation = ({ conversation, messages }: Props) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)
    const {recipientEmail,recipient} =useRecipient(conversation.users, loggedInUser)
    
  return (
    <StyledContainer>
        <Head>
            <title>Conversation with
                
               
                     {getRecipientEmail(conversation.users, loggedInUser)}
               
                </title>
        </Head>
        <Sidebar />
        <StyledChatContainer>
            <ConversationScreen 
        </StyledChatContainer>
    </StyledContainer>
  )
}

export default Conversation

export const getServerSideProps: GetServerSideProps<
	Props,
	{ id: string }
> = async context => {
	const conversationId = context.params?.id

	// get conversation, to know who we are chatting with
	const conversationRef = doc(db, 'conversations', conversationId as string)
	const conversationSnapshot = await getDoc(conversationRef)
	

    // get  all messages between logged in user and recipient in this conversation
    const queryMessages = generateQueryGetMessages(conversationId)

	const messagesSnapshot = await getDocs(queryMessages)

	const messages = messagesSnapshot.docs.map(messageDoc =>
		transformMessage(messageDoc)
	)
    console.log(messages)

	return {
		props: {
			conversation: conversationSnapshot.data() as Conversation,
			messages
		}
	}
}