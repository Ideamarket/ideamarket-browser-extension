import * as React from 'react'
import classNames from 'classnames'
import IconDefault from '../../assets/icons/icon-default.png'
import loadingicon from '../../assets/icons/loading.svg'
import IconBlack from '../../assets/icons/icon-black.png'
import IconWhite from '../../assets/icons/icon-white.png'
import './styles.scss'
import useTheme from '../../hooks/useTheme'
import { ThemeType } from '../../helpers/theme'

const Container: React.FC = () => {
  const { theme } = useTheme()

  let bgStyles = 'bg-extension-light'
  let unlistedIcon = IconBlack
  if (theme === ThemeType.Dark) {
    bgStyles = 'dark:bg-extension-dark'
    unlistedIcon = IconWhite
  }
  else if (theme === ThemeType.Dim) {
    bgStyles = 'bg-extension-dim'
    unlistedIcon = IconWhite
  }
  else if (theme === ThemeType.Light) {
    bgStyles = 'bg-extension-light'
  }

  const unlistedStyles = classNames(
    bgStyles,
    "ideamarket-unlisted-container"
  )

  const rankStyles = classNames(
    bgStyles,
    "inline-block"
  )

  const innerPriceStyles = classNames(
    bgStyles,
    "inline-block"
  )

  const buttonStyles = classNames(
    bgStyles,
    "ideamarket-alert-bottom px-4 py-2"
  )

  const outerPriceStyles = classNames(
    (theme === ThemeType.Dark || theme === ThemeType.Dim) && 'text-white',
    theme === ThemeType.Light && 'text-black',
    "text-xs ideamarket-price"
  )

  return (
    <div>
      <div className={classNames(
        (theme === ThemeType.Dark || theme === ThemeType.Dim) && 'text-white',
        theme === ThemeType.Light && 'text-black',
        "fixed block overflow-auto text-center ideamarket-hover-alert"
      )}>
        <div className={unlistedStyles}>Unlisted</div>
        <div className="ideamarket-listed-container">
          <div className={rankStyles}>
            <div className="ideamarket-listed-rank">17</div>
            <div>Rank</div>
          </div>
          <div className={innerPriceStyles}>
            <div className="ideamarket-listed-price">$2.41</div>
            <div className="ideamarket-listed-day-change">+5.73%</div>
          </div>
        </div>
        <div className={buttonStyles}>
          <a href="https://ideamarket.io" target="_blank" rel="noreferrer">
            <button className="font-bold text-white border-none rounded-full cursor-pointer bg-blue-700 w-full p-3 ideamarket-unlisted-button">
              List
            </button>
          </a>
          <a href="https://ideamarket.io" target="_blank" rel="noreferrer">
            <button className="font-bold text-white border-none rounded-full cursor-pointer bg-blue-700 w-full p-3 ideamarket-listed-button">
              Buy
            </button>
          </a>
        </div>
      </div>
      <div className="absolute flex items-center justify-center pt-1 cursor-pointer ideamarket-listing">
        <span className={outerPriceStyles}>$0.10</span>
        <img className="ideamarket-listed-logo max-w-max" src={IconDefault} />
        <img
          className="opacity-50 ideamarket-unlisted-logo max-w-max"
          src={unlistedIcon}
        />
        <img
          className="opacity-50 ideamarket-loading-icon max-w-max"
          src={loadingicon}
        />
      </div>
    </div>
  )
}

export default Container
