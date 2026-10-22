import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View, ViewToken } from 'react-native';
import { colors } from '../../theme/colors';
import { vibesApi } from '../../api/vibes';
import { Vibe } from '../../types/models';
import { VibeCard } from '../../components/VibeCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function VibesScreen() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    vibesApi
      .forYou()
      .then(setVibes)
      .catch(() => setVibes([]));
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={vibes}
        keyExtractor={(v) => v.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        renderItem={({ item, index }) => <VibeCard vibe={item} isActive={index === activeIndex} />}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        ListEmptyComponent={<View style={styles.empty} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: { height: SCREEN_HEIGHT, backgroundColor: colors.background },
});
