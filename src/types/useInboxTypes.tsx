export interface ContentObject {
    id: number;
    special_type: string;
    message: string;
    recipient: number;
    treasure_descriptor?: string;
    treasure_description?: string;
  }
  
  export interface Message {
    id: number;
    sender: number;
    recipient: number;
    content: string;
    created_on: string;
    content_object: ContentObject;
  }
  
  export interface InboxItem {
    id: number;
    created_on: string;
    is_read: boolean;
    user: number;
    message: Message;
  }