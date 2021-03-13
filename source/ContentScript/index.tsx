import * as React from 'react'
import ReactDOM from 'react-dom'
import Container from '../components/Container'

import { 
  checkURLchange,
  waitForElementToDisplay,
  DetectChangesOnElement, 
  setThemeWithSelection
} from "../helpers/events";

// Twitter Market
let allTweets = document.querySelectorAll('div[data-testid="tweet"]');

interface Listing {
  [key: string]: string
}

interface Listings {
  [key: string]: Listing
}

const listingsData:Listings = {
  '@elonmusk': {
    rank: '1',
    price: '3.067',
    dayChange: '-0.064%',
    market: 'twitter'
  }
}

init();

function init() {
  const currentDomain = window.location.host;
  if(checkIfActivatedDomain(currentDomain)) {
    AddIdeaMarketContainerToDom();
    // Twitter
    if (currentDomain.includes('twitter.com')) {
      StartIdeaMarket();
      // when url is changed in twitter restart
      checkURLchange(window.location.href, StartIdeaMarket);
      // when system theme is changed in twitter restart
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => setTimeout(() => StartIdeaMarket(), 3000));
    }
    // Substack
    if (currentDomain.includes('substack.com')) {
      // console.log(document.querySelectorAll('div[data-testid="tweet"]'));
    }
  }
}

function checkIfActivatedDomain(currentDomain: string) {
  const domainsActivated = ['twitter.com', 'substack.com']
  return domainsActivated.find(element => element.includes(currentDomain));
}

function StartIdeaMarket() {
  setThemeWithSelection();
  startIdeaMarketTwitter();
}

function startIdeaMarketTwitter() {
  waitForElementToDisplay("div[data-testid=\"tweet\"]",() => {
    // Add IdeaMarket to available Tweets
    allTweets = document.querySelectorAll('div[data-testid="tweet"]');
    allTweets.forEach(tweet => {
      const username = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type').textContent;
      AddIdeaMarket(tweet, username);
    });
    
    // Detect changes in tweets
    const targetNode = document.querySelector('div[data-testid="primaryColumn"] section > div > div');
    DetectChangesOnElement(targetNode, function() {
      allTweets = document.querySelectorAll('div[data-testid="tweet"]');
      allTweets.forEach(tweet => {
        const username = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type').textContent;
        AddIdeaMarket(tweet, username);
      });
    })
  }, 1000, 100000)
}

function AddIdeaMarket(tweet: Element, username: string){
  if(!tweet.parentNode.querySelector('.ideamarket-listing')){
    const el = (document.querySelector('#ideamarket-container .ideamarket-listing').cloneNode(true) as HTMLElement);
    el.addEventListener("mouseover", (e) => showAlert(e, username), false);
    if(Object.prototype.hasOwnProperty.call(listingsData,username) && listingsData[username].rank) {
      el.classList.add("listed");
      el.querySelector('.ideamarket-rank').textContent = listingsData[username].rank
    } else {
      el.classList.add("unlisted");
    }
    tweet.querySelector('div[data-testid="caret"]').parentNode.appendChild(el);
  }
}

function showAlert(event: MouseEvent, username: string) {
  const hoverAlert = (document.querySelector('.ideamarket-hover-alert').cloneNode(true) as HTMLElement)
  AddDataInAlertBox(hoverAlert, username);
  hoverAlert.setAttribute('style', `top:${event.clientY - 35}px;left:${event.clientX - 90}px`)
  function removeAlert(hoverAlert: HTMLElement) {
    hoverAlert?.parentNode?.removeChild(hoverAlert);
  }
  hoverAlert.addEventListener("mouseleave", () => removeAlert(hoverAlert), false);
  document.addEventListener("scroll", () => removeAlert(hoverAlert), false)
  document.body.append(hoverAlert);
}

function AddDataInAlertBox(hoverAlert: HTMLElement, username: string) {
  const userdata = listingsData[username]
  if(userdata) {
    hoverAlert.classList.add('listed')
    hoverAlert.querySelector('.ideamarket-listed-rank').textContent = userdata.rank
    hoverAlert.querySelector('.ideamarket-listed-price').textContent = userdata.price
    const dayChangeDiv = hoverAlert.querySelector('.ideamarket-listed-day-change');
    dayChangeDiv.textContent = userdata.dayChange
    if(userdata.dayChange[0] === '-') {
      dayChangeDiv.classList.add('text-brand-red')
      dayChangeDiv.classList.add('dark:text-red-500')
    } else {
      dayChangeDiv.classList.add('text-brand-green')
    }
    (hoverAlert.querySelector('.ideamarket-listed-button').parentNode as Element).setAttribute('href', `https://ideamarket.com/i/${userdata.market}/${username}`)
  } else {
    hoverAlert.classList.add('unlisted')
  }
}

function AddIdeaMarketContainerToDom() {
  const IdeaMarketContainer = document.createElement('div')
  IdeaMarketContainer.setAttribute('id', 'ideamarket-container')
  document.body.append(IdeaMarketContainer)
  ReactDOM.render(<Container />, document.querySelector('#ideamarket-container'))
}

export {}
