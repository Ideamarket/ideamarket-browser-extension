import getIdeaMarketData from '../helpers/api'
import { addDataToListingsData, addIdeaMarket } from './utils'

export function startIdeaMarketSubStack() {
  // Get Data for tweets on screen
  getDataForAllPublicationsOnScreen(addToSubstacksOnScreen)
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
  const allUserNames: string[] = []
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
