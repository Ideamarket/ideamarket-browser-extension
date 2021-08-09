import { useEffect, useState } from "react"
import { getTheme, intialSelectedTheme } from "../helpers/theme"

export default function useTheme() {
  const [theme, setTheme] = useState(intialSelectedTheme)

  useEffect(() => {
    // This listener updates theme dynamically based on System Default
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initTheme)

    async function initTheme() {
      const themeResponse = await getTheme()
      setTheme(themeResponse)
    }

    initTheme()

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', initTheme)
    }
  }, [])

  return { theme }
}
