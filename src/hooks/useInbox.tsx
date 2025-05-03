import React, { useMemo, useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useUserSettings } from "../context/UserSettingsContext";
import { getInboxItems, getInboxItem, acceptTreasureGift } from "../calls/apicalls";

// Define types for inbox items and messages

interface ContentObject {
  id: number;
  special_type: string;
  message: string;
  recipient: number;
  treasure_descriptor?: string;
  treasure_description?: string;
}

interface Message {
  id: number;
  sender: number;
  recipient: number;
  content: string;
  created_on: string;
  content_object: ContentObject;
}

interface InboxItem {
  id: number;
  created_on: string;
  is_read: boolean;
  user: number;
  message: Message;
}

const useInbox = () => {
  const { user, isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const queryClient = useQueryClient();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewingInboxItem, setViewingInboxItem] = useState<InboxItem | null>(
    null
  );
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [ unreadFriendReqCount, setUnreadFriendReqCount ] = useState(0);
  const [ unreadGiftReqCount, setUnreadGiftReqCount ] = useState(0);

  const {
    data: inboxItems,
    isPending,
    isSuccess,
    isError,
  } = useQuery<InboxItem[]>({
    queryKey: ["inboxItems", user?.id],
    queryFn: getInboxItems,
    enabled: !!isAuthenticated && !settingsAreLoading,
 
  });


  useEffect(() => {
    if (isSuccess) {
      
      const unreadFriends = inboxItems?.filter(item =>
        item.is_read === false &&
        item?.content_type === 'Users | friend request'
      ).length || 0;
  
      setUnreadFriendReqCount(unreadFriends);

      const unreadGifts = inboxItems?.filter(item =>
        item.is_read === false &&
         item?.content_type === 'Users | gift request'
      ).length || 0;

      // const unread = inboxItems?.filter(item =>
      //   item.is_read === false ).length || 0;
  
      setUnreadGiftReqCount(unreadGifts);
      setUnreadCount(unreadFriends + unreadGifts)
    } else {
      setUnreadFriendReqCount(0);
      setUnreadGiftReqCount(0);
      setUnreadCount(0);
    }
  }, [isSuccess, inboxItems]);

  const handleGetInboxItem = async (id: number) => {
    try {
      const inboxItem = await queryClient.fetchQuery<InboxItem>({
        queryKey: ["inboxItem", user?.id, id],
        queryFn: () => getInboxItem(id),
      });

      if (inboxItem) {
        setViewingInboxItem(inboxItem);
        setViewingMessage(inboxItem.message); // Extract and store the message separately
        console.log(`SPECIAL TYPE:`, inboxItem.message.content_object.special_type)
      }
    } catch (error) {
      console.error("Error fetching inbox item:", error);
    }
  };
 

  const triggerInboxItemsRefetch = () => {  
    queryClient.invalidateQueries({ queryKey: ["inboxItems", user?.id] });
    queryClient.refetchQueries({ queryKey: ["inboxItems", user?.id] });  
  };



  return {
    inboxItems,
    unreadCount,
    unreadFriendReqCount,
    unreadGiftReqCount,
    viewingInboxItem,
    handleGetInboxItem,
    viewingMessage,
    triggerInboxItemsRefetch,
  };
};

export default useInbox;
