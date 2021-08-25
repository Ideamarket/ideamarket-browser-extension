import { listingsData } from './index'

const timeouts: { [key: string]: NodeJS.Timeout } = {}

export function onMouseEnter(event: MouseEvent, username: string) {
  const timeout = timeouts[username]
  if (timeout != null) {
    clearTimeout(timeout)
  }

  timeouts[username] = setTimeout(function () {
    showAlert(event, username)
  }, 175)
}

export function onMouseLeave(username: string) {
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
    `top:${event.clientY - 25}px;left:${event.clientX - 170}px`
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
