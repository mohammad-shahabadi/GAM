"use client"
import * as React from 'react';
import {useTranslations} from "next-intl";
import ClassDashboard from "@/components/classes/dashboard";
import {unstable_setRequestLocale} from "next-intl/server";
import HWDashboard from "@/components/user_panel/classes/dashboard/homework/HWDashboard";
import Submissions from "@/components/submissions/Submissions";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Classes')

    return (
        <Submissions hw_id={params.hw_id} isFinal={true} t={t}/>
    );
}