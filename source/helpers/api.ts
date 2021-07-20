const BASE_URL = 'https://subgraph.backend.ideamarket.io'

function getIdeaMarketData(allUserNames: string[], marketName: string) {
  const stringifiedNames = JSON.stringify(
    allUserNames.filter((v, i, a) => a.indexOf(v) === i)
  )

  const query = `
  {
    ideaMarkets(where:{name:"${marketName}"}) {
      tokens(where:{name_in:${stringifiedNames}}) {
        id
        name
        rank
        dayChange
        market {
          name
        }
        latestPricePoint{
          price
        }
      }
    }
  }`

  return fetch(`${BASE_URL}/subgraphs/name/Ideamarket/Ideamarket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
    body: JSON.stringify({
      query,
    }),
  })
    .then((res) => res.json())
    .catch((err) => err)
}

export default getIdeaMarketData
