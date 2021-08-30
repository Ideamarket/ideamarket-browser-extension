let oldURL = ''

export function checkURLchange(
  currentURL: string,
  callback: { (): void; (): void }
) {
  if (oldURL && currentURL != oldURL) {
    callback()
    oldURL = currentURL
  }

  oldURL = window.location.href
  setTimeout(function () {
    checkURLchange(window.location.href, callback)
  }, 1000)
}

export function waitForElementToDisplay(
  selector: string,
  callback: VoidFunction,
  checkFrequencyInMs: number,
  timeoutInMs: number
) {
  const startTimeInMs = Date.now()
  ;(function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback()
      return
    } else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) return
        loopSearch()
      }, checkFrequencyInMs)
    }
  })()
}

export function detectChangesOnElement(
  targetNode: Node,
  callbackTrigger: { (): void; (): void }
) {
  const observer = new MutationObserver(() => setTimeout(callbackTrigger, 500))
  observer.observe(targetNode, { attributes: false, childList: true })
}

export function detectChangesInColoumn(targetNode: Node, callback: () => void) {
  if (targetNode) {
    detectChangesOnElement(targetNode, function () {
      callback()
    })
  }
}
