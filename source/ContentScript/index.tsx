import * as React from 'react'
import ReactDOM from 'react-dom'
import Container from '../components/Container'

import {
	checkURLchange,
	waitForElementToDisplay,
	DetectChangesOnElement,
	setThemeWithSelection,
} from '../helpers/events'
import getIdeaMarketData from '../helpers/api'
import { browser } from 'webextension-polyfill-ts'

interface Listing {
	[key: string]: string
}

interface Listings {
	[key: string]: Listing
}

const listingsData: Listings = {
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

init()

async function init() {
	const currentDomain = window.location.host
	if (await checkIfActivatedDomain(currentDomain)) {
		AddIdeaMarketContainerToDom()
		// Twitter
		if (currentDomain.includes('twitter.com')) {
			waitForElementToDisplay(
				'div[data-testid="tweet"]',
				() => {
					StartIdeaMarket()
					// when url is changed in twitter restart
					checkURLchange(window.location.href, StartIdeaMarket)
					// when system theme is changed in twitter restart
					window
						.matchMedia('(prefers-color-scheme: dark)')
						.addEventListener('change', () => setTimeout(() => StartIdeaMarket(), 3000))
				},
				1000,
				100000
			)
		}
		// Substack
		if (currentDomain.includes('substack.com')) {
			waitForElementToDisplay(
				'.publications',
				() => {
					StartIdeaMarket()
				},
				1000,
				100000
			)
			waitForElementToDisplay(
				'.search-results',
				() => {
					StartIdeaMarket()
				},
				1000,
				100000
			)
		}
	}
}

function detectChangesInColoumn(targetNode: Node, callback: () => void) {
	DetectChangesOnElement(targetNode, function () {
		callback()
	})
}

async function checkIfActivatedDomain(currentDomain: string) {
	let sitesActivated = { twitter: true, substack: true }
	const item = await browser.storage.local.get('sitesActivated')
	if (item?.sitesActivated) {
		sitesActivated = JSON.parse(item.sitesActivated)
	}
	const siteFound = Object.keys(sitesActivated).find((element) => currentDomain.includes(element))
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return sitesActivated[siteFound]
}

function StartIdeaMarket() {
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
					document.querySelector('div[data-testid="primaryColumn"] section > div > div'),
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
			detectChangesInColoumn(document.querySelector('.publications'), startIdeaMarketSubStack)
		} else {
			detectChangesInColoumn(document.querySelector('.discover-page .items'), startIdeaMarketSubStack)
		}
	}
}

function startIdeaMarketTwitter() {
	// Get Data for tweets on screen
	getDataForAllTweetsOnScreen(addToTweetsOnScreen)
	// Add IdeaMarket to available Tweets
	addToTweetsOnScreen()
}

function startIdeaMarketSubStack() {
	// Get Data for tweets on screen
	getDataForAllPublicationsOnScreen(addToSubstacksOnScreen)
	// Add IdeaMarket to available Tweets
	addToSubstacksOnScreen()
}

