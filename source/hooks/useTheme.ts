import { useEffect, useState } from "react"
import { browser } from "webextension-polyfill-ts"
import { intialSelectedTheme } from "../helpers/theme"

export default function useTheme() {
  const [theme, setTheme] = useState(intialSelectedTheme)
  useEffect(() => {
    browser.storage.local.get('theme').then(
      (item) => {
        if (item?.theme) {
          setTheme(item.theme)
        }
      },
      () => {
        console.log('no theme selected')
      }
    )
  }, [])

  return { theme }
}