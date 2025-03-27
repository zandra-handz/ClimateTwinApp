import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { useAppMessage } from "../../context/AppMessageContext";
import useFriends from "../../hooks/useFriends";

import { Image } from "expo-image";

import useImageUploadFunctions from "@/app/hooks/useImageUploadFunction";

import FriendsView from "@/app/components/FriendsComponents/FriendsView";
import GoToItemButton from "@/app/components/GoToItemButton";
import ActionsFooter from "@/app/components/ActionsFooter";

import useProfile from "@/app/hooks/useProfile"; 


import DataList from "../../components/Scaffolding/DataList";
import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { imageUri, handleCaptureImage, handleSelectImage } = useImageUploadFunctions();
  const { showAppMessage } = useAppMessage();
  const { friends, handleGetAllUsers, allUsers, handleSendFriendRequest } = useFriends();
  const router = useRouter();
  const { profile } = useProfile();
  

  const handlePress = () => {
    console.log("User profile handlePress pressed!");
  };
const [ image, setImage ] = useState(null);

useEffect(() => {
  if (imageUri) {
    console.log(`before decode`, imageUri);
    const encodedUri = encodeURIComponent(imageUri); // Encode it before passing
    router.push({
      pathname: "(profile)/upload",
      params: { imageUri: encodedUri }, // Pass encoded URI
    });
  }
}, [imageUri]);

 

//  let encoded = encodeURIComponent(result.assets[0].uri);
//  setImageUri(encoded);

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
          {image && (
            
                    <Image
                      // key={imageUri}
                      source={{ uri: imageUri }}
                      style={{
                        width: 300,
                        height: 300,
                        borderRadius: 30,
                        backgroundColor: "pink",
                      }}
                      contentFit="contain" //change to contain to fit whole image
                    />
                    
          )}
          <GoToItemButton label='Take pic' onPress={handleCaptureImage}/>
          <GoToItemButton label='Select upload' onPress={handleSelectImage}/>

          {profile && (
            <DataList listData={[profile]} onCardButtonPress={handlePress} />
          )}

        </View>

              <ActionsFooter
                height={66}
                onPressLeft={() => router.back()}
                labelLeft={"Back"}
                onPressRight={() => console.log('implement edit screen eventually')}
                labelRight={"Edit"}
                onPressCenter={() => router.push('/update')}
                labelCenter={"Change avatar"}
              />
      </View>
    </>
  );
};

export default index;
