import { listingsData } from './index'

export function addIdeaMarket(
  tweet: Node & ParentNode,
  username: string,
  target: Node & ParentNode
) {
  const el = document
    .querySelector('#ideamarket-container .ideamarket-listing')
    .cloneNode(true) as HTMLElement
  if (
    Object.prototype.hasOwnProperty.call(listingsData, username) &&
    listingsData[username].rank
  ) {
    el.classList.add('ideamarket-listed')
    el.querySelector('.ideamarket-rank').textContent =
      listingsData[username].rank
    el.addEventListener('mouseenter', (e) => onMouseEnter(e, username), false)
    el.addEventListener('mouseleave', () => onMouseLeave(username), false)
  } else if (listingsData[username]?.notList) {
    el.classList.add('ideamarket-unlisted')
    el.addEventListener('mouseenter', (e) => onMouseEnter(e, username), false)
    el.addEventListener('mouseleave', () => onMouseLeave(username), false)
  } else {
    el.classList.add('ideamarket-loading')
  }
  if (tweet.querySelector('.ideamarket-listing')) {
    tweet.querySelector('.ideamarket-listing').replaceWith(el)
  } else {
    target.appendChild(el)
  }
}

const timeouts: { [key: string]: NodeJS.Timeout } = {}

function onMouseEnter(event: MouseEvent, username: string) {
  const timeout = timeouts[username]
  if (timeout != null) {
    clearTimeout(timeout)
  }

  timeouts[username] = setTimeout(function () {
    showAlert(event, username)
  }, 350)
}

function onMouseLeave(username: string) {
  const timeout = timeouts[username]
  if (timeout != null) {
    clearTimeout(timeout)
    timeouts[username] = null
  }
}

function showAlert(event: MouseEvent, username: string) {
  const hoverAlert = document
    .querySelector('.ideamarket-hover-alert')
    .cloneNode(true) as HTMLElement
  addDataInAlertBox(hoverAlert, username)
  hoverAlert.setAttribute(
    'style',
    `top:${event.clientY - 35}px;left:${event.clientX - 90}px`
  )
  function removeAlert(hoverAlert: HTMLElement) {
    hoverAlert?.parentNode?.removeChild(hoverAlert)
  }
  hoverAlert.addEventListener(
    'mouseleave',
    () => removeAlert(hoverAlert),
    false
  )
  document.addEventListener('scroll', () => removeAlert(hoverAlert), false)
  document.body.append(hoverAlert)
}

function addDataInAlertBox(hoverAlert: HTMLElement, username: string) {
  const userdata = listingsData[username]
  if (userdata?.rank) {
    hoverAlert.classList.add('ideamarket-listed')
    hoverAlert.querySelector('.ideamarket-listed-rank').textContent =
      userdata.rank
    hoverAlert.querySelector('.ideamarket-listed-price').textContent =
      '$' + userdata.price
    const dayChangeDiv = hoverAlert.querySelector(
      '.ideamarket-listed-day-change'
    )
    if (userdata.dayChange[0] === '-') {
      dayChangeDiv.classList.add('text-brand-red')
      dayChangeDiv.classList.add('dark:text-red-500')
      dayChangeDiv.textContent = userdata.dayChange
    } else {
      dayChangeDiv.classList.add('text-brand-green')
      dayChangeDiv.textContent = '+' + userdata.dayChange
    }
    (hoverAlert.querySelector('.ideamarket-listed-button')
      .parentNode as Element).setAttribute(
      'href',
      `https://ideamarket.io/i/${userdata.market}/${
        username.indexOf('@') === 0 ? username.substr(1) : username
      }`
    )
  } else {
    hoverAlert.classList.add('ideamarket-unlisted')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addDataToListingsData(allUserNames: string[], tokens: any[]) {
  allUserNames.forEach((username: string) => {
    const listing = tokens.find((o: { name: string }) => o.name === username)

    if (listing) {
      listingsData[username] = {
        rank: listing.rank.toString(),
        price: parseFloat(listing.latestPricePoint.price).toFixed(2),
        dayChange: parseFloat(listing.dayChange).toFixed(2) + '%',
        market: listing.market.name.toLowerCase(),
      }
    } else {
      listingsData[username] = {
        notList: 'true',
      }
    }
  })
  return true
}
