import { fetchedTokens, fetchedUserNames } from '.'
import getIdeaMarketData from '../helpers/api'
import { addIdeaMarket } from './ideaMarket'
import { addDataToListingsData, difference, unique } from './utils'

export const startIdeaMarketTwitter = () => {
  // Get Data for tweets on screen

  const addToTweetAndProfile = () => {
    addToTweetsOnScreen()
    addIdeaMarketToProfile()
  }

  getDataForAllTweetsOnScreen(addToTweetAndProfile)
  addToTweetAndProfile()
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
    const profileElements = Array.prototype.slice.call(
      profileNode.getElementsByTagName('div')
    )

    let followingSectionNode = null

    // Find needed node by using "followers" text. Need to do this because HTML elements change depending on each profile
    profileElements.forEach((ele) => {
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
  const allTweets = document.querySelectorAll('article[data-testid="tweet"]')

  allTweets.forEach((tweet) => {
    const usernameElement = tweet.querySelector(
      ':scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) >div:nth-child(1) > a > div > div:nth-child(2)'
    )
    if (usernameElement) {
      const username = usernameElement.textContent.toLowerCase()
      const divToRightOfProfileImagePath = ':scope > div > div > div > div:nth-child(2) > div:nth-child(2)'
      addIdeaMarket(
        tweet.querySelector(divToRightOfProfileImagePath),
        username,
        tweet.querySelector(divToRightOfProfileImagePath)
      )
    }
  })
}

const getDataForAllTweetsOnScreen = (onSuccess: { (): void; (): void }) => {
  const allTweets = document.querySelectorAll('article[data-testid="tweet"]')

  const usernameNode = document.querySelector(usernameXPath)

  const allUserNames: string[] = []

  if (usernameNode?.textContent.toLowerCase()) {
    allUserNames.push(usernameNode.textContent.toLowerCase())
  }

  allTweets.forEach((tweet) => {
    const usernameElement = tweet.querySelector(
      ':scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) >div:nth-child(1) > a > div > div:nth-child(2)'
    )
    if (usernameElement) {
      const username = usernameElement.textContent.toLowerCase()
      allUserNames.push(username)
    }
  })

  const uniqueUsernames = unique(allUserNames)
  const theDifference = difference(uniqueUsernames, fetchedUserNames)

  fetchedUserNames.push(...theDifference)

  if (theDifference.length > 0) {
    getIdeaMarketData(theDifference, 'Twitter').then((data: any) => {
      if (data?.data?.ideaMarkets[0]?.tokens) {
        const { tokens } = data.data.ideaMarkets[0]
        fetchedTokens.push(...tokens)
        addDataToListingsData(fetchedUserNames, fetchedTokens)

        onSuccess()
      } else {
        // If api error try again after three seconds
        setTimeout(() => {
          getDataForAllTweetsOnScreen(onSuccess)
        }, 3000)
      }
    })
  }
}
