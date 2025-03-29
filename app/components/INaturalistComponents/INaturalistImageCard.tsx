import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";

import ComponentSpinner from "../Scaffolding/ComponentSpinner";
const INaturalistImageCard =  ({  value, scientificLabel, label, accessibilityLabel  }) => {
  const { themeStyles,  appContainerStyles, avgPhotoColor, handleAvgPhotoColor } = useGlobalStyles();



      useFocusEffect(
        React.useCallback(() => {
        
          return () => {
           // handleAvgPhotoColor(null);  
          };
        }, [ ])
      );
 
  const debug = false;
   const imageUrl = value || null;

   return (
     <View
       style={[
         appContainerStyles.groqImageContainer,
        // themeStyles.darkestBackground,
       ]}
     > 
       <View
         style={{
           flexDirection: "row",
           paddingHorizontal: 0,
           paddingVertical: 0, 
 height: 300,
           width: 300,
           justifyContent: "center",
           borderRadius: 30,
           overflow: 'hidden',
         }}
       >

        {!imageUrl  && (
            <View
            style={{ width: 300, height: 300, borderRadius: 30 }}>
                <ComponentSpinner showSpinner={true}/>

            </View>
        )}
        
        {imageUrl  && (
            <>
            <View style={{position: 'absolute', backgroundColor: themeStyles.darkestBackground.backgroundColor, width: '100%', paddingHorizontal: 4, height: 60, zIndex: 1000, justifyContent: 'center', alignItems: 'center', bottom: 0, right: 0}}>
                <Text>{label} ({scientificLabel})</Text>
            </View>
           <Image
             key={imageUrl }
             source={{ uri: imageUrl , cache: 'reload' }}  // Force image reload
             style={{ width: 300, height: 300, borderRadius: 30 }}
             accessibilityLabel={accessibilityLabel || 'No label available'}
             contentFit="cover"   
             //onError={() => setImgSource(require("./fallback-image.png"))}
           />
           
           </>
         )}
       </View>
     </View>
   );
 };
export default INaturalistImageCard