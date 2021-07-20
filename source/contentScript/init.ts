import { addIdeaMarketContainerToDom, startIdeaMarket } from './ideaMarket'
import checkIfActivatedDomain from '../helpers/checkIfActivatedDomain'
import { checkURLchange, waitForElementToDisplay } from '../helpers/events'

const initOnTwitter = () => {
  waitForElementToDisplay(
    'div[data-testid="tweet"]',
    () => {
      startIdeaMarket()
      // when url is changed in twitter restart
      checkURLchange(window.location.href, startIdeaMarket)
      // when system theme is changed in twitter restart
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () =>
          setTimeout(() => startIdeaMarket(), 3000)
        )
    },
    1000,
    100000
  )
}

const initOnSubstack = () => {
  waitForElementToDisplay(
    '.publications',
    () => {
      startIdeaMarket()
    },
    1000,
    100000
  )
  waitForElementToDisplay(
    '.search-results',
    () => {
      startIdeaMarket()
    },
    1000,
    100000
  )
}

const init = async () => {
  const currentDomain = window.location.host

  const isDomainActivated = await checkIfActivatedDomain(currentDomain)

  if (isDomainActivated) {
    addIdeaMarketContainerToDom()
    // Twitter
    if (currentDomain.includes('twitter.com')) {
      initOnTwitter()
    }
    // Substack
    if (currentDomain.includes('substack.com')) {
      initOnSubstack()
    }
  }
}

export default init
