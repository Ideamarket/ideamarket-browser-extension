import * as React from 'react';
import ReactDOM from 'react-dom'
let modalRoot = document.getElementById('react-root');

type AppProps = {
    children: React.ReactChild
}
type AppState = {}

export default class Twitter extends React.Component<AppProps, AppState> {
    el: HTMLDivElement;
    constructor(props: AppProps) {
        super(props);
        this.el = document.createElement('div');
    }

  
  componentDidMount() {
    waitForElementToDisplay("div[data-testid=\"tweet\"]",() => {
      modalRoot = document.querySelector('div[data-testid="tweet"] div[data-testid="caret"]');
      this.el.style.position = 'absolute';
      this.el.style.left = '-90px';
      modalRoot.parentNode.appendChild(this.el);
    }, 1000, 100000);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render(): JSX.Element {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
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