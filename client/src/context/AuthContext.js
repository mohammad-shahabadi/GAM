"use client"

import React, {useEffect} from 'react';
import Cookies from 'js-cookie';
import {useRouter} from "@/navigation";
import {useRequest} from "@/hooks/useRequest";
import {LOGIN} from "@/apiList";
import {createTheme, ThemeProvider} from "@mui/material";


const theme = createTheme({
    typography: {
        fontFamily: 'inherit',
    }
})
export const AuthContext = React.createContext({});

const isValidToken = () => {
    const token = Cookies.get('gam-token');
    return !!token;
};
const isValidAdmin = () => {
    const token = Cookies.get('gam-authorities');
    return !!(token && token.indexOf('admin') > -1);
};
const isValidTeacher = () => {
    const token = Cookies.get('gam-authorities');
    return !!(token && token.indexOf('teacher') > -1);
};
const isValidUser = () => {
    const token = Cookies.get('gam-authorities');
    return !!(token && token.indexOf('student') > -1);
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

    useEffect(() => {
        makeAdmin(isValidAdmin())
        makeTeacher(isValidTeacher())
        makeUser(isValidUser())
    }, [token])
    const [loginReq, loginLoader] = useRequest(LOGIN, "POST");

    async function authenticate({stdNum, password}) {
        setLoading(true)
        loginReq({email: stdNum, password}, null).then((res) => {
            setToken(res.token)
            Cookies.set('gam-token', res.token, {expires: 1})
            Cookies.set('gam-authorities', res.role, {expires: 1})
            console.log(res)
        }).finally(() => {
            setLoading(false)
        })
        // setToken(1)
        // Cookies.set('gam-token', 1, {expires: 1})
        // Cookies.set('gam-authorities', 'admin', {expires: 1})
    }


    function signOut() {
        Cookies.remove('gam-token');
        Cookies.remove('gam-authorities');
        makeAuthenticated(false);
        setToken(null);
        setProfile(null);
        router.push('/')
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
            <ThemeProvider theme={theme}>

                {children}
            </ThemeProvider>

        </AuthContext.Provider>
    );
};

export default AuthProvider;
