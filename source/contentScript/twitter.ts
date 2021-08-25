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
const profilePath =
  'div[data-testid="primaryColumn"] > div > div:nth-child(2) > div > div > div > :nth-child(2)'

const addIdeaMarketToProfile = () => {
  const usernameNode = document.querySelector(usernameXPath)

  if (usernameNode?.textContent.toLowerCase()) {
    const username = usernameNode?.textContent.toLowerCase()
    const profileNode = document.querySelector(profilePath) // Element holding all profile elements
    const profileElements = Array.prototype.slice.call(profileNode.getElementsByTagName('div'))
    
    let followingSectionNode = null

    // Find needed node by using "followers" text. Need to do this because HTML elements change depending on each profile
    profileElements.forEach(ele => {
      if (ele.textContent.toLowerCase().includes('followers')) {
        followingSectionNode = ele.parentNode
      }
    })

    addIdeaMarket(
      followingSectionNode,
      username,
      followingSectionNode,
      'twitter'
    )
  }
}

export const addToTweetsOnScreen = () => {
  const allTweets = document.querySelectorAll('div[data-testid="tweet"]')

  allTweets.forEach((tweet) => {
    const usernameElement = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type')
    if (usernameElement) {
      const username = usernameElement.textContent.toLowerCase()
      addIdeaMarket(
        tweet.querySelector(':scope > div:nth-child(2) > div:nth-child(1)'),
        username,
        tweet.querySelector(':scope > div:nth-child(2) > div:nth-child(1)')
      )
    }
    
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
    const usernameElement = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type')
    if (usernameElement) {
      const username = usernameElement.textContent.toLowerCase()
      allUserNames.push(username)
    }
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
