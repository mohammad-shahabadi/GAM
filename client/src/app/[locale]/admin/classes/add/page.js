"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import ClassesTable from "@/components/classes";
import AddForm from "@/components/classes/add";


export default function Page() {
    const t = useTranslations('Classes')

    return (
        <AddForm slug={null} t={t}/>
    );
}