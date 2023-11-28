import 'server-only'

const dictionaries = {
    en: () => import('../../assets/texts/en.json').then((module) => module.default),
    fa: () => import('../../assets/texts/fa.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
