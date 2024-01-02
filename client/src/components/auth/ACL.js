"use client"
import React, {useContext, useEffect, useState} from 'react';

import {AuthContext} from '@/context/AuthContext';
import {usePathname, useRouter} from "@/navigation";
import {BeatLoader} from "react-spinners";
import Cookies from "js-cookie";


const ACL = ({
                 children,
             }) => {
    const router = useRouter();
    const {isAdmin, isAuthenticated, isUser, isTeacher} = useContext(AuthContext);
    const [authorized, setAuthorized] = useState(isAuthenticated);
    const pathname = usePathname()

    useEffect(() => {
        let tempAuthorized = true
        //console.log(pathname, "isAdmin: ", isAdmin, "isUser: ", isUser,"isTeacher: ", isTeacher)
        //console.log(Cookies.get('gam-authorities'))
        if (pathname.startsWith('/admin') && !isAdmin) {
            tempAuthorized = false
            router.push('/')
        }
        if (pathname.startsWith('/user') && !isUser) {
            tempAuthorized = false
            router.push('/')
        }
        if (pathname.startsWith('/teacher') && !isTeacher) {
            tempAuthorized = false
            router.push('/')
        }
        if (pathname === '/' && isAdmin) {
            tempAuthorized = false
            router.push('/admin')
        }
        if (pathname === '/' && isUser) {
            tempAuthorized = false
            router.push('/user')
        }
        if (pathname === '/' && isTeacher) {
            tempAuthorized = false
            router.push('/teacher')
        }
        setAuthorized(tempAuthorized);

    }, [router, pathname, isAdmin, isUser]);

    return (
        <>
            {authorized ? (
                <>{children}</>
            ) : (
                <div className={"w-full h-screen flex items-center justify-center"}>
                    <BeatLoader color="#ff5733" />
                </div>
            )}
        </>
    );
};

export default ACL;
