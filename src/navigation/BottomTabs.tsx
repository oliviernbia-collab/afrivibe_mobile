import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { VibesScreen } from '../screens/vibes/VibesScreen';
import { CreateScreen } from '../screens/feed/CreateScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

export type BottomTabParamList = {
  Accueil: undefined;
  Vibes: undefined;
  Créer: undefined;
  Portefeuille: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const ICONS: Record<keyof BottomTabParamList, keyof typeof FontAwesome5.glyphMap> = {
  Accueil: 'home',
  Vibes: 'play-circle',
  Créer: 'plus-circle',
  Portefeuille: 'wallet',
  Profil: 'user-circle',
};

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name={ICONS[route.name as keyof BottomTabParamList]} color={color} size={size ?? 20} />
        ),
      })}
    >
      <Tab.Screen name="Accueil" component={FeedScreen} />
      <Tab.Screen name="Vibes" component={VibesScreen} />
      <Tab.Screen name="Créer" component={CreateScreen} />
      <Tab.Screen name="Portefeuille" component={WalletScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
