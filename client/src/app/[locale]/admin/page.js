"use client"
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";
import AdminDashboard from "@/components/dashboard/admin";
import {useTranslations} from "next-intl";

export default function Page() {
    const {
        signOut
    } = useContext(AuthContext)
    const t = useTranslations('Dashboard');

    return (<AdminDashboard texts={t} onLogout={signOut} user={{
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
    }}/>)
}
