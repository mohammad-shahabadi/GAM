"use client"
import * as React from 'react';
import {useTranslations} from "next-intl";
import AddForm from "@/components/classes/add";
import {unstable_setRequestLocale} from "next-intl/server";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Classes')

    return (
        <AddForm slug={params.slug} t={t}/>
    );
}