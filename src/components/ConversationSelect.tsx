import { Conversation } from '../types'
import React from 'react'
import styled from 'styled-components'
import { useRecipient } from '@/hooks/useRecipient'
import RecipientAvatar from './RecipientAvatar'
import { useRouter } from 'next/router'

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 5px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
    cursor: pointer;
    word-break: break-all;
    :hover {

        background-color: #e9eaeb;
    }
`
export default function ConversationSelect({
    id,conversationUsers
}:{
    id: string,
    conversationUsers: Conversation['users']
}) {
  const {recipientEmail,recipient} =useRecipient(conversationUsers)
  const router = useRouter()
  return (
    <StyledContainer
    onClick={() => {
        router.push(`/conversation/${id}`)
    }
    }
    >
      <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
     <span>
  
    {
          recipientEmail
      }
     </span>
    </StyledContainer>
  )
}
