import { Button, IconButton, TextField } from "@mui/material";
import  Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVerticalIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth, db } from "config/firebase";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import * as EmailValidator from 'email-validator'
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "@/types";
import ConversationSelect from "./ConversationSelect";
import AddIcon from '@mui/icons-material/Add'
const StyledContainer = styled.div`
    
    height: 100vh;
    min-width: 200px;
    max-width: 275px;
    border-right: 1px solid #b2b4ba;
    padding-left: 10px;
    padding-right: 10px;   

    align-items: center;
    justify-content: space-between;
    overflow-y: scroll;


   
`
const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    
    border-bottom: 1px solid #b5b6b7;
    position: sticky;
    top: 0;
    
    z-index: 1;
`
const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
    color: gray;
    
    
   
    `
const StyledSidebarButton = styled.button`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    
    border-radius: 10px;
    
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border: none;
    
`
const StyledUserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`
const StyledSearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    background-color: transparent;
    color: white;
    margin-left: 5px;
`



const Sidebar = () => {
    const [loggedInUser, _loading] = useAuthState(auth);
    const [isOpenNewConversation, setOpenNewConversation] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");

    const toggleNewConversationDialog = () => {
        setOpenNewConversation(!isOpenNewConversation);
        if(!isOpenNewConversation) {
            setRecipientEmail("");
        }
    }
    const closeNewConversationDialog = () => {
        setOpenNewConversation(false);
        setRecipientEmail("");
    }
    const createConversation =  async() => {
        if (!recipientEmail) return;

        
        const isInvitingSelf = recipientEmail === loggedInUser?.email;
        if(!EmailValidator.validate(recipientEmail) || isInvitingSelf) {
            alert("Please enter a valid email address");
            return;
        }
        if(isConversationAlreadyExists(recipientEmail)) {
            alert("Conversation already exists");
            return;
        }
        await addDoc(collection(db, "conversations"), {
            users: [loggedInUser?.email, recipientEmail],
        });
        closeNewConversationDialog();
        alert("Conversation created");
        
    }


    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    }
    const queryGetConversationsForCurrentUser = query(
        collection(db, "conversations"),
        where("users", "array-contains", loggedInUser?.email),
    )
    const [conversationsSnapshot] = useCollection(queryGetConversationsForCurrentUser);
    
    const isConversationAlreadyExists = (recipientEmail: string) => {
        return !!conversationsSnapshot?.docs.find(
            (conversation) => 
                conversation.data().users.find((user: string) => user === recipientEmail)?.length > 0
        )    
    }
    

  return (
    <StyledContainer>
        <StyledHeader>
            <Tooltip title={
                loggedInUser?.email as string
            } placement="right">
                <StyledUserAvatar 
                src={loggedInUser?.photoURL || ''}
                />
            </Tooltip>
           <div>
                <IconButton>
                    <ChatIcon />
                </IconButton>
                <IconButton>
                    <MoreVerticalIcon />
                </IconButton>
                <IconButton>
                    <LogoutIcon 
                    onClick={logout}
                    />
                </IconButton>
            </div>   
           
        </StyledHeader>
        <StyledSearch>
            <SearchIcon />
            <StyledSearchInput placeholder="Search in chats" />
        </StyledSearch>
        <StyledSidebarButton
        onClick={
            () => {
                setOpenNewConversation(true);
            }
        }
        >
            <AddIcon />
            Start a new conversation
        </StyledSidebarButton>
        
        {
            /* List of chats */
        }
        {
            conversationsSnapshot?.docs.map((conversation) => (
               <ConversationSelect key={conversation.id} id={conversation.id} 
               
                conversationUsers={(conversation.data() as Conversation).users}
                />
            ))
        }


        <Dialog open={isOpenNewConversation} onClose={
            toggleNewConversationDialog
        }>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address for the user you wish to chat with.
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={
            closeNewConversationDialog

      }
          

          >Cancel</Button>
          
          <Button 
          onClick={
            createConversation
       }
       disabled={!recipientEmail}
          >Create</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  )
}

export default Sidebar




