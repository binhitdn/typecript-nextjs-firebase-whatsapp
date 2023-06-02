import { CircularProgress } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import WhatsAppLogo from "../../public/whatsapplogo.png"

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
`

const StyleImageWrapper = styled.div`
    margin-bottom: 50px;

`
export default function Loading() {
  return (
    <StyledContainer>
        <StyleImageWrapper>
            <Image src={WhatsAppLogo} alt="WhatsApp Logo" height={200} width={200} />
        </StyleImageWrapper>
        <CircularProgress />
    </StyledContainer>
  )
}
