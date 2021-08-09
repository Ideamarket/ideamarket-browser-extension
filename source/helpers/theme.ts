import { browser } from 'webextension-polyfill-ts'

type IdeaMarketThemesValue = {
  value: string
  label: string
}
type IdeaMarketSites = {
  value: string
  label: string
}

export const ThemeType = {
  SystemDefault: 'System Default',
  Light: 'Light',
  Dim: 'Dim',
  Dark: 'Dark',
}

export const ideaMarketThemes: IdeaMarketThemesValue[] = [
  { value: ThemeType.SystemDefault, label: 'System Default' },
  { value: ThemeType.Light, label: 'Default' },
  { value: ThemeType.Dim, label: 'Dim' },
  { value: ThemeType.Dark, label: 'Dark' },
]
export const ideaMarketSitesActivated: IdeaMarketSites[] = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'substack', label: 'Substack' },
]

export let intialSelectedTheme = ThemeType.SystemDefault
export let intialSitesActivated: { [name: string]: boolean } = { twitter: true, substack: true }

browser.storage.local.get('theme').then(
  (item) => {
    if (item?.theme) {
      intialSelectedTheme = item.theme
    }
  },
  () => {
    console.log('no theme selected')
  }
)

browser.storage.local.get('sitesActivated').then(
  (item) => {
    if (item?.sitesActivated) {
      intialSitesActivated = JSON.parse(item.sitesActivated)
    }
  },
  () => {
    console.log('no theme selected')
  }
)

export async function getTheme() {
  const response = await browser.storage.local.get('theme')
  let { theme } = response
  if (!theme || theme === ThemeType.SystemDefault) {
    theme = ThemeType.Light
    if (window?.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = ThemeType.Dark
    }
  }

  return theme
}

export async function setThemeWithSelection() {
  const root = document.getElementsByTagName('html')[0]
  const theme = await getTheme()
  if (theme === ThemeType.Dark) {
    root.classList.add('dark')
    return
  }
  root.classList.remove('dark')
}
