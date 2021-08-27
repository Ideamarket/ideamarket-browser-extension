import * as React from 'react'
import classNames from 'classnames'
import IconDefault from '../../assets/icons/icon-default.png'
import IconBlack from '../../assets/icons/icon-black.png'
import IconWhite from '../../assets/icons/icon-white.png'
import IconBgLight from '../../assets/icons/icon-bg-light.png'
import IconBgDim from '../../assets/icons/icon-bg-dim.png'
import IconBgDark from '../../assets/icons/icon-bg-dark.png'
import loadingicon from '../../assets/icons/loading.svg'
import './styles.scss'
import useTheme from '../../hooks/useTheme'
import { ThemeType } from '../../helpers/theme'

const Container: React.FC = () => {
  const { theme } = useTheme()

  let bgColor = 'bg-extension-light'
  let textColor = 'text-white'
  let borderColor = 'border-light'
  let unlistedIcon = IconWhite
  let iconBg = IconBgLight
  if (theme === ThemeType.Dark) {
    bgColor = 'dark:bg-extension-dark'
    iconBg = IconBgDark
    borderColor = 'border-dark'
  }
  else if (theme === ThemeType.Dim) {
    bgColor = 'bg-extension-dim'
    iconBg = IconBgDim
    borderColor = 'border-dim'
  }
  else if (theme === ThemeType.Light) {
    bgColor = 'bg-extension-light'
    unlistedIcon = IconBlack
    textColor = 'text-black'
  }

  const outerPriceStyles = classNames(
    textColor,
    "text-xs ideamarket-price"
  )

  return (
    <div>
      <div className={classNames(
        textColor,
        bgColor,
        borderColor,
        "fixed block overflow-auto text-center ideamarket-hover-alert z-20 border-2 border-solid rounded-lg shadow-container overflow-none",
      )}>
        <img className="absolute top-0 left-0 w-full h-full object-contain -z-10" src={iconBg} />
        <div className={classNames(borderColor, "ideamarket-unlisted-container border-b-2 border-solid")}>Unlisted</div>
        <div className={classNames(borderColor, "ideamarket-listed-container border-b-2 border-solid")}>
          <div className={classNames(borderColor, "inline-block border-r-2 border-solid")}>
            <div className="ideamarket-listed-rank">17</div>
            <div>Rank</div>
          </div>
          <div className="inline-block">
            <div className="ideamarket-listed-price">$2.41</div>
            <div className="ideamarket-listed-day-change">+5.73%</div>
          </div>
        </div>
        <div className="ideamarket-alert-bottom px-4 py-2">
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
