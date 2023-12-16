"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";
import {unstable_setRequestLocale} from "next-intl/server";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Users')

    return (
        <UsersTable t={t}/>
    );
}