import { useRecipient } from '@/hooks/useRecipient'
import { Avatar } from '@mui/material'
import React from 'react'
type Props = ReturnType<typeof useRecipient>

export default function RecipientAvatar({
    recipient,recipientEmail
}:Props) {
    return recipient?.photoURL ? 
    <Avatar src={recipient?.photoURL} /> :
    <Avatar>{recipientEmail[0]}</Avatar>
}