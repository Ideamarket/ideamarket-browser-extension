import * as React from 'react'
import icon from '../assets/icons/logo.png'
import loadingicon from '../assets/icons/loading.svg'
import disabledLogo from '../assets/icons/disabledLogo.png'
import './styles.scss'

const Container: React.FC = () => {
	return (
		<div>
			<div className="fixed block overflow-auto text-center text-black ideamarket-hover-alert bg-extension-light-2 dark:bg-extension-dark-2 dark:text-white">
				<div className="ideamarket-unlisted-container">Unlisted</div>
				<div className="ideamarket-listed-container">
					<div className="inline-block">
						<div className="ideamarket-listed-rank">17</div>
						<div>Rank</div>
					</div>
					<div className="inline-block bg-extension-light-1 dark:bg-extension-dark-1">
						<div className="ideamarket-listed-price">$2.41</div>
						<div className="ideamarket-listed-day-change">+5.73%</div>
					</div>
				</div>
				<div className="ideamarket-alert-bottom bg-extension-light-1 dark:bg-extension-dark-1">
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
						Powered by <span className="text-black dark:text-white">Ideamarket</span>
					</div>
				</div>
			</div>
			<div className="absolute flex items-center justify-center cursor-pointer ideamarket-listing">
				<span className="ideamarket-rank"></span>
				<img className="logo listed-logo" src={icon} />
				<img className="pt-1 opacity-50 logo unlisted-logo" src={disabledLogo} />
				<img className="pt-1 opacity-50 logo loading-icon" src={loadingicon} />
			</div>
		</div>
	)
}

export default Container
