import * as React from 'react'
import classNames from 'classnames'
import icon from '../../assets/icons/logo.png'
import loadingicon from '../../assets/icons/loading.svg'
import disabledLogo from '../../assets/icons/disabledLogo.png'
import './styles.scss'
import useTheme from '../../hooks/useTheme'

const Container: React.FC = () => {
  const { theme } = useTheme()

  console.log('theme==', theme)

  return (
    <div>
      <div className={classNames(
        (theme === 'Dark' || theme === 'Dim') && 'dark:bg-extension-dark-2 text-white',
        theme === 'Light' && 'dark:bg-extension-dark-2 text-black',
        "fixed block overflow-auto text-center ideamarket-hover-alert"
      )}>
        <div className="ideamarket-unlisted-container">Unlisted</div>
        <div className="ideamarket-listed-container">
          <div className={classNames(
            theme === 'Dark' && 'dark:bg-extension-dark-1',
            theme === 'Dim' && 'bg-extension-dim',
            theme === 'Light' && 'bg-extension-light',
            "inline-block"
          )}>
            <div className="ideamarket-listed-rank">17</div>
            <div>Rank</div>
          </div>
          <div className={classNames(
            theme === 'Dark' && 'dark:bg-extension-dark-1',
            theme === 'Dim' && 'bg-extension-dim',
            theme === 'Light' && 'bg-extension-light',
            "inline-block"
          )}>
            <div className="ideamarket-listed-price">$2.41</div>
            <div className="ideamarket-listed-day-change">+5.73%</div>
          </div>
        </div>
        <div className={classNames(
          theme === 'Dark' && 'dark:bg-extension-dark-1',
          theme === 'Dim' && 'bg-extension-dim',
          theme === 'Light' && 'bg-extension-light',
          "ideamarket-alert-bottom"
        )}>
          <a href="https://ideamarket.io" target="_blank" rel="noreferrer">
            <button className="font-bold text-white border-none rounded-lg cursor-pointer ideamarket-button ideamarket-unlisted-button">
              List
            </button>
          </a>
          <a href="https://ideamarket.io" target="_blank" rel="noreferrer">
            <button className="font-bold text-white border-none rounded-lg cursor-pointer ideamarket-button ideamarket-listed-button">
              Buy
            </button>
          </a>
          <div className="font-bold ideamarket-powered-by-text">
            Powered by{' '}
            <span className="text-black dark:text-white">Ideamarket</span>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center pt-1 cursor-pointer ideamarket-listing">
        <span className={classNames(
          (theme === 'Dark' || theme === 'Dim') && 'text-white',
          theme === 'Light' && 'text-black',
          "text-xs ideamarket-price"
        )}>$0.10</span>
        <img className="ideamarket-listed-logo max-w-max" src={icon} />
        <img
          className="opacity-50 ideamarket-unlisted-logo max-w-max"
          src={disabledLogo}
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