async function getDataForAllPublicationsOnScreen(onSuccess: { (): void; (): void }) {
	const allPublications = document.querySelectorAll('.publications a.publication, .search-results .item')
	const allUserNames: string[] = []
	allPublications.forEach((publication) => {
		const username = (
			publication
				.getAttribute('href')
				?.split('.')[0]
				?.replace(/^https?:\/\//, '') ||
			publication
				.querySelector('.title a')
				.getAttribute('href')
				.split('.')[0]
				.replace(/^https?:\/\//, '')
		).toLowerCase()
		allUserNames.push(username)
	})
	getIdeaMarketData(allUserNames, 'Substack').then((data) => {
		if (data?.data?.ideaMarkets[0]?.tokens) {
			const { tokens } = data.data.ideaMarkets[0]
			addDataToListingsData(allUserNames, tokens)
			onSuccess()
		} else {
			// If api error try again
			getDataForAllPublicationsOnScreen(onSuccess)
		}
	})
}

async function getDataForAllTweetsOnScreen(onSuccess: { (): void; (): void }) {
	const allTweets = document.querySelectorAll('div[data-testid="tweet"]')
	const allUserNames: string[] = []
	allTweets.forEach((tweet) => {
		const username = tweet
			.querySelector(':scope > div:last-of-type a > div > div:last-of-type')
			.textContent.toLowerCase()
		allUserNames.push(username)
	})
	getIdeaMarketData(allUserNames, 'Twitter').then((data) => {
		if (data?.data?.ideaMarkets[0]?.tokens) {
			const { tokens } = data.data.ideaMarkets[0]
			addDataToListingsData(allUserNames, tokens)
			onSuccess()
		} else {
			// If api error try again
			getDataForAllTweetsOnScreen(onSuccess)
		}
	})
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addDataToListingsData(allUserNames: string[], tokens: any[]) {
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

function addToTweetsOnScreen() {
	const allTweets = document.querySelectorAll('div[data-testid="tweet"]')
	allTweets.forEach((tweet) => {
		const username = tweet
			.querySelector(':scope > div:last-of-type a > div > div:last-of-type')
			.textContent.toLowerCase()
		AddIdeaMarket(tweet.parentNode, username, tweet.querySelector('div[data-testid="caret"]').parentNode)
	})
}

function addToSubstacksOnScreen() {
	const allpublications = document.querySelectorAll('.publications a.publication, .search-results .item')
	allpublications.forEach((publication) => {
		const username = (
			publication
				.getAttribute('href')
				?.split('.')[0]
				?.replace(/^https?:\/\//, '') ||
			publication
				.querySelector('.title a')
				.getAttribute('href')
				.split('.')[0]
				.replace(/^https?:\/\//, '')
		).toLowerCase()
		AddIdeaMarket(publication, username, publication.querySelector('.publication-content') || publication)
	})
}

const timeouts: {[key: string]: NodeJS.Timeout} = {};

function onMouseEnter(event: MouseEvent, username: string) {
	const timeout = timeouts[username]
	if (timeout != null) {
		clearTimeout(timeout)
	}

	timeouts[username] = setTimeout(function () {
		showAlert(event, username)
	}, 350);
}

function onMouseLeave(username: string) {
	const timeout = timeouts[username]
	if (timeout != null) {
		clearTimeout(timeout)
		timeouts[username] = null
	}
}

function AddIdeaMarket(tweet: Node & ParentNode, username: string, target: Node & ParentNode) {
	const el = document.querySelector('#ideamarket-container .ideamarket-listing').cloneNode(true) as HTMLElement
	if (Object.prototype.hasOwnProperty.call(listingsData, username) && listingsData[username].rank) {
		el.classList.add('listed')
		el.querySelector('.ideamarket-rank').textContent = listingsData[username].rank
		el.addEventListener('mouseenter', (e) => onMouseEnter(e, username), false)
		el.addEventListener('mouseleave', () => onMouseLeave(username), false)
	} else if (listingsData[username]?.notList) {
		el.classList.add('unlisted')
		el.addEventListener('mouseenter', (e) => onMouseEnter(e, username), false)
		el.addEventListener('mouseleave', () => onMouseLeave(username), false)
	} else {
		el.classList.add('loading')
	}
	if (tweet.querySelector('.ideamarket-listing')) {
		tweet.querySelector('.ideamarket-listing').replaceWith(el)
	} else {
		target.appendChild(el)
	}
}

function showAlert(event: MouseEvent, username: string) {
	const hoverAlert = document.querySelector('.ideamarket-hover-alert').cloneNode(true) as HTMLElement
	AddDataInAlertBox(hoverAlert, username)
	hoverAlert.setAttribute('style', `top:${event.clientY - 35}px;left:${event.clientX - 90}px`)
	function removeAlert(hoverAlert: HTMLElement) {
		hoverAlert?.parentNode?.removeChild(hoverAlert)
	}
	hoverAlert.addEventListener('mouseleave', () => removeAlert(hoverAlert), false)
	document.addEventListener('scroll', () => removeAlert(hoverAlert), false)
	document.body.append(hoverAlert)
}

function AddDataInAlertBox(hoverAlert: HTMLElement, username: string) {
	const userdata = listingsData[username]
	if (userdata?.rank) {
		hoverAlert.classList.add('listed')
		hoverAlert.querySelector('.ideamarket-listed-rank').textContent = userdata.rank
		hoverAlert.querySelector('.ideamarket-listed-price').textContent = '$' + userdata.price
		const dayChangeDiv = hoverAlert.querySelector('.ideamarket-listed-day-change')
		if (userdata.dayChange[0] === '-') {
			dayChangeDiv.classList.add('text-brand-red')
			dayChangeDiv.classList.add('dark:text-red-500')
			dayChangeDiv.textContent = userdata.dayChange
		} else {
			dayChangeDiv.classList.add('text-brand-green')
			dayChangeDiv.textContent = '+' + userdata.dayChange
		}
		;(hoverAlert.querySelector('.ideamarket-listed-button').parentNode as Element).setAttribute(
			'href',
			`https://ideamarket.io/i/${userdata.market}/${username.indexOf('@') === 0 ? username.substr(1) : username}`
		)
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
