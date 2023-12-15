import MainLayout from "@/components/layout/MainLayout";

export default function Layout({children, params: {locale}}){
    return(
        <MainLayout locale={locale}>
            {children}

        </MainLayout>
    )
}