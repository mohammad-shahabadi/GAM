"use client"
import * as React from 'react';
import {useTranslations} from "next-intl";
import AddForm from "@/components/users/add";


export default function Page({params}) {
    const t = useTranslations('Users')

    return (
        <AddForm slug={params.slug} t={t}/>
    );
}