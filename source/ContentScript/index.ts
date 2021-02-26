import { 
  checkURLchange,
  waitForElementToDisplay,
  DetectChanges 
} from "../helpers/events";

// Twitter Market
let allTweets = document.querySelectorAll('div[data-testid="tweet"]');

interface Listing {
  [key: string]: unknown
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

StartIdeaMarket();

checkURLchange(window.location.href, function() {
  StartIdeaMarket();
});

function StartIdeaMarket() {
  if (window.location.host.includes('twitter.com')) {
    waitForElementToDisplay("div[data-testid=\"tweet\"]",() => {
      // Add IdeaMarket to available Tweets
      AddIdeaMarket();
      // Detect changes in tweets
      DetectChanges(function(){
        AddIdeaMarket();
      })
    }, 1000, 100000)
  }
  
  // Substack
  if (window.location.host.includes('substack.com')) {
    // ReactDOM.render(<Options />, document.body);
    // console.log(document.querySelectorAll('div[data-testid="tweet"]'));
  }
}


function AddIdeaMarket(){
  allTweets = document.querySelectorAll('div[data-testid="tweet"]');
  allTweets.forEach(tweet => {
    const username = tweet.querySelector(':scope > div:last-of-type a > div > div:last-of-type').textContent
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = '-90px';
    el.style.color = 'white';
    el.textContent = Object.prototype.hasOwnProperty.call(listingsData,username) ? username + listingsData[username].price : username + " Not Listed";
    tweet.querySelector(':scope div[data-testid="caret"]').parentNode.appendChild(el);
  })
}

export {}
