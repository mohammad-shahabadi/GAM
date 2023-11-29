import {NextIntlClientProvider, useMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import "../../styles/globals.css"
import ToastProvider from "@/providers/toast.provider";
import AuthProvider from "@/context/AuthContext";
import ACL from "@/components/auth/ACL";
import "react-toastify/dist/ReactToastify.css"; //add this line


export function generateStaticParams() {
    return [{locale: 'en'}, {locale: 'fa'}];
}
const locales = ['en', 'fa'];

export default  function LocaleLayout({children, params: {locale}}) {
    if (!locales.includes(locale)) notFound();
    const messages = useMessages();


    return (<html suppressHydrationWarning dir={locale?.startsWith('fa') ? 'rtl' : 'ltr'} lang={locale}>
    <body>
    <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider>
            <ACL>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </ACL>
        </AuthProvider>
    </NextIntlClientProvider>
    </body>
    </html>);
}
