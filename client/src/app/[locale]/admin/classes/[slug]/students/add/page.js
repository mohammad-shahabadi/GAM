"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";
import AddForm from "@/components/classes/add";
import {unstable_setRequestLocale} from "next-intl/server";
import AddHW from "@/components/classes/dashboard/homework/AddHW";
import AddStudent from "@/components/classes/dashboard/students/AddStudent";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);
    const t = useTranslations('Classes')

    return (
        <AddStudent slug={params.slug} t={t}/>
    );
}