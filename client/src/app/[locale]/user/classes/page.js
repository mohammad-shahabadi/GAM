"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";
import {unstable_setRequestLocale} from "next-intl/server";
import ClassesTable from "@/components/user_panel/classes/index";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);

    const t = useTranslations('Classes')

    return (
        <ClassesTable t={t}/>
    );
}