function getIdeaMarketData(allUserNames: string[], marketName: string) {
	return fetch('https://subgraph.backend.ideamarket.io/subgraphs/name/Ideamarket/Ideamarket', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'force-cache',
		body: JSON.stringify({
			query: `
      {
        ideaMarkets(where:{name:"${marketName}"}) {
          tokens(where:{name_in:${JSON.stringify(allUserNames.filter((v, i, a) => a.indexOf(v) === i))}}) {
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
      }`,
		}),
	})
		.then((res) => res.json())
		.catch((err) => err)
}

export default getIdeaMarketData
