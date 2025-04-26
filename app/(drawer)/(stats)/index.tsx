import React from "react";
import { 
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
 
import useStats from "@/app/hooks/useStats";
import StatsView from "@/app/components/StatsComponents/StatsView";
 
 
const index = () => {
  const { themeStyles,   appContainerStyles } = useGlobalStyles(); 
 
  const { stats } = useStats();
 
 
const handlePress = () => {
  console.log('Stats handlePress pressed!');

};
 
 
  
  return (
    <> 
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
        
        {stats && <StatsView listData={stats} onCardButtonPress={handlePress} />}
 
          </View>
      </View>
    </>
  );
};

export default index;
