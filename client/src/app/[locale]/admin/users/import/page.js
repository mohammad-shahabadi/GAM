"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";
import AddForm from "@/components/users/add";
import {unstable_setRequestLocale} from "next-intl/server";
import AddFormImport from "@/components/users/import";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Users')

    return (
        <AddFormImport slug={null} t={t}/>
    );
}