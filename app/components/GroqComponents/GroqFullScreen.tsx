import { Animated, View, Text, ScrollView } from "react-native";
import React from "react"; 
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import SingleImagePanel from "../SingleImagePanel";
import GroqImageCard from "./GroqImageCard";
import { SafeAreaView } from "react-native-safe-area-context";
import GoToItemButton from "../GoToItemButton";

const GroqFullScreen = ({ label, value, opacity, images, fullScreenToggle, isMinimized }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  return (
    <Animated.View
      style={[
        appContainerStyles.groqScrollFullScreenContainer,
        themeStyles.darkerBackground, { height: !isMinimized? 680 : 140, opacity: opacity || 1}
      ]}
    >
      {/* <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          paddingHorizontal: 10,
          paddingVertical: 8,
          
          width: "100%",
          justifyContent: "flex-start",
        }}
      > */}
              <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 10,
          paddingVertical: 8,
          
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
                {images && (
        <View style={{width: '100%', flex: 1, marginBottom: 10, flexDirection: 'row', justifyContent: 'center', height: 'auto'}}>
          
        <GroqImageCard value={images[0]}/>
        </View>
      )}
 <View style={{flexDirection: 'row', width: '100%', height: 90, justifyContent: 'center'}}>
          
      <GoToItemButton onPress={() => fullScreenToggle()} label={"Found a treasure here?"} />      
      
      
  
 </View>
 <View style={{height: 400, flexGrow: 1, width: '100%'}}>
 <ScrollView>
          <View style={appContainerStyles.groqHeaderRow}>
 
        <Text style={[themeStyles.primaryText, appFontStyles.groqHeaderText]}>
            
            
          {" "}
          {label}
        </Text>

        
        </View>
        <Text selectable={true} style={[themeStyles.primaryText, appFontStyles.groqResponseText]}>{value}</Text>

      
  
 </ScrollView>
 
  
 </View>
      </View>
    </Animated.View>
  );
};

export default GroqFullScreen;
