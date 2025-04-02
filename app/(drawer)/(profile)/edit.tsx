import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useAppMessage } from "@/app/context/AppMessageContext";
import useProfile from "@/app/hooks/useProfile";
import { useUser } from "@/app/context/UserContext";
import { Image } from "expo-image";
import useImageUploadFunctions from "@/app/hooks/useImageUploadFunction";
import React, { useState, useEffect, useRef } from "react";
import ActionsFooter from "@/app/components/ActionsFooter";
//test
import * as FileSystem from "expo-file-system";
import TextInputBlock from "@/app/components/TextInputBlock";

// title = "title",
// mountingText = "Start typing",
// onTextChange,
// helperText,
// autoFocus = true,
// width = "90%",
// height = "60%",
// multiline = true,
// onSubmitEditing,

const edit = () => {
  const { textToEdit } = useLocalSearchParams<{ textToEdit: string }>();
  const { handleUpdateProfile, updateProfileMutation } = useProfile();
  const { showAppMessage } = useAppMessage();
  const { user } = useUser();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { resizeImage } = useImageUploadFunctions();
  const router = useRouter();

  const textToEditRef = useRef(null);

  const updateTextToEditString = (text) => {
    if (textToEditRef && textToEditRef.current) {
      // console.log(text);
      textToEditRef.current.setText(text);
    }
  };

  //I don't think we need to, since it re-fills the block every time we nav here
  //since the text is in the params
  const resetBlock = () => {
    if (textToEditRef && textToEditRef.current) {
      textToEditRef.current.clearText();
    }
  };

  const handleSave = async () => {
    if (textToEditRef.current && user?.id) {
      try {
        let newBio = textToEditRef.current.getText();

        const formData = new FormData();
        formData.append("user", user?.id);
        formData.append("bio", newBio);

        handleUpdateProfile(formData);
        //handleUpdateProfile({ bio: newBio });
      } catch (error) {
        console.error("Error updating bio:", error);
      }
    }
  };
  useEffect(() => {
    if (updateProfileMutation.isSuccess) {
      showAppMessage(true, null, "Bio updated!");
      router.back();
    }
  }, [updateProfileMutation.isSuccess]);

  useEffect(() => {
    if (updateProfileMutation.isError) {
      showAppMessage(true, null, "Oops! Bio not updated.");
      router.back();
    }
  }, [updateProfileMutation.isError]);

  return (
    <View
      style={[
        appContainerStyles.screenContainer,
        themeStyles.primaryBackground,
        { paddingTop: 10 },
      ]}
    >
      <View style={[appContainerStyles.innerFlexStartContainer]}>
        <TextInputBlock
          ref={textToEditRef}
          title={"Edit bio"}
          helperText={null}
          mountingText={textToEdit}
          onTextChange={updateTextToEditString}
          multiline={true}
          height={"50%"}
          onSubmitEditing={handleSave}
        />
      </View>
      <ActionsFooter
        onPressLeft={() => router.back()}
        labelLeft={"Back"}
        onPressRight={handleSave}
        labelRight={"Save"}
      />
    </View>
  );
};

export default edit;
