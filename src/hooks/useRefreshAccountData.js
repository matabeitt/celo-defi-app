import delay from 'delay';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import NetworkTypes from '../helpers/networkTypes';
import { explorerInit } from '../redux/explorer';
import { uniqueTokensRefreshState } from '../redux/uniqueTokens';
import { updatePositions } from '../redux/usersPositions';
import { walletConnectLoadState } from '../redux/walletconnect';
import { fetchWalletNames } from '../redux/wallets';
import useAccountSettings from './useAccountSettings';
import useSavingsAccount from './useSavingsAccount';
import logger from 'logger';

export default function useRefreshAccountData() {
  const dispatch = useDispatch();
  const { network } = useAccountSettings();
  const { refetchSavings } = useSavingsAccount();

  const refreshAccountData = useCallback(async () => {
    // Refresh unique tokens for Rinkeby
    if (network === NetworkTypes.rinkeby) {
      const getUniqueTokens = dispatch(uniqueTokensRefreshState());
      return Promise.all([delay(1250), getUniqueTokens]);
    }

    // Nothing to refresh for other testnets
    if (network !== NetworkTypes.mainnet) {
      return Promise.all([delay(1250)]);
    }

    try {
      const getWalletNames = dispatch(fetchWalletNames());
      const getUniqueTokens = dispatch(uniqueTokensRefreshState());
      const explorer = dispatch(explorerInit());
      const wc = dispatch(walletConnectLoadState());
      const uniswapPositions = dispatch(updatePositions());
      return Promise.all([
        delay(1250), // minimum duration we want the "Pull to Refresh" animation to last
        getWalletNames,
        getUniqueTokens,
        refetchSavings(true),
        explorer,
        wc,
        uniswapPositions,
      ]);
    } catch (error) {
      logger.log('Error refreshing data', error);
      console.log(error);
      throw error;
    }
  }, [dispatch, network, refetchSavings]);

  return refreshAccountData;
}
