import * as React from 'react'
import { browser } from 'webextension-polyfill-ts'
import icon from '../../assets/icons/logo.png'
import './styles.scss'
import Select from 'react-select'
import { openWebPage } from '../../helpers'
import {
  ideaMarketThemes,
  intialSelectedTheme,
  intialSitesActivated,
} from '../../helpers/theme'

const Popup: React.FC = () => {
  const [theme, settheme] = React.useState(intialSelectedTheme)
  const [formState, setFormState] = React.useState(intialSitesActivated)
  React.useEffect(() => {
    browser.storage.local.get('theme').then(
      (item) => {
        if (item?.theme) {
          settheme(item.theme)
        }
      },
      () => {
        console.log('no theme selected')
      }
    )
    browser.storage.local.get('sitesActivated').then(
      (item) => {
        console.log(item)
        if (item?.sitesActivated) {
          setFormState(JSON.parse(item.sitesActivated))
        }
      },
      () => {
        console.log('no sitesActivated selected')
      }
    )
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: { target: any }) => {
    const newFormState = {
      ...formState,
      [e.target.name]: e.target.checked,
    }
    browser.storage.local
      .set({ sitesActivated: JSON.stringify(newFormState) })
      .then(
        () => {
          setFormState(newFormState)
        },
        () => {
          console.log('error')
        }
      )
  }

  return (
    <section id="popup" className="bg-white dark:bg-black">
      <nav className="w-full shadow bg-top-desktop pt-5 pb-5 text-center">
        <div
          className="flex justify-center cursor-pointer"
          onClick={() => openWebPage('https://ideamarket.io')}
        >
          <img className="block w-auto h-8" src={icon} alt="Workflow logo" />
          <span className="w-auto h-full leading-none text-white text-3xl font-gilroy-bold">
            Ideamarket
          </span>
        </div>
      </nav>
      <div className="ml-3 mt-5 text-brand-new-dark font-semibold">Theme:</div>
      <div className="flex m-3 mt-2 mb-4 text-sm">
        <Select
          className="w-full border-gray-200 rounded-md text-brand-gray-2 trade-select"
          isClearable={false}
          isSearchable={false}
          onChange={async (option) => {
            browser.storage.local.set({ theme: option.value }).then(
              () => {
                settheme(option.value)
              },
              () => {
                console.log('error')
              }
            )
            // slippage = option.value
          }}
          options={ideaMarketThemes}
          value={ideaMarketThemes.find((o) => o.value === theme)}
          defaultValue={ideaMarketThemes.find((o) => o.value === theme)}
        />
      </div>
      <div className="ml-3 text-brand-new-dark font-semibold">
        Activated For:
      </div>
      <div className="m-3 mt-2 text-sm">
        <div className="mr-2 mb-2">
          <input
            type="checkbox"
            id="ideamarket-twitter"
            name="twitter"
            checked={formState.twitter}
            onChange={handleChange}
          />
          <label
            htmlFor="ideamarket-twitter"
            className="ml-2 cursor-pointer text-brand-new-dark font-semibold"
          >
            Twitter
          </label>
        </div>
        <div className="mr-2">
          <input
            type="checkbox"
            name="substack"
            id="ideamarket-substack"
            checked={formState.substack}
            onChange={handleChange}
          />
          <label
            htmlFor="ideamarket-substack"
            className="ml-2 cursor-pointer text-brand-new-dark font-semibold"
          >
            Substack
          </label>
        </div>
      </div>
      {/* <button
        id="options__button"
        type="button"
        className="mx-5 mt-5 text-sm  underline cursor-pointer text-brand-gray-2 font-semibold"
        onClick={(): Promise<Tabs.Tab> => {
          return openWebPage('options.html');
        }}
      >
        Go to Options Page
      </button> */}
    </section>
  )
}

export default Popup