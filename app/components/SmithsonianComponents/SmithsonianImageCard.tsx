import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";

import ComponentSpinner from "../Scaffolding/ComponentSpinner";
const SmithsonianImageCard =  ({  value, accessibilityLabel, avgColor }) => {
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
        {debug && (
           
        <View style={{position: 'absolute', bottom: 0, left: 0, zIndex: 1000, right: 0, width: '100%', backgroundColor: avgPhotoColor, height: 40}}>
        
            </View>
             
        )}
       <View
         style={{
           flexDirection: "row",
           paddingHorizontal: 0,
           paddingVertical: 0, 
 
           width: "100%",
           justifyContent: "center",
         }}
       >

        {!imageUrl && (
            <View
            style={{ width: 500, height: 300, borderRadius: 30 }}>
                <ComponentSpinner showSpinner={true}/>

            </View>
        )}
        
        {imageUrl  && (
           <Image
             key={imageUrl }
             source={{ uri: imageUrl , cache: 'reload' }}  // Force image reload
             style={{ width: 500, height: 300, borderRadius: 30 }}
             accessibilityLabel={accessibilityLabel || 'No label available'}
             contentFit="cover"   
             //onError={() => setImgSource(require("./fallback-image.png"))}
           />
         )}
       </View>
     </View>
   );
 };
export default SmithsonianImageCard