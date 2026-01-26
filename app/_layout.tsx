import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide tab bar for now
      }}
    >
      <Tabs.Screen name="index" />
    </Tabs>
  );
}