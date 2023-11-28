"use client"

import React, {useEffect} from 'react';
import Cookies from 'js-cookie';
import {useRouter} from "@/navigation";
import {useRequest} from "@/hooks/useRequest";
import {LOGIN} from "@/apiList";



export const AuthContext = React.createContext({});

const isValidToken = () => {
    const token = Cookies.get('gam-token');
    return !!token;
};
const isValidAdmin = () => {
    const token = Cookies.get('gam-authorities');
    return !!(token && token === "admin");
};
const isValidTeacher = () => {
    const token = Cookies.get('gam-authorities');
    return !!(token && token === "teacher");
};
const isValidUser = () => {
    const token = Cookies.get('gam-authorities');
    return !!(token && token === "user");
};

const AuthProvider = ({children}) => {
    const [isAuthenticated, makeAuthenticated] = React.useState(isValidToken());
    const [isAdmin, makeAdmin] = React.useState(isValidAdmin());
    const [isTeacher, makeTeacher] = React.useState(isValidTeacher());
    const [isUser, makeUser] = React.useState(isValidUser());
    const [token, setToken] = React.useState(Cookies.get('gam-token'));
    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    useEffect(()=>{
        makeAdmin(isValidAdmin())
        makeTeacher(isValidAdmin())
        makeUser(isValidUser())
    },[token])
    const [loginReq, loginLoader] = useRequest(LOGIN, "POST");

    async function authenticate({stdNum, password}) {
        // setLoading(true)
        // loginReq({email:stdNum,password},null).then((res)=>{
        //     console.log(res)
        // }).catch((e)=>{
        //     console.log(e)
        // }).finally(()=>{
        //     setLoading(false)
        // })
        if(stdNum == "1"){
            makeAdmin(true)
            Cookies.set('gam-token',1,{expires: 1})
            Cookies.set('gam-authorities','admin',{expires: 1})
            router.push('/admin')
        }else if(stdNum == "2") {
            makeTeacher(true)
            Cookies.set('gam-token',1,{expires: 1})
            Cookies.set('gam-authorities','user',{expires: 1})
            router.push('/user')
        } else {
            Cookies.set('gam-token',1,{expires: 1})
            Cookies.set('gam-authorities','user',{expires: 1})
            makeUser(true)
            router.push('/user')
        }
    }



    function signOut() {
        Cookies.remove('gam-token');
        Cookies.remove('gam-authorities');
        makeAuthenticated(false);
        setToken(null);
        setProfile(null);
    }

    const value = {
        isAuthenticated,
        isAdmin,
        isTeacher,
        isUser,
        authenticate,
        signOut,
        token,
        profile,
        loading
    };
    return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
    );
};

export default AuthProvider;
