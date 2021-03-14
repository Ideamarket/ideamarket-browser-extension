import * as React from 'react'
import ReactDOM from 'react-dom'
import Container from '../components/Container'

import { 
  checkURLchange,
  waitForElementToDisplay,
  DetectChangesOnElement, 
  setThemeWithSelection
} from "../helpers/events";
import getIdeaMarketData from "../helpers/api"

// Twitter Market
let allTweets = document.querySelectorAll('div[data-testid="tweet"]');

interface Listing {
  [key: string]: string
}

interface Listings {
  [key: string]: Listing
}

const listingsData:Listings = {
  // '@elonmusk': {
  //   rank: '1',
  //   price: '3.067',
  //   dayChange: '-0.064%',
  //   market: 'twitter'
  // },
  // '@vivvchy': {
  //   notList: 'true'
  // }
}

init();

function init() {
  const currentDomain = window.location.host;
  if(checkIfActivatedDomain(currentDomain)) {
    AddIdeaMarketContainerToDom();
    // Twitter
    if (currentDomain.includes('twitter.com')) {
      waitForElementToDisplay("div[data-testid=\"tweet\"]",() => {
        StartIdeaMarket();
        // when url is changed in twitter restart
        checkURLchange(window.location.href, StartIdeaMarket);
        // when system theme is changed in twitter restart
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', 
          () => setTimeout(() => StartIdeaMarket(), 3000)
        );
      }, 1000, 100000)
    }
    // Substack
    if (currentDomain.includes('substack.com')) {
      // console.log(document.querySelectorAll('div[data-testid="tweet"]'));
    }
  }
}

function detectChangesInTweetsColoumn(){
  const targetNode = document.querySelector('div[data-testid="primaryColumn"] section > div > div');
  DetectChangesOnElement(targetNode, function() {
    console.log(targetNode)
    console.log("Changes")
    startIdeaMarketTwitter();
  })
}

function checkIfActivatedDomain(currentDomain: string) {
  const domainsActivated = ['twitter.com', 'substack.com']
  return domainsActivated.find(element => element.includes(currentDomain));
}

function StartIdeaMarket() {
  waitForElementToDisplay("div[data-testid=\"tweet\"]",() => {
    // Set theme according to selection
    setThemeWithSelection();
    startIdeaMarketTwitter();
    // If there are changes in tweets, restart
    detectChangesInTweetsColoumn()
  }, 1000, 100000)
}

function startIdeaMarketTwitter() {
  // Get Data for tweets on screen
  getDataForAllTweetsOnScreen(addToTweetsOnScreen)
  // Add IdeaMarket to available Tweets
  addToTweetsOnScreen();
}

async function getDataForAllTweetsOnScreen(onSuccess: { (): void; (): void; }) {
  allTweets = document.querySelectorAll('div[data-testid="tweet"]');
  const allUserNames: string[] = []
  allTweets.forEach(tweet => {
    const username = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type').textContent;
    allUserNames.push(username)
  });
  getIdeaMarketData(allUserNames).then((data) => {
    if(data?.data?.ideaMarkets[0]?.tokens) {
      const {tokens} = data.data.ideaMarkets[0]
      addDataToListingsData(allUserNames, tokens);
      onSuccess();
    } else {
      // If api error try again
      getDataForAllTweetsOnScreen(onSuccess);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addDataToListingsData(allUserNames: string[], tokens: any[]) {
  allUserNames.forEach((username: string) => {
    const listing = tokens.find((o: { name: string; }) => o.name === username);

    if(listing) {
      listingsData[username] = {
        rank: listing.rank.toString(),
        price: parseFloat(listing.latestPricePoint.price).toFixed(2),
        dayChange: parseFloat(listing.dayChange).toFixed(2) + '%',
        market: listing.market.name.toLowerCase()
      }
    } else {
      listingsData[username] = {
        notList: 'true'
      }
    }
  })
  return true;
}

function addToTweetsOnScreen() {
  allTweets = document.querySelectorAll('div[data-testid="tweet"]');
  allTweets.forEach(tweet => {
    const username = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type').textContent;
    AddIdeaMarket(tweet, username, tweet.querySelector('div[data-testid="caret"]').parentNode);
  });
}

function AddIdeaMarket(tweet: Element, username: string, target: Node & ParentNode){
  const el = (document.querySelector('#ideamarket-container .ideamarket-listing').cloneNode(true) as HTMLElement);
  if(Object.prototype.hasOwnProperty.call(listingsData,username) && listingsData[username].rank) {
    el.classList.add("listed");
    el.querySelector('.ideamarket-rank').textContent = listingsData[username].rank
    el.addEventListener("mouseover", (e) => showAlert(e, username), false);
  } else if(listingsData[username]?.notList) {
    el.classList.add("unlisted");
    el.addEventListener("mouseover", (e) => showAlert(e, username), false);
  } else {
    el.classList.add("loading");
  }
  if(tweet.parentNode.querySelector('.ideamarket-listing')){
    tweet.parentNode.querySelector('.ideamarket-listing').replaceWith(el)
  } else {
    target.appendChild(el);
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
  if(userdata?.rank) {
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
