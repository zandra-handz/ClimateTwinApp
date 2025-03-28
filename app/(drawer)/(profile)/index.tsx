import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { useAppMessage } from "../../context/AppMessageContext";
import useFriends from "../../hooks/useFriends";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import Avatar from "@/app/components/FriendsComponents/Avatar";

import useImageUploadFunctions from "@/app/hooks/useImageUploadFunction";

import FriendsView from "@/app/components/FriendsComponents/FriendsView";
import GoToItemButton from "@/app/components/GoToItemButton";
import ActionsFooter from "@/app/components/ActionsFooter";

import useProfile from "@/app/hooks/useProfile";

import DataList from "../../components/Scaffolding/DataList";
import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { imageUri, handleCaptureImage, handleSelectImage } =
    useImageUploadFunctions();
  const { showAppMessage } = useAppMessage();
  const { friends, handleGetAllUsers, allUsers, handleSendFriendRequest } =
    useFriends();
  const router = useRouter();
  const { profile, avatar } = useProfile();

  const handlePress = () => {
    console.log("User profile handlePress pressed!");
  };
  const [image, setImage] = useState(null);

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
          {avatar && <Avatar image={avatar} size={140} />}
          <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '100%'}}>
           <View style={{marginHorizontal: 3}}>
            
          <TouchableOpacity
            style={[
              appContainerStyles.floatingIconButtonContainer,
              { borderColor: themeStyles.primaryText.color },
            ]}
            onPress={handleCaptureImage}
          >
            <Feather
              name="camera"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              //  onPress={handleCaptureImage}
            />
          </TouchableOpacity>
          
          </View>
          <View style={{marginHorizontal: 3}}>
            
          <TouchableOpacity
            style={[
              appContainerStyles.floatingIconButtonContainer,
              { borderColor: themeStyles.primaryText.color },
            ]}
            onPress={handleSelectImage}
          >
            <Feather
              name="upload"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
            />
          </TouchableOpacity>
          </View>
           
          </View> 
          {profile && (
            <DataList listData={[profile]} onCardButtonPress={handlePress} />
          )}
        </View>

        <ActionsFooter
          height={66}
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressRight={() => console.log("implement edit screen eventually")}
          labelRight={"Edit"}
          onPressCenter={() => router.push("/update")}
          labelCenter={"Change avatar"}
        />
      </View>
    </>
  );
};

export default index;
