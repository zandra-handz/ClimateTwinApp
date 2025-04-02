import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useAppMessage } from "@/app/context/AppMessageContext";
import useProfile from "@/app/hooks/useProfile";
import { useUser } from "@/app/context/UserContext";
import { Image } from "expo-image";
import useImageUploadFunctions from "@/app/hooks/useImageUploadFunction";
import React, { useState, useEffect } from "react";
import ActionsFooter from "@/app/components/ActionsFooter";
//test
import * as FileSystem from "expo-file-system"; 

const upload = () => {
  const { handleUploadAvatar, uploadAvatarMutation } = useProfile();
  const { showAppMessage } = useAppMessage();
  const { user } = useUser();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { resizeImage } = useImageUploadFunctions();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const decodedUri = decodeURIComponent(imageUri);
  const [image, setImage] = useState(null);
  const router = useRouter();

  // console.log(`decoded`, decodedUri);

  //   useEffect(() => {
  //     if (imageUri) {
  //       FileSystem.getInfoAsync(imageUri).then(info => {
  //         console.log("File exists:", info.exists);
  //         console.log("File size:", info.size);
  //       });
  //       console.log(imageUri);
  //       setImage(imageUri);
  //     }
  //   }, [imageUri]);

  //console.log(imageUri);

  




const handleSave = async () => {   

  if (imageUri && user?.id) {
    try { 
      
      const manipResult = await resizeImage(imageUri); 
      const formData = new FormData();
      const fileType = manipResult.uri.split('.').pop();  

      formData.append('avatar', {
        uri: manipResult.uri,
        name: `image.${fileType}`,
        type: `image/${fileType}`,
      });  

    formData.append('user', user?.id);
    // console.log(`formData: `, formData);

      handleUploadAvatar(formData);

    } catch (error) {
      console.error('Error saving image:', error); 
    }  
  }
 
};
  useEffect(() => {
    if (uploadAvatarMutation.isSuccess) {
      showAppMessage(true, null, "New icon set!");
      router.back();
    }

  }, [uploadAvatarMutation.isSuccess]);


  useEffect(() => {
    if (uploadAvatarMutation.isError) {
      showAppMessage(true, null, "Oops! Icon not uploaded.");
      router.back();
    }

  }, [uploadAvatarMutation.isError]);

  return (
    <View
      style={[
        appContainerStyles.screenContainer,
        themeStyles.primaryBackground,
        { paddingTop: 10 },
      ]}
    >
      <View style={[appContainerStyles.innerFlexStartContainer]}>
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 0,
            paddingVertical: 0,
            borderRadius: 300 / 2,
            alignItems: "center",
            alignContent: "center",

            width: "100%",
            justifyContent: "center",
          }}
        >
          <Image
            // key={imageUri}
            source={{ uri: imageUri }}
            style={{
              width: 300,
              height: 300,
              borderRadius: 300 / 2,
              backgroundColor: "pink",
            }}
            contentFit="cover" //change to contain to fit whole image
          />
 
        </View>
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

export default upload;
