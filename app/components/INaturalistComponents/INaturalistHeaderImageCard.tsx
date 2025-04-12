import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router"; 
import GoToItemButton from "../GoToItemButton";

import ComponentSpinner from "../Scaffolding/ComponentSpinner";
const INaturalistHeaderImageCard = ({
  value,
  scientificLabel,
  label,
  accessibilityLabel,
  base,
  index, //to find image in groq
  query, //for groq to search
  onNavigationPress, //navs to collect screen
  width=300,
  height=300,
}) => {
  const {
    themeStyles,
    appContainerStyles,
    avgPhotoColor,
    handleAvgPhotoColor,
  } = useGlobalStyles();


 

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // handleAvgPhotoColor(null);
      };
    }, [])
  );



  const debug = false;
  const imageUrl = value || null;

  return (
    <View
      style={[
        appContainerStyles.groqImageContainer, 
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 0,
          paddingVertical: 0,
          height: height,
          width: width,
          justifyContent: "center",
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        {!imageUrl && (
          <View style={{ width: width, height: height, borderRadius: 30 }}>
            <ComponentSpinner showSpinner={true} />
          </View>
        )}

        {imageUrl && (
          <>
            {/* <View
              style={{
                position: "absolute",
                backgroundColor: themeStyles.darkestBackground.backgroundColor,
                width: "100%",
                paddingHorizontal: 10,
                height: 60,
                zIndex: 1000,
                justifyContent: "center",
                alignItems: "center",
                bottom: 0,
                right: 0,
              }}
            >
                
              <Text style={themeStyles.primaryText}>
                {label} ({scientificLabel})
              </Text>
            </View> */}
            <Image
              key={imageUrl}
              source={{ uri: imageUrl, cache: "reload" }} // Force image reload
              style={{ width: width, height: height, borderRadius: 30 }}
              accessibilityLabel={accessibilityLabel || "No label available"}
              contentFit="cover"
              //onError={() => setImgSource(require("./fallback-image.png"))}
            />
          </>
        )}
      </View>
    </View>
  );
};
export default INaturalistHeaderImageCard;
