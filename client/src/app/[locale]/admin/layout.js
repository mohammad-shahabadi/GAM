import MainLayout from "@/components/layout/MainLayout";
import {unstable_setRequestLocale} from "next-intl/server";

export default function Layout({children, params: {locale}}){
    unstable_setRequestLocale(locale);

    return(
        <MainLayout locale={locale}>
            {children}

        </MainLayout>
    )
}