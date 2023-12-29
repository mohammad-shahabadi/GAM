"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";
import AddForm from "@/components/classes/add";
import {unstable_setRequestLocale} from "next-intl/server";
import AddHW from "@/components/classes/dashboard/homework/AddHW";
import AddQ from "@/components/classes/dashboard/homework/questions/AddQ";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);
    const t = useTranslations('Classes')

    return (
        <AddQ classSlug={params.slug} slug={params.hw_id} id={params.id} t={t}/>
    );
}