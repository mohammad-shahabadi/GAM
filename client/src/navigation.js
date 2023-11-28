import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'fa']

export const {Link, redirect, usePathname, useRouter} =
    createSharedPathnamesNavigation({locales});