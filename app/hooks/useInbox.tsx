import React, { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { getInboxItems, getInboxItem } from "../apicalls";

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
  const queryClient = useQueryClient();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewingInboxItem, setViewingInboxItem] = useState<InboxItem | null>(
    null
  );
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  const {
    data: inboxItems,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery<InboxItem[]>({
    queryKey: ["inboxItems"],
    queryFn: getInboxItems,
    enabled: !!isAuthenticated,
    onSuccess: (data) => {
      // Handle successful fetch
    },
  });

  const handleGetInboxItem = async (id: number) => {
    try {
      const inboxItem = await queryClient.fetchQuery<InboxItem>({
        queryKey: ["inboxItem", user?.id, id],
        queryFn: () => getInboxItem(id),
      });

      if (inboxItem) {
        setViewingInboxItem(inboxItem);
        setViewingMessage(inboxItem.message); // Extract and store the message separately
      }
    } catch (error) {
      console.error("Error fetching inbox item:", error);
    }
  };

  return {
    inboxItems,
    viewingInboxItem,
    handleGetInboxItem,
    viewingMessage,
  };
};

export default useInbox;
