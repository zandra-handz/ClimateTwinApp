import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import useFriends from "../../hooks/useFriends";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import Avatar from "@/app/components/FriendsComponents/Avatar";

import useDateTimeFunctions from "@/app/hooks/useDateTimeFunctions";

import CuteDetailBox from "@/app/components/CuteDetailBox";

import useImageUploadFunctions from "@/app/hooks/useImageUploadFunction";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import ActionsFooter from "@/app/components/ActionsFooter";

import useProfile from "@/app/hooks/useProfile";

import DataList from "../../components/Scaffolding/DataList";
import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { imageUri, handleCaptureImage, handleSelectImage } =
    useImageUploadFunctions();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const { showAppMessage } = useAppMessage();
  const { friends, handleGetAllUsers, allUsers, handleSendFriendRequest } =
    useFriends();
  const router = useRouter();
  const { profile, avatar } = useProfile();
  const { user } = useUser();

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

  const bio = profile?.bio || null;

  const handleEditBio = () => {
    router.push({
      pathname: "(profile)/edit",
      params: { textToEdit: bio },
    });
  };

  const findTotalVisits = (
    <>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsBoldText,
          themeStyles.primaryText,
        ]}
      >
        Trips taken:
      </Text>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        {profile?.total_visits || ""}{" "}
      </Text>
    </>
  );

  const findLastVisit = (
    <>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsBoldText,
          themeStyles.primaryText,
        ]}
      >
        Last trip:
      </Text>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        {profile?.most_recent_visit?.location_name || ""},{" "}
        {formatUTCToMonthDayYear(profile?.most_recent_visit?.visited_on) ||
          "No trips"}
      </Text>
    </>
  );

  const findCreatedOn = (
    <>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsBoldText,
          themeStyles.primaryText,
        ]}
      >
        Account created:
      </Text>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        {formatUTCToMonthDayYear(user?.created_on) || "No trips"}
      </Text>
    </>
  );

  return (
    <>
   
      
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        {!profile && (
          <ComponentSpinner showSpinner={true} />
        )}
         {profile && (
          <>
        <ScrollView contentContainerStyle={[appContainerStyles.innerFlexStartContainer]}>
          <View style={{ width: "100%", height: 170 }}>
            {avatar && <Avatar image={avatar} size={140} />}
          </View>
          <View style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          width: "100%",
                          position: "absolute",
                        
                          top: 160,
          }}>
            <Text style={[appFontStyles.profileHeaderText, themeStyles.primaryText]}>{user.username}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
              position: "absolute",
              right: 10,
              top: 10,
            }}
          >
            <View style={{ marginHorizontal: 3 }}>
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
                  // onPress={handleCaptureImage}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 3 }}>
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
            <>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity
                  style={[
                    appContainerStyles.floatingIconButtonContainer,
                    { borderColor: themeStyles.primaryText.color },
                  ]}
                  onPress={handleEditBio}
                >
                  <Feather
                    name="edit"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={themeStyles.exploreTabBarText.color}
                    // onPress={handleCaptureImage}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  appContainerStyles.itemDescriptionContainer,
                  themeStyles.darkestBackground,
                ]}
              >
                <Text
                  style={[
                    appFontStyles.itemDescriptionText,
                    themeStyles.primaryText,
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>Bio: </Text>
                  {profile.bio || "No bio"}
                </Text>
              </View>
              <View style={{ marginVertical: 3 }}>
                <CuteDetailBox
                  //iconOne={"heart"}
                  iconTwo={"map"}
                  message={findTotalVisits}
                />
              </View>
              <View style={{ marginVertical: 3 }}>
                <CuteDetailBox
                  iconOne={"heart"}
                  //iconTwo={"map"}
                  message={findLastVisit}
                />
              </View>
              <View style={{ marginVertical: 3 }}>
                <CuteDetailBox
                  iconOne={"heart"}
                  //iconTwo={"map"}
                  message={findCreatedOn}
                />
              </View>
            
  
        


              {/* <DataList listData={[profile]} onCardButtonPress={handlePress} />
               */}

            </>
          )}
          

        </ScrollView>
        <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                  position: "absolute",
                  right: 10,
                  bottom: 90,
                }}
              >
                <View style={{ marginHorizontal: 3 }}>
                  <TouchableOpacity
                    style={[
                      appContainerStyles.floatingIconButtonContainer,
                      { borderColor: themeStyles.primaryText.color },
                    ]}
                    onPress={handleCaptureImage}
                  >
                    <Feather
                      name="delete"
                      size={appFontStyles.exploreTabBarIcon.width}
                      color={themeStyles.exploreTabBarText.color}
                      // onPress={handleCaptureImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              

        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"} 
        />
        </>
      )}
      </View>
      
   
    </>
  );
};

export default index;
