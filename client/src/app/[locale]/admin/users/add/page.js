"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";
import AddForm from "@/components/users/add";


export default function Page() {
    const t = useTranslations('Users')

    return (
        <AddForm slug={null} t={t}/>
    );
}