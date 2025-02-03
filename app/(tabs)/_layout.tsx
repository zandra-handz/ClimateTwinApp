import { Tabs } from "expo-router";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ header: () => null }} />
      <Tabs.Screen name="friends" options={{ header: () => null }} />
      <Tabs.Screen name="inbox" options={{ header: () => null }} />
      <Tabs.Screen name="treasures" options={{ header: () => null }} />
    </Tabs>
  );
};
