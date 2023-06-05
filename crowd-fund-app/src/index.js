import React from 'react';
import ReactDOM from 'react-dom';
import { CeloProvider, Alfajores, NetworkNames } from '@celo/react-celo';
import "@celo/react-celo/lib/styles.css";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



import { createTheme, NextUIProvider} from "@nextui-org/react"


const theme = createTheme({
  type: "dark", 
  theme: {
    colors: {
      primaryLight: '$blue200',
      primaryLightHover: '$blue300',
      primaryLightActive: '$blue400',
      primaryLightContrast: '$blue600',
      primary: '#010438',
      primaryBorder: '$blue500',
      primaryBorderHover: '$blue600',
      primarySolidHover: '$blue700',
      primarySolidContrast: '$white',
      primaryShadow: '$blue500',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',
      myColor: '#ff4ecd'
    },
    space: {},
    fonts: {}
  }
})


ReactDOM.render(
    <CeloProvider
      networks={[Alfajores]}
      network={{
        name: NetworkNames.Alfajores,
        rpcUrl: 'https://alfajores-forno.celo-testnet.org',
        graphQl: 'https://alfajores-blockscout.celo-testnet.org/graphiql',
        explorer: 'https://alfajores-blockscout.celo-testnet.org',
        chainId: 44787
      }}
      dapp={{
        name: "Nft CrowdFund Raiser",
        description: "A CrowdFunding Tutorial Project On Celo",
        url: "https://example.com",
      }}
      theme={{
        primary: "#6366f1",
        secondary: "#eef2ff",
        text: "#f2f3fa",
        textSecondary: "#1f2937",
        textTertiary: "#64748b",
        muted: "#e2e8f0",
        background: "#03040f",
        error: "#ef4444",
      }}
    >
      
    <NextUIProvider theme={theme}>
      <App />
    </NextUIProvider>

    </CeloProvider>,
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
