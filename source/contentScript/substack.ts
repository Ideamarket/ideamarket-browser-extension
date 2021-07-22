import getIdeaMarketData from '../helpers/api'
import { addIdeaMarket } from './ideaMarket'
import { addDataToListingsData } from './utils'

const getSubstackUsernameFromUrl = () =>
  window.location.host.split('.')[0]?.replace(/^https?:\/\//, '')

const onCallback = () => {
  const username = getSubstackUsernameFromUrl()
  addIdeaMarket(
    document.querySelector('.headline'),
    username,
    document.querySelector('.headline'),
    'substack'
  )
}

export function startIdeaMarketSubStack() {
  // Get Data for tweets on screen
  getDataForAllPublicationsOnScreen(onCallback)
  // Add IdeaMarket to available Tweets
  addToSubstacksOnScreen()
}

function addToSubstacksOnScreen() {
  const allpublications = document.querySelectorAll(
    '.publications a.publication, .search-results .item'
  )

  allpublications.forEach((publication) => {
    const username = (
      publication
        .getAttribute('href')
        ?.split('.')[0]
        ?.replace(/^https?:\/\//, '') ||
      publication
        .querySelector('.title a')
        .getAttribute('href')
        .split('.')[0]
        .replace(/^https?:\/\//, '')
    ).toLowerCase()
    addIdeaMarket(
      publication,
      username,
      publication.querySelector('.publication-content') || publication
    )
  })
}

const getDataForAllPublicationsOnScreen = (onSuccess: {
  (): void
  (): void
}) => {
  const allPublications = document.querySelectorAll(
    '.publications a.publication, .search-results .item'
  )
  const username = getSubstackUsernameFromUrl()

  const allUserNames: string[] = []
  allUserNames.push(username)
  allPublications.forEach((publication) => {
    const username = (
      publication
        .getAttribute('href')
        ?.split('.')[0]
        ?.replace(/^https?:\/\//, '') ||
      publication
        .querySelector('.title a')
        .getAttribute('href')
        .split('.')[0]
        .replace(/^https?:\/\//, '')
    ).toLowerCase()
    allUserNames.push(username)
  })

  getIdeaMarketData(allUserNames, 'Substack').then((data: any) => {
    console.log(allUserNames, data)
    if (data?.data?.ideaMarkets[0]?.tokens) {
      const { tokens } = data.data.ideaMarkets[0]
      addDataToListingsData(allUserNames, tokens)
      onSuccess()
    } else {
      // If api error try again
      getDataForAllPublicationsOnScreen(onSuccess)
    }
  })
}
