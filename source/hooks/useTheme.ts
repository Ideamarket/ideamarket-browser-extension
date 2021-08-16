import { useEffect, useState } from "react"
import { browser } from "webextension-polyfill-ts"
import { startIdeaMarket } from "../contentScript/ideaMarket"
import { getTheme, intialSelectedTheme, setThemeWithSelection, ThemeType } from "../helpers/theme"

export default function useTheme() {
  const [theme, setTheme] = useState(intialSelectedTheme)

  useEffect(() => {
    // This listener updates theme dynamically based on System Default
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initTheme)
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/onChanged
    browser.storage.onChanged.addListener(optionsChanged)

    async function initTheme() {
      const themeResponse = await getTheme()
      setTheme(themeResponse)
    }

    function optionsChanged(changes?: any) {
      const { newValue = ThemeType.Light } = changes?.theme
      setTheme(newValue)
      startIdeaMarket() // Need to rerender after setting new theme
      setThemeWithSelection()
    }

    initTheme()

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', initTheme)
      browser.storage.onChanged.removeListener(optionsChanged)
    }
  }, [])

  return { theme }
}
