
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

function DetectChanges(callbackTrigger: { (): void; (): void; }) {
  let lastExcecutionTime = new Date().getTime();
  const targetNode = document.querySelector('div[data-testid="primaryColumn"] section > div > div');
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

export {
  checkURLchange,
  waitForElementToDisplay,
  DetectChanges
}