import { Tabs } from "expo-router";

export default () => {
  return (
    <Tabs>
            <Tabs.Screen name="index" options={{ header: () => null }}>
        {/* Nested tabs inside home */}
        {/* {() => (
          // <Tabs>
          //   <Tabs.Screen name="homeMain" options={{ header: () => null }} />
          //   <Tabs.Screen name="homeDetails" options={{ header: () => null }} />
          // </Tabs>
        )} */}
      </Tabs.Screen>

      {/* <Tabs.Screen name="friends" options={{ header: () => null }} />
      <Tabs.Screen name="inbox" options={{ header: () => null }} />
      <Tabs.Screen name="treasures" options={{ header: () => null }} /> */}
    </Tabs>
  );
};
