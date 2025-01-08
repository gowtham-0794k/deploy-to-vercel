import MainCard from "ui-component/cards/MainCard";
import UploadAvatar from "ui-component/third-party/dropzone/Avatar";
import SubCard from 'ui-component/cards/SubCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import React,{ useState, useEffect, useRef } from 'react';
import AnimateButton from "ui-component/extended/AnimateButton";
import UserDetails from "components/application/chat/UserDetails";
import ChatDrawer from "components/application/chat/ChatDrawer";
import ChatHistory from "components/application/chat/ChatHistory";
import Loader from "ui-component/Loader";
import { dispatch, useSelector } from "store";
import { getUser, getUserChats, insertChat } from "store/slices/chat";
import { gridSpacing, appDrawerWidth as drawerWidth } from "store/constant";



export { MainCard, UploadAvatar,gridSpacing,SubCard,SecondaryAction, useState ,React,AnimateButton,Loader, ChatHistory,ChatDrawer,UserDetails,drawerWidth,insertChat,getUserChats,getUser, useSelector,dispatch, useEffect, useRef};
