"use client"
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";
import AdminDashboard from "@/components/dashboard/admin";
import {useTranslations} from "next-intl";
import {unstable_setRequestLocale} from "next-intl/server";

export default function Page({params}) {
    const {
        signOut
    } = useContext(AuthContext)
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Dashboard');

    return (<AdminDashboard texts={t} onLogout={signOut} user={{
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
    }}/>)
}
