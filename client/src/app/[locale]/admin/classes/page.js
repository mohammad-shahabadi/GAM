"use client"
import Button from "@/components/global/Button";
import {Link} from "@/navigation";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useTranslations} from "next-intl";
import ClassesTable from "@/components/classes";

export default function Page() {
  const t = useTranslations('Classes');
  return (
    <>
      <ClassesTable t={t}/>
    </>
  );
}