import init from './init'

interface Listing {
  [key: string]: string
}

interface Listings {
  [key: string]: Listing
}

export const listingsData: Listings = {
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

export const fetchedUserNames: Array<string> = []

export const fetchedTokens: Array<unknown> = []


init()
