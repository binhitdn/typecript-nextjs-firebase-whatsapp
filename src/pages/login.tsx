import Head from "next/head"
import styled from "styled-components"
import Button from "@mui/material/Button"
import Image from "next/image"
import WhatsAppLogo from "../../public/whatsapplogo.png"
import {useSignInWithGoogle} from "react-firebase-hooks/auth"
import {auth} from "../../config/firebase"

const StyledContainer = styled.div`
    display: grid;
    height: 100vh;
    place-items: center;
    background-color: whitesmoke;
`
const StyleLoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`
const StyleImageWrapper = styled.div`
    margin-bottom: 50px;

`



const Login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
    const signIn = () => {
        signInWithGoogle()
    }

    return (
       <StyledContainer>
            <Head>
                <title>Login to WhatsApp</title>
            </Head>
            <StyleLoginContainer>
                <StyleImageWrapper>
                    <Image src={WhatsAppLogo} alt="WhatsApp Logo" height={200} width={200} />
                </StyleImageWrapper>
                <Button variant="outlined"
                onClick={signIn}
                >Sign in with Google</Button>
            </StyleLoginContainer>
       </StyledContainer>
    )
    }
export default Login