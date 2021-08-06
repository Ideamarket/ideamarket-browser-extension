import { browser } from 'webextension-polyfill-ts'

type IdeaMarketThemesValue = {
  value: string
  label: string
}
type IdeaMarketSites = {
  value: string
  label: string
}

export const ideaMarketThemes: IdeaMarketThemesValue[] = [
  { value: 'System Default', label: 'System Default' },
  { value: 'Light', label: 'Default' },
  { value: 'Dim', label: 'Dim' },
  { value: 'Dark', label: 'Dark' },
]
export const ideaMarketSitesActivated: IdeaMarketSites[] = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'substack', label: 'Substack' },
]

export let intialSelectedTheme = 'System Default'
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
  if (!theme || theme === 'System Default') {
    theme = 'Light'
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      theme = 'Dark'
    }
  }

  return theme
}

export async function setThemeWithSelection() {
  const root = document.getElementsByTagName('html')[0]
  const theme = await getTheme()
  if (theme === 'Dark') {
    root.classList.add('dark')
    return
  }
  root.classList.remove('dark')
}
