import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import SendButton from "./Scaffolding/SendButton";
import CloseButton from "./Scaffolding/CloseButton";
import Avatar from "./FriendsComponents/Avatar";

import UserListItem from "./FriendsComponents/UserListItem";

interface PickerProps {
  items: { label: string; value: string; username: string; id: string }[];
  onSelect: (selectedItem: any) => void;
}

const FriendPicker = forwardRef((props: PickerProps, ref) => {
  const { items, onSelect } = props;
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selectedValue,
    resetPicker: () => {
      setSelectedValue(null);
      setSelectedName(null);
    },
  }));

  const handleButtonPress = (data: Record<string, any>) => {
    setSelectedValue(data.id);
    setSelectedName(data.username);
    onSelect(data);
    setModalVisible(false);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View
      style={[
        appContainerStyles.pickerContainer,
        {
          backgroundColor: themeStyles.darkerBackground,
          borderRadius: 20,
        },
      ]}
    >
      {!modalVisible && (
        <View style={{ position: "absolute", right: 0, width: 60 }}>
          <SendButton
            onPress={toggleModal}
            backgroundColor={themeStyles.darkerBackground.backgroundColor}
          />
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <View
            style={{
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "40%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={[appFontStyles.dCQuestionText, themeStyles.primaryText]}
              >
                Give treasure to
              </Text>
              <CloseButton
                onPress={toggleModal}
                backgroundColor={"orange"}
              />
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <View style={{ marginVertical: 2 }}>


                  <UserListItem 
                  user={item}
                  avatar={item.friend_profile?.avatar}
                  size={30}
                  onPress={handleButtonPress}
                  /> 
                </View>
              )}
              ListEmptyComponent={
                <Text style={themeStyles.primaryText}>No friends available</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default FriendPicker;