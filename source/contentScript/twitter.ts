import getIdeaMarketData from '../helpers/api'
import { addDataToListingsData, addIdeaMarket } from './utils'

export const startIdeaMarketTwitter = () => {
  // Get Data for tweets on screen
  getDataForAllTweetsOnScreen(addToTweetsOnScreen)
  // Add IdeaMarket to available Tweets
  addToTweetsOnScreen()
}

export const addToTweetsOnScreen = () => {
  const allTweets = document.querySelectorAll('div[data-testid="tweet"]')

  allTweets.forEach((tweet) => {
    const username = tweet
      .querySelector(':scope > div:last-of-type a > div > div:last-of-type')
      .textContent.toLowerCase()
    addIdeaMarket(
      tweet.parentNode,
      username,
      tweet.querySelector('div[data-testid="caret"]').parentNode
    )
  })
}

const getDataForAllTweetsOnScreen = (onSuccess: { (): void; (): void }) => {
  const allTweets = document.querySelectorAll('div[data-testid="tweet"]')
  const allUserNames: string[] = []

  allTweets.forEach((tweet) => {
    const username = tweet
      .querySelector(':scope > div:last-of-type a > div > div:last-of-type')
      .textContent.toLowerCase()
    allUserNames.push(username)
  })

  getIdeaMarketData(allUserNames, 'Twitter').then((data: any) => {
    if (data?.data?.ideaMarkets[0]?.tokens) {
      const { tokens } = data.data.ideaMarkets[0]
      addDataToListingsData(allUserNames, tokens)
      onSuccess()
    } else {
      // If api error try again after three seconds
      setTimeout(() => {
        getDataForAllTweetsOnScreen(onSuccess)
      }, 3000)
    }
  })
}
