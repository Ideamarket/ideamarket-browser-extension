import { browser } from 'webextension-polyfill-ts'

type IdeaMarketThemesValue = {
  value: string
  label: string
}

export const ideaMarketThemes: IdeaMarketThemesValue[] = [
  { value: 'System Default', label: 'System Default' },
  { value: 'Light', label: 'Light' },
  { value: 'Dark', label: 'Dark' },
]

export let intialSelectedTheme = 'System Default'
export let intialSitesActivated = { twitter: true, substack: true }

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

export function setThemeWithSelection() {
  const root = document.getElementsByTagName('html')[0]
  browser.storage.local.get('theme').then(
    (item) => {
      let { theme } = item
      if (theme === 'System Default') {
        theme = 'Light'
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          theme = 'Dark'
        }
      }
      if (theme === 'Dark') {
        root.classList.add('dark')
        return
      }
      root.classList.remove('dark')
    },
    () => {
      // console.log('no theme selected')
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        root.classList.add('dark')
        return
      }
      root.classList.remove('dark')
    }
  )
}
