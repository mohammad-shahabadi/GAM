"use client"
import * as React from 'react';
import {useTranslations} from "next-intl";
import AddForm from "@/components/users/add";
import {unstable_setRequestLocale} from "next-intl/server";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Users')

    return (
        <AddForm slug={params.slug} t={t}/>
    );
}