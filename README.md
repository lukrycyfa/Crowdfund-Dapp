# Getting Started With CrowdFund-Dapp

- This project was created as a Dapp to a CrowdFund Tutorial. A finished work to get an idea on what the tutorial covered. [Crowdfund-Tutorial](http://place-link-here).

## Requirements

- [Node.js](https://nodejs.org/en/download)

- [Python](https://www.python.org/downloads/)

## Installations

### Install Ganche-cli

```bash
npm install ganache --global
```
### Clone The project From This Repo

```bash
git clone https://github.com/lukrycyfa/Crowdfund-Dapp.git
```
### Cd Into The Root Directory

```bash
pip install -r requirements.txt
```
### Install Contract Dependencies

```bash
brownie pm install OpenZeppelin/openzeppelin-contracts@4.8.2
```
## Testing Contract On Ganache Local Network

### Start Ganache-cli On A Separate Terminal

```bash
ganache-cli
```
### Compile, Deploy And Test The Contract On Ganache.

```bash
brownie compile
```
```bash
brownie run deploy.py
```
```bash
brownie test tests/test_OnGanache.py
```


## Testing The Contract On Celo Alfajores Network

### Add The Alfajores Network To Brownie

```bash
brownie networks add Alfajores alfajores host=https://alfajores-forno.celo-testnet.org chainid=44787 explorer=https://alfajores-blockscout.celo-testnet.org
```

### Add Your Metamask Private Key To The .env file in the root
- create a .env file in the root directory
- create three metamask accounts, export the private keys and update this keys 

```yaml
export PRIVATE_KEY_OWNER="Your Metamask Private Key One"
export PRIVATE_KEY_ACC1="Your Metamask Private Key Two"
export PRIVATE_KEY_ACC2="Your Metamask Private Key Three"
```
### Compile, Deploy And Test The Contract On Alfajores

```bash
brownie compile
```
```bash
brownie run deploy.py --network alfajores
```
```bash
brownie test tests/test_OnAlfajores.py --network alfajores
```

## Installing The React-App Dependencies
- The react-app in This Project requires api keys from pinata ipfs for storing images and metadata so before you install packages and depandencies be sure to head over to [Pinata Ipfs](https://app.pinata.cloud/). Sign up with pinata, get a secret key and an api key instructions on that are found in the doc's [Authentication](https://docs.pinata.cloud/pinata-api/authentication).

- Before installing the react-app dependecies if you will like to make use of these script's `./scripts/useFundsAlfajores.py` and `./scripts/useFundsLocal.py` you will need to go through the generative art section in the tutorial and update these keys in the .env file of the root directory and update these key's.

```yaml
export API_KEY=your api key
export SECRET_API_KEY=your api secret key
```

### Cd Into The ./crowd-fund-app Directory
- Create a .env file in the dir if it does not exist yet and populate these keys REACT_APP_API_KEY for your api key and REACT_APP_SECRET_API_KEY for your secret key.

```js
REACT_APP_API_KEY = your api key;
REACT_APP_SECRET_API_KEY = your api secret key;
```

## Install Packages and Start Server...

```bash
npm install
```

```bash
npm start
```
-- If you are not redirected to your Browser use the link provided in your terminal when the start proccess is done
and the link is provided in your terminal.
