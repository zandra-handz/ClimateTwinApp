import { View } from "react-native";
import React  from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { Image } from "expo-image"; 
import ComponentSpinner from "../Scaffolding/ComponentSpinner";
const INaturalistHeaderImageCard = ({
  value, 
  accessibilityLabel, 
  width=300,
  height=300,
}) => {
  const { 
    appContainerStyles
  } = useGlobalStyles();

 

 
  const imageUrl = value || null;

  return (
    <View
      style={[
        appContainerStyles.groqImageContainer, { borderRadius: 0}
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
          borderRadius: 0, 
          overflow: "hidden",
        }}
      >
        {!imageUrl && (
          <View style={{ width: width, height: height, borderRadius: 0 }}>
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
              style={{ width: width, height: height, borderRadius: 0  }}
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
