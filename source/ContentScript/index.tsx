import * as React from 'react'
import ReactDOM from 'react-dom'
import Container from '../components/Container'

import { 
  checkURLchange,
  waitForElementToDisplay,
  DetectChanges 
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
    dayChange: '-0.064'
  }
}


if (window.location.host.includes('twitter.com')) {
  AddIdeaMarketCompToDom()
  StartIdeaMarket();
  checkURLchange(window.location.href, function() {
    StartIdeaMarket();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? "dark" : "light";
    console.log(newColorScheme)
    setTimeout(() => {
      StartIdeaMarket();
    }, 3000);
  });
}

// Substack
if (window.location.host.includes('substack.com')) {
  // ReactDOM.render(<Options />, document.body);
  // console.log(document.querySelectorAll('div[data-testid="tweet"]'));
}

function StartIdeaMarket() {
  waitForElementToDisplay("div[data-testid=\"tweet\"]",() => {
    // Add IdeaMarket to available Tweets
    allTweets = document.querySelectorAll('div[data-testid="tweet"]');
    AddIdeaMarket();
    // Detect changes in tweets
    DetectChanges(function(){
      allTweets = document.querySelectorAll('div[data-testid="tweet"]');
      AddIdeaMarket();
    })
  }, 1000, 100000)
}

function func(item: HTMLElement)
{ 
  item.querySelector('.hover-alert').classList.remove("hidden-alert");
}

function func1(item: HTMLElement)
{
  item.querySelector('.hover-alert').classList.add("hidden-alert");
}

function AddIdeaMarket(){
  allTweets.forEach(tweet => {
    if(!tweet.querySelector('.ideamarket-listing')){
      const username = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type').textContent;
      const el = (document.querySelector('#ideamarket-container .ideamarket-listing').cloneNode(true) as HTMLElement);

      el.addEventListener("mouseover", () => func(el), false);
      el.addEventListener("mouseout", () => func1(el), false);


      if(Object.prototype.hasOwnProperty.call(listingsData,username) && listingsData[username].rank) {
        el.classList.add("listed");
        el.querySelector('.ideamarket-rank').textContent = listingsData[username].rank
      } else {
        el.classList.add("notlisted");
      }
      tweet.appendChild(el);
    }
  })
}

function AddIdeaMarketCompToDom() {
  const IdeaMarketContainer = document.createElement('div')
  IdeaMarketContainer.setAttribute('id', 'ideamarket-container')
  IdeaMarketContainer.style.position = "absolute";
  IdeaMarketContainer.style.display = "none"; 

  document.body.append(IdeaMarketContainer)
  ReactDOM.render(
    <Container />,
    document.querySelector('#ideamarket-container')
  )

}

export {}
