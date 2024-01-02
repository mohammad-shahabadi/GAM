"use client"
import * as React from 'react';
import {useTranslations} from "next-intl";
import ClassDashboard from "@/components/user_panel/classes/dashboard/index";
import {unstable_setRequestLocale} from "next-intl/server";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Classes')

    return (
        <ClassDashboard slug={params.slug} t={t}/>
    );
}