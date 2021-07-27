import { browser, Tabs } from 'webextension-polyfill-ts'

const openWebPage = (url: string): Promise<Tabs.Tab> => {
  return browser.tabs.create({ url })
}

export default openWebPage
