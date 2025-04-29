import { View, Text, TouchableOpacity } from "react-native";
import React  from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router"; 

import ComponentSpinner from "../Scaffolding/ComponentSpinner";
const INaturalistImageCard = ({
  value,
  scientificLabel,
  label,
  accessibilityLabel,
  base,
  index, //to find image in groq
  query, //for groq to search
  onPress, //navs to collect screen
  width=300,
  height=300,
}) => {
  const {
    themeStyles,
    appContainerStyles, 
  } = useGlobalStyles();


  
  const handlePress = () => {
    const adjustedIndex = index + 1;
    onPress(query, base, query, adjustedIndex);

  };
 
  const imageUrl = value || null;

  return (
    <>

    {/* {imageUrl &&( */}
      
    <TouchableOpacity
      onPress={handlePress}
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
            <View
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
            </View>
            <Image
              key={imageUrl}
              source={{ uri: imageUrl, cache: "reload" }} // Force image reload
              style={{ width: width, height: height, borderRadius: 30, backgroundColor: "pink" }}
              accessibilityLabel={accessibilityLabel || "No label available"}
              contentFit="cover"
              
             // onError={() => setImgSource(require("./fallback-image.png"))}
            />
          </>
        )}
      </View>
    </TouchableOpacity>
     
    </>
  );
};
export default INaturalistImageCard;
