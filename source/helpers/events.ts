import { browser } from 'webextension-polyfill-ts';

let oldURL = "";
function checkURLchange(currentURL: string, callback: { (): void; (): void; }){
  if(currentURL != oldURL){
    callback();
    oldURL = currentURL;
  }

  oldURL = window.location.href;
  setTimeout(function() {
    checkURLchange(window.location.href, callback);
  }, 1000);
}

function waitForElementToDisplay(selector: string, callback: VoidFunction, checkFrequencyInMs: number, timeoutInMs:number) {
  const startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

function DetectChangesOnElement(targetNode: Node, callbackTrigger: { (): void; (): void; }) {
  let lastExcecutionTime = new Date().getTime();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callback = (mutationsList: any) => {
    for(const mutation of mutationsList) {
      if (mutation.type == 'childList') {
        // Make sure we are not excuting immedietly 
        if((new Date().getTime() - lastExcecutionTime) > 100) {
          lastExcecutionTime = new Date().getTime();
          callbackTrigger();
        }
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, { attributes: true, childList: true });
}

function setThemeWithSelection() {
  const root = document.getElementsByTagName( 'html' )[0]; 
  browser.storage.local.get("theme")
    .then((item) => {
      let {theme} = item
      if(theme === 'System Default') {
        theme = 'Light'
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          theme =  'Dark';
        }
      }
      if(theme === 'Dark') {
        root.classList.add('dark');
        return;
      }
      root.classList.remove('dark');
    }, () => {
      // console.log('no theme selected')
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark'); 
        return;
      }
      root.classList.remove('dark'); 
    });

}

export {
  checkURLchange,
  waitForElementToDisplay,
  DetectChangesOnElement,
  setThemeWithSelection
}