"use client"
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import AdminDashboard from "@/components/dashboard/admin";
import {useTranslations} from "next-intl";
import {unstable_setRequestLocale} from "next-intl/server";
import {useRequest} from "@/hooks/useRequest";
import {GET_ALL_USERS, GET_ME} from "@/apiList";

export default function Page({params}) {
    const {
        signOut
    } = useContext(AuthContext)
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Dashboard');
    const [user,setUser] = useState({})
    const [getMeReq, getMeLoader] = useRequest(GET_ME, "GET");
    const getUsers = ()=>{
        getMeReq().then((res) => {
            setUser(res)
        })
    }
    useEffect(() => {
        getUsers()
    }, [])
    return (<AdminDashboard texts={t} onLogout={signOut} user={user}/>)
}
