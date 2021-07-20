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
