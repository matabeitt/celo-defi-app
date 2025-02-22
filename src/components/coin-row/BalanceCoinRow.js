import { get } from 'lodash';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Animated from 'react-native-reanimated';
import { View } from 'react-primitives';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { ButtonPressAnimation } from '../animations';
import { initialChartExpandedStateSheetHeight } from '../expanded-state/asset/ChartExpandedState';
import { Column, FlexItem, Row } from '../layout';
import BalanceText from './BalanceText';
import BottomRowText from './BottomRowText';
import CoinCheckButton from './CoinCheckButton';
import CoinName from './CoinName';
import CoinRow from './CoinRow';
import { buildAssetUniqueIdentifier } from '@rainbow-me/helpers/assets';
import { useCoinListEdited } from '@rainbow-me/hooks';
import { useCoinListEditedValue } from '@rainbow-me/hooks/useCoinListEdited';
import {
  pushSelectedCoin,
  removeSelectedCoin,
} from '@rainbow-me/redux/editOptions';
import { isNewValueForObjectPaths, isNewValueForPath } from '@rainbow-me/utils';

const editTranslateOffset = 37;

const formatPercentageString = percentString =>
  percentString ? percentString.split('-').join('- ') : '-';

const BalanceCoinRowCoinCheckButton = styled(CoinCheckButton).attrs({
  isAbsolute: true,
})`
  top: ${({ top }) => top};
`;

const PercentageText = styled(BottomRowText).attrs({
  align: 'right',
})`
  color: ${({ isPositive, theme: { colors } }) =>
    isPositive ? colors.green : colors.alpha(colors.blueGreyDark, 0.5)};
`;

const BottomRowContainer = ios
  ? Fragment
  : styled(Row).attrs({ marginBottom: 10, marginTop: -10 })``;

const TopRowContainer = ios
  ? Fragment
  : styled(Row).attrs({
      align: 'flex-start',
      justify: 'flex-start',
      marginTop: 0,
    })``;

const PriceContainer = ios
  ? View
  : styled(View)`
      margin-top: -3;
      margin-bottom: 3;
    `;

const BottomRow = ({ balance, native }) => {
  const { colors } = useTheme();
  const percentChange = get(native, 'change');
  const percentageChangeDisplay = formatPercentageString(percentChange);

  const isPositive = percentChange && percentageChangeDisplay.charAt(0) !== '-';

  return (
    <BottomRowContainer>
      <FlexItem flex={1}>
        <BottomRowText color={colors.alpha(colors.blueGreyDark, 0.5)}>
          {get(balance, 'display', '')}
        </BottomRowText>
      </FlexItem>
      <View>
        <PercentageText isPositive={isPositive}>
          {percentageChangeDisplay}
        </PercentageText>
      </View>
    </BottomRowContainer>
  );
};

const TopRow = ({ name, native, nativeCurrencySymbol }) => {
  const nativeDisplay = get(native, 'balance.display');
  const { colors } = useTheme();

  return (
    <TopRowContainer>
      <FlexItem flex={1}>
        <CoinName>{name}</CoinName>
      </FlexItem>
      <PriceContainer>
        <BalanceText
          color={nativeDisplay ? colors.dark : colors.blueGreyLight}
          numberOfLines={1}
        >
          {nativeDisplay || `${nativeCurrencySymbol}0.00`}
        </BalanceText>
      </PriceContainer>
    </TopRowContainer>
  );
};

const BalanceCoinRow = ({
  containerStyles,
  isFirstCoinRow,
  item,
  onPress,
  pushSelectedCoin,
  recentlyPinnedCount,
  removeSelectedCoin,
  ...props
}) => {
  const [toggle, setToggle] = useState(false);
  const [previousPinned, setPreviousPinned] = useState(0);
  const { isCoinListEdited } = useCoinListEdited();
  const isCoinListEditedValue = useCoinListEditedValue();
  useEffect(() => {
    if (toggle && (recentlyPinnedCount > previousPinned || !isCoinListEdited)) {
      setPreviousPinned(recentlyPinnedCount);
      setToggle(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCoinListEdited, recentlyPinnedCount]);

  const handleEditModePress = useCallback(() => {
    if (toggle) {
      removeSelectedCoin(item.uniqueId);
    } else {
      pushSelectedCoin(item.uniqueId);
    }
    setToggle(!toggle);
  }, [item.uniqueId, pushSelectedCoin, removeSelectedCoin, setToggle, toggle]);

  const handlePress = useCallback(() => {
    if (isCoinListEdited) {
      handleEditModePress();
    } else {
      onPress?.(item, {
        longFormHeight: initialChartExpandedStateSheetHeight,
      });
    }
  }, [handleEditModePress, isCoinListEdited, item, onPress]);

  return (
    <Column flex={1} justify={isFirstCoinRow ? 'end' : 'start'}>
      <Animated.View
        style={{
          paddingLeft: Animated.multiply(
            editTranslateOffset,
            isCoinListEditedValue
          ),
        }}
      >
        <ButtonPressAnimation
          onPress={handlePress}
          scaleTo={0.96}
          testID={`balance-coin-row-${item.name}`}
        >
          <Animated.View>
            <CoinRow
              bottomRowRender={BottomRow}
              containerStyles={containerStyles}
              isFirstCoinRow={isFirstCoinRow}
              onPress={handlePress}
              topRowRender={TopRow}
              {...item}
              {...props}
            />
          </Animated.View>
        </ButtonPressAnimation>
      </Animated.View>
      <Animated.View
        style={{
          marginLeft: Animated.multiply(
            -editTranslateOffset * 1.5,
            Animated.sub(1, isCoinListEditedValue)
          ),
          position: 'absolute',
        }}
      >
        <BalanceCoinRowCoinCheckButton
          isHidden={item.isHidden}
          isPinned={item.isPinned}
          onPress={handleEditModePress}
          pointerEvents={isCoinListEdited ? 'auto' : 'none'}
          toggle={toggle}
          top={isFirstCoinRow ? -50 : 9}
        />
      </Animated.View>
    </Column>
  );
};

const arePropsEqual = (prev, next) => {
  const itemIdentifier = buildAssetUniqueIdentifier(prev.item);
  const nextItemIdentifier = buildAssetUniqueIdentifier(next.item);

  const isNewItem = itemIdentifier === nextItemIdentifier;

  const isNewRecentlyPinnedCount =
    !isNewValueForPath(prev, next, 'recentlyPinnedCount') &&
    (get(next, 'item.isPinned', true) || get(next, 'item.isHidden', true));

  return (
    isNewItem &&
    isNewRecentlyPinnedCount &&
    !isNewValueForObjectPaths(prev, next, [
      'isCoinListEdited',
      'isFirstCoinRow',
      'item.isHidden',
      'item.isPinned',
      'openSmallBalances',
    ])
  );
};

const MemoizedBalanceCoinRow = React.memo(BalanceCoinRow, arePropsEqual);

export default connect(
  ({
    editOptions: { recentlyPinnedCount },
    openStateSettings: { openSmallBalances },
  }) => ({
    openSmallBalances,
    recentlyPinnedCount,
  }),
  {
    pushSelectedCoin,
    removeSelectedCoin,
  }
)(MemoizedBalanceCoinRow);
