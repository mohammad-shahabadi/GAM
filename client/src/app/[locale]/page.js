'use client';

import {useTranslations} from 'next-intl';
import Login from "@/components/login";
import {useContext, useEffect} from "react";
import {AuthContext} from "@/context/AuthContext";
import {useRouter} from "@/navigation";
import {unstable_setRequestLocale} from "next-intl/server";

export default function Index({locale}) {
    unstable_setRequestLocale(locale);

    const t = useTranslations('Login');
    const {
        authenticate, token, isAdmin, isUser, isTeacher,loading
    } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            console.log(token)
            if(isAdmin){
              router.push('/admin')
            }
            if(isTeacher || isAdmin){
              router.push('/user')
            }
        }
    }, [token])
    return <Login loading={loading} authenticate={authenticate} texts={t}/>;
}
