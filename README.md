# Arco Iris
This project was built for the Celo De-Fi For the People 2021 Hackathon.
https://devpost.com/software/cryptic-exchange/edit

## Inspiration

We are inspired by people and their resilience in the face of discrimination and deceit by essential banking services in Trinidad and Tobago. We want to help those people become financially-free with the help of Celo.

## What it does

It allows Celo holders or Valora users to easily access Celo DeFi protocols in a truly mobile way. We will use it to onboard locals into crypto via the Celo network to gain exposure in a cost effective way to multiple DeFi assets and protocols on the Celo Network

## How we built it

We forked the popular Rainbow Wallet, replaced Uniswap with Ubeswap and made its native blockchain, Celo Network.

## Challenges we ran into

Adopting the Rainbow Wallet, getting it running locally and configuring it proved to be a huge challenge due to its comprehensive codebase.

Switching the native blockchain from Ethereum to Celo and changing native tokens, gas stations, market prices, etc.

## Accomplishments that we're proud of

Running the wallet locally, querying the Celo Blockchain and swapping out the relevant SDKs for UbeSwap...working towards our first successful Celo Mainnet transaction.

Deployed the balance checker smart contract for more efficient token balance calls on the Celo Mainnet.

Working together as a team to build our first blockchain application while all having full time jobs and 75% of the team had no prior experience in blockchain development.

## What we learned

How powerful a solution like a truly mobile DeFi app can be for users in emerging markets because of low cost transaction fees and exposure to bridged / wrapped assets like WBTC and optics tokens. 

Building solutions to solve real problems is hard but worth it. We're also appreciating just how much organisations like Celo who exist outside our country can actually help with the solutions we're building locally.

## What's next for Arco Iris

Integrate DAppKit/WalletConnect for Celo DeFi users, using Valora as their main wallet.

Allow Valora users to "watch" their addresses, view their DeFi holdings and sign transactions via a mobile interface.

Launch v0.1 of the app and get Alpha users!

This project is a fork of [rainbow-me/rainbow](https://github.com/rainbow-me/rainbow). The key differences are:
* Integrates with CELO Mainnet as the native blockchain network.
* Leverages Ubeswap as the primary de-fi swap platform

---

## Installation

### Linux

#### Android

The dependencies are: `Android SDK, Node v14, Yarn`

> Before attempting to develop and build a React Native application targetted for Android SDK, you must install Android Studio and Android Studio Platform Tools.

```sh
# Install system dependencies
sudo apt install libsecret-tools watchman
```

```sh
git clone ... <dir name>
```

```sh
# Project requires Node v14
nvm install 14 && nvm use 14
# Project requires Yarn
npm install -g yarn
# Install project dependencies
yarn setup
```

#### iOS

Instructions pending.

### MacOS

This section will run through the installation of project dependencies and setup for an Intel system. 

> For information on setting up using Apple Silicon, please reach out to the development team.

#### Android

Instructions pending.

#### iOS

Instructions pending.

---

## Deployment

Instructions pending

---
