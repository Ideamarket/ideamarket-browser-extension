import * as React from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';
import icon from '../assets/icons/logo.png';
import './styles.scss';
import Select from 'react-select';

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}

type IdeaMarketThemesValue = {
  value: string
  label: string
}

const ideaMarketThemes: IdeaMarketThemesValue[] = [
  { value: 'System Default', label: 'System Default' },
  { value: 'Light', label: 'Light' },
  { value: 'Dark', label: 'Dark' },
]

let intialSelectedTheme = 'System Default';


browser.storage.local.get("theme")
.then((item) => {
    intialSelectedTheme = item.theme
  }, () => {
    console.log('no theme selected')
  });
  
// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//   // dark mode
//   console.log("dark mode")
// }
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//   const newColorScheme = e.matches ? "dark" : "light";
//   console.log(newColorScheme)
// });

const Popup: React.FC = () => {
  const [theme, settheme] = React.useState(intialSelectedTheme)
  React.useEffect(() => {
    browser.storage.local.get("theme")
      .then((item) => {
        settheme(item.theme)
      }, () => {
        console.log('no theme selected')
      });
  }, [])
  return (
    <section id="popup" className="bg-white dark:bg-black">
      <nav className="w-full shadow bg-top-desktop p-5 text-center">
        <div className="flex justify-center cursor-pointer" onClick={(): Promise<Tabs.Tab> => {
          return openWebPage('https://ideamarket.io');
        }}>
          <img className="block w-auto h-8" src={icon} alt="Workflow logo"/>
          <span className="w-auto h-full text-2xl leading-none text-white text-3xl font-gilroy-bold">Ideamarket</span>
        </div>
      </nav>
      <div className="ml-3 mt-5 text-brand-new-dark font-semibold">
        Theme:
      </div>
      <div className="flex m-3 mt-2 mb-4 text-sm">
        <Select
          className="w-full border-gray-200 rounded-md text-brand-gray-2 trade-select"
          isClearable={false}
          isSearchable={false}
          onChange={async (option) => {
            browser.storage.local.set({theme: option.value})
              .then(() => {
                settheme(option.value)
              }, () => {
                console.log('error')
              });
            // slippage = option.value
          }}
          options={ideaMarketThemes}
          value={ideaMarketThemes.find(o => o.value ===  theme)}
          defaultValue={ideaMarketThemes.find(o => o.value ===  theme)}
        />
      </div>
      <div className="ml-3 text-brand-new-dark font-semibold">
        Actived For:
      </div>
      <div className="m-3 mt-2 text-sm">
        <div className="mr-2 mb-2">
          <input type="checkbox" id="ideamarket-twitter" />
          <label htmlFor="ideamarket-twitter" className="ml-2 cursor-pointer text-brand-new-dark font-semibold">
            Twitter
          </label>
        </div>
        <div className="mr-2">
          <input type="checkbox" id="ideamarket-substack" />
          <label htmlFor="ideamarket-substack" className="ml-2 cursor-pointer text-brand-new-dark font-semibold">
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
  );
};

export default Popup;
