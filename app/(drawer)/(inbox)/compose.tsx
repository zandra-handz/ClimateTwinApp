import { View, Text, Button } from 'react-native';
import React, { useRef, useState } from 'react';
import ActionsFooter from "@/app/components/ActionsFooter";
import { StatusBar } from "expo-status-bar";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useAppMessage } from "../../context/AppMessageContext";
import { useRouter } from 'expo-router';
import useFriends from '../../hooks/useFriends';
import useInbox from "../../hooks/useInbox";
import Picker from '@/app/components/Picker';

const Compose = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { friends, friendsDropDown } = useFriends(); // Assuming friendsDropDown is already a list of { label, value }
  const { showAppMessage } = useAppMessage();
  const router = useRouter();
  const { inboxItems, handleGetInboxItem, viewingInboxItem, viewingMessage } = useInbox();
  
  // State to hold the selected friend
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  
  // Handle selection of friend
  const handleFriendSelect = (selectedValue: string) => {
    setSelectedFriend(selectedValue);  // Set the selected friend's value (ID or nickname)
    console.log("Selected Friend:", selectedValue);
  };

  return (
    <>
      <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      />
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {/* Display Picker component for selecting a friend */}
          <Picker
            items={friends}  // Passing label/value pairs (friendsDropDown)
            onSelect={handleFriendSelect}  // Handling the selection
          />
          
          {/* Optionally, display the selected friend */}
          {selectedFriend && <Text>Selected Friend: {selectedFriend}</Text>}
        </View>

        <ActionsFooter
          onPressLeft={() => router.replace('(inbox)')}
          labelLeft={"Cancel"}
          onPressRight={() => console.log("Right footer button pressed!")}
          labelRight={"Send"}
        />
      </View>
    </>
  );
}

export default Compose;
