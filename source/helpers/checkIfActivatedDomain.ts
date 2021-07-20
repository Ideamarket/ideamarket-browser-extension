import { browser } from 'webextension-polyfill-ts'

async function checkIfActivatedDomain(currentDomain: string) {
  let sitesActivated = { twitter: true, substack: true }
  const item = await browser.storage.local.get('sitesActivated')
  if (item?.sitesActivated) {
    sitesActivated = JSON.parse(item.sitesActivated)
  }
  const siteFound = Object.keys(sitesActivated).find((element) =>
    currentDomain.includes(element)
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return sitesActivated[siteFound]
}

export default checkIfActivatedDomain
