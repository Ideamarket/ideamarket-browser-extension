import * as React from 'react'
import ReactDOM from 'react-dom'
import Container from '../components/Container'
import {
  waitForElementToDisplay,
  detectChangesInColoumn,
} from '../helpers/events'
import { startIdeaMarketTwitter } from './twitter'
import { startIdeaMarketSubStack } from './substack'
import { setThemeWithSelection } from '../helpers/theme'
import { listingsData } from '.'
import { onMouseEnter, onMouseLeave } from './utils'

export function addIdeaMarketContainerToDom() {
  const IdeaMarketContainer = document.createElement('div')
  IdeaMarketContainer.setAttribute('id', 'ideamarket-container')
  document.body.append(IdeaMarketContainer)
  ReactDOM.render(
    <Container />,
    document.querySelector('#ideamarket-container')
  )
}

export function startIdeaMarket() {
  const currentDomain = window.location.host
  // Set theme according to selection
  setThemeWithSelection()

  if (currentDomain.includes('twitter.com')) {
    waitForElementToDisplay(
      'div[data-testid="tweet"]',
      () => {
        startIdeaMarketTwitter()
        // If there are changes in tweets, restart
        detectChangesInColoumn(
          document.querySelector(
            'div[data-testid="primaryColumn"] section > div > div'
          ),
          startIdeaMarketTwitter
        )
      },
      1000,
      100000
    )
  }

  if (currentDomain.includes('substack.com')) {
    startIdeaMarketSubStack()
    // If there are changes in publications, restart
    if (!document.querySelector('.discover-page .items')) {
      detectChangesInColoumn(
        document.querySelector('.publications'),
        startIdeaMarketSubStack
      )
    } else {
      detectChangesInColoumn(
        document.querySelector('.discover-page .items'),
        startIdeaMarketSubStack
      )
    }
  }
}

export function addIdeaMarket(
  tweet: Node & ParentNode,
  username: string,
  target: Node & ParentNode,
  profileType?: string
) {
  const el = document
    .querySelector('#ideamarket-container .ideamarket-listing')
    .cloneNode(true) as HTMLElement

  if (
    Object.prototype.hasOwnProperty.call(listingsData, username) &&
    listingsData[username]?.rank
  ) {
    if (profileType === 'twitter') {
      el.classList.add('ideamarket-profile-twitter')
    }

    if (profileType === 'substack') {
      el.classList.add('ideamarket-profile-substack')
    }
    el.classList.add('ideamarket-listed')

    el.querySelector(
      '.ideamarket-price'
    ).textContent = `$${listingsData[username].price}`
    el.addEventListener('mouseenter', (e) => onMouseEnter(e, username), false)
    el.addEventListener('mouseleave', () => onMouseLeave(username), false)
  } else if (listingsData[username]?.notList) {
    if (profileType === 'twitter') {
      el.classList.add('ideamarket-profile-twitter')
    }

    if (profileType === 'substack') {
      el.classList.add('ideamarket-profile-substack')
    }

    el.classList.add('ideamarket-unlisted')
    el.addEventListener('mouseenter', (e) => onMouseEnter(e, username), false)
    el.addEventListener('mouseleave', () => onMouseLeave(username), false)
  } else {
    el.classList.add('ideamarket-loading')
  }
  if (tweet?.querySelector('.ideamarket-listing')) {
    tweet.querySelector('.ideamarket-listing').replaceWith(el)
  } else {
    target.appendChild(el)
  }
}
