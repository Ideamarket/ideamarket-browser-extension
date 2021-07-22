import getIdeaMarketData from '../helpers/api'
import { addIdeaMarket } from './ideaMarket'
import { addDataToListingsData } from './utils'

export const startIdeaMarketTwitter = () => {
  // Get Data for tweets on screen

  const addToTweetAndProfile = () => {
    addToTweetsOnScreen()
    addIdeaMarketToProfile()
  }
  getDataForAllTweetsOnScreen(addToTweetAndProfile)
  // Add IdeaMarket to available Tweets
  addToTweetsOnScreen()
}

const usernameXPath =
  'div[data-testid="primaryColumn"] div > div:nth-child(2) > div > div> div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) span'
const followinSectionXPath =
  'div[data-testid="primaryColumn"] div > div:nth-child(2) > div > div> div > div:nth-child(2) > div:nth-child(5)'

const addIdeaMarketToProfile = () => {
  const usernameNode = document.querySelector(usernameXPath)
  const username = usernameNode.textContent.toLowerCase()
  const followingSectionNode = document.querySelector(followinSectionXPath)

  addIdeaMarket(followingSectionNode, username, followingSectionNode, 'twitter')
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

  const usernameNode = document.querySelector(usernameXPath)

  const allUserNames: string[] = []

  if (usernameNode?.textContent.toLowerCase()) {
    allUserNames.push(usernameNode.textContent.toLowerCase())
  }

  allTweets.forEach((tweet) => {
    const username = tweet
      .querySelector(':scope > div:last-of-type a > div > div:last-of-type')
      .textContent.toLowerCase()
    allUserNames.push(username)
  })

  getIdeaMarketData(allUserNames, 'Twitter').then((data: any) => {
    console.log(data, allUserNames)
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
