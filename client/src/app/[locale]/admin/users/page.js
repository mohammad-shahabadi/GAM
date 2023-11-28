"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";


export default function Page() {
    const t = useTranslations('Users')

    return (
        <UsersTable t={t}/>
    );
}