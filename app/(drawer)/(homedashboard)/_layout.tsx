import { Tabs } from "expo-router";
import ExploreTabBar from "../../components/ExploreTabsComponents/ExploreTabBar";
 import SafeView from "@/app/components/SafeView";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
 import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
export default () => {
  const { themeStyles } = useGlobalStyles();
  const { settingsAreLoading } = useUserSettings();
  return (
    <>
      <SafeView style={{flex: 1, backgroundColor: themeStyles.primaryBackground.backgroundColor}}>
      
      
      <ComponentSpinner
        backgroundColor={themeStyles.primaryBackground.backgroundColor}
        spinnerType={"pulse"}
        isInitAndSocketSpinner={true}
      /> 

 
      <Tabs
        screenOptions={{
          headerShown: false,
          header: () => null,
        }}
        tabBar={(props) => <ExploreTabBar {...props} />}
      >
        <Tabs.Screen name="index" />
      </Tabs>
      
      </SafeView>
    </>
  );
};
