import * as React from 'react'
import ReactDOM from 'react-dom'

import Container from '../components/Container'

// Twitter Market
if (window.location.host.includes('twitter.com')) {
const IdeaMarketContainer = document.createElement('div')
  IdeaMarketContainer.setAttribute('id', 'ideamarket-container')
  IdeaMarketContainer.style.position = "absolute"; // Another one

  document.body.append(IdeaMarketContainer)
  ReactDOM.render(
    <Container />,
    document.querySelector('#ideamarket-container')
  )
}

// Substack
if (window.location.host.includes('substack.com')) {
  // ReactDOM.render(<Options />, document.body);
  // console.log(document.querySelectorAll('div[data-testid="tweet"]'));
}
