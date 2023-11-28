"use client"
import React, {useContext, useEffect, useState} from 'react';

import {AuthContext} from '@/context/AuthContext';
import {usePathname, useRouter} from "@/navigation";
import {BeatLoader} from "react-spinners";


const ACL = ({
                 children,
             }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(true);
    const {isAdmin, isAuthenticated, isUser} = useContext(AuthContext);
    const pathname = usePathname()

    useEffect(() => {
        let tempAuthorized = true
        console.log(pathname, "isAdmin: ", isAdmin, "isUser: ", isUser)
        if (pathname.startsWith('/admin') && !isAdmin) {
            tempAuthorized = false
            router.push('/')
        }
        if (pathname.startsWith('/user') && !isUser) {
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
        setAuthorized(tempAuthorized);

    }, [router, pathname, isAdmin, isUser]);

    return (
        <>
            {authorized ? (
                <>{children}</>
            ) : (
                <div className={"w-full h-screen flex items-center justify-center"}>
                    <BeatLoader color="#36d7b7" />
                </div>
            )}
        </>
    );
};

export default ACL;
