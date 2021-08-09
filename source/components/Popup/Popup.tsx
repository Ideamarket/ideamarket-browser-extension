import * as React from 'react'
import classNames from 'classnames'
import { browser } from 'webextension-polyfill-ts'
import IconDefault from '../../assets/icons/icon-default.png'
import './styles.scss'
import {
  ideaMarketSitesActivated,
  ideaMarketThemes,
  intialSelectedTheme,
  intialSitesActivated,
} from '../../helpers/theme'
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch'

const Popup: React.FC = () => {
  const [theme, setTheme] = React.useState(intialSelectedTheme)
  const [formState, setFormState] = React.useState(intialSitesActivated)
  const [isOptions, setIsOptions] = React.useState(false) // Is options page or extension overlay?
  React.useEffect(() => {
    browser.storage.local.get('theme').then(
      (item) => {
        if (item?.theme) {
          setTheme(item.theme)
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

    const optionsRoot = document.getElementById('options-root')
    if (optionsRoot) setIsOptions(true)
    else setIsOptions(false)
  }, [])

  function handleThemeChange(themeValue: string) {
    browser.storage.local.set({ theme: themeValue }).then(
      () => {
        setTheme(themeValue)
      },
      () => {
        console.log('error')
      }
    )
  }

  function handleSiteChange(siteValue: string) {
    const newFormState = {
      ...formState,
      [siteValue]: !formState[siteValue],
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
    <section id="popup" className={classNames(
      "overflow-hidden font-inter-regular",
      isOptions && 'w-screen h-screen',
    )}>
      <div className="h-full bg-options-image bg-cover bg-center overflow-hidden">
        <div className={classNames(
          "flex w-min h-56 mx-auto bg-white rounded-lg shadow-lg",
          isOptions && 'mt-20'
        )}>
          <div className="flex flex-col w-56 overflow-hidden">
            <div className="h-12 pl-6 border-solid border-0 border-b-2 border-gray-100">
              <h1>Theme</h1>
            </div>
            <div className="h-44">
              <ul className="list-none px-6">
                {ideaMarketThemes.map(imTheme => (
                  <li className="flex items-center justify-between mb-2" key={imTheme.value}>
                    <span className="font-extrabold">{imTheme.label}</span>
                    <ToggleSwitch handleChange={handleThemeChange} value={imTheme.value} isOn={theme===imTheme.value} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-44 border-solid border-l-2 border-r-2 border-t-0 border-b-0 border-gray-100">
            <img className="block w-full h-full object-cover" src={IconDefault} alt="Ideamarket logo" />
          </div>
          <div className="flex flex-col w-56 overflow-hidden">
            <div className="h-12 pl-6 border-solid border-0 border-b-2 border-gray-100">
              <h1>Activated For</h1>
            </div>
            <div className="h-44">
              <ul className="list-none px-6">
                {ideaMarketSitesActivated.map(site => (
                  <li className="flex items-center justify-between mb-2" key={site.value}>
                    <span className="font-extrabold">{site.label}</span>
                    <ToggleSwitch handleChange={handleSiteChange} value={site.value} isOn={formState[site.value]} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Popup
