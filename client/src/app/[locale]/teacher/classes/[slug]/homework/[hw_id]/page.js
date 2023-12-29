"use client"
import * as React from 'react';
import {useTranslations} from "next-intl";
import ClassDashboard from "@/components/classes/dashboard";
import {unstable_setRequestLocale} from "next-intl/server";
import HWDashboard from "@/components/classes/dashboard/homework/HWDashboard";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Classes')

    return (
        <HWDashboard slug={params.hw_id} t={t}/>
    );
}