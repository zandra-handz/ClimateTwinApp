 import React, { useEffect, useCallback } from 'react' 
 import { View, Text } from 'react-native'
 import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
 import ActionsFooter from "@/app/components/ActionsFooter";
 import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"; 
 import DataList from '@/app/components/Scaffolding/DataList';


 import useTreasures from '@/app/hooks/useTreasures';
 
 
 const treasure_history = () => {
      const { id } = useLocalSearchParams<{ id: string }>();
      const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
      const { handleGetOwnerChangeRecords, testData } = useTreasures();
      const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
     const router = useRouter(); 
 

     useFocusEffect(
      useCallback(() => {
        handleGetOwnerChangeRecords(id);
        console.log("Screen is focused");
    
        return () => {
          // Cleanup code here runs when the screen is unfocused
          console.log("Screen is unfocused");
        };
      }, [])
    );
    

     const handleEmptyPress = () => {
        console.log(`handleEmptyPress`);

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
         {testData && (
             <DataList listData={testData} onCardButtonPress={handleEmptyPress} />
           )}
  
         </View>
         
               <ActionsFooter 
                 onPressLeft={() => router.back()}
                 labelLeft={"Back"}
                 // onPressRight={() => router.push('search/')}
                 // labelRight={"Search"}
                 // onPressCenter={isMinimized ? handleFullScreenToggle : null}
                 // labelCenter={"Groq"}
               />
       </View>
     </>
   )
 }
 
 export default treasure_history