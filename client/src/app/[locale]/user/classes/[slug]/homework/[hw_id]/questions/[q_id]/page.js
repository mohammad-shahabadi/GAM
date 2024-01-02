"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import UsersTable from "@/components/users";
import AddForm from "@/components/classes/add";
import {unstable_setRequestLocale} from "next-intl/server";
import AddHW from "@/components/classes/dashboard/homework/AddHW";
import AddQ from "@/components/classes/dashboard/homework/questions/AddQ";
import QuestionsPage from "@/components/user_panel/classes/dashboard/homework/questions/QuestionsPage";


export default function Page({params}) {
    unstable_setRequestLocale(params.locale);
    const t = useTranslations('Classes')

    return (
        <QuestionsPage classSlug={params.slug} hwSlug={params.hw_id} qSlug={params.q_id} t={t}/>
    );
}