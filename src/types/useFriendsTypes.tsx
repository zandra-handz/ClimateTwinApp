import { User } from "./UserContextTypes";


export interface Friend {
    id: number;
    nickname: string;
    created_on: string;
    user: number;
    friend: number;
    friendship: number; // use this to unfriend
    username: string; 
    friend_profile: FriendProfile;
  }


// NOT USING
  export interface FriendProfile {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string | null;
    bio: string | null;
    gender: string;
    most_recent_visit: {
      location_name: string;
      latitude: number;
      longitude: number;
      visited_on: string;  
    } | null;
    total_visits: number;  

}

export interface PublicProfile {
  avatar: string;
  bio: string | null;
  created_on: string; // ISO datetime
  date_of_birth: string | null; // ISO date or null
  first_name: string;
  id: number;
  last_name: string;
  username: string;
  most_recent_visit: {
    latitude: number;
    longitude: number;
    location_name: string;
    visited_on: string; // ISO datetime
  };
  total_visits: number;
  user: number;
}

export interface AddFriendRequest {
    message: string,
    sender: string,
    recipient: number,
}



// not in use
export interface DropdownOption {
    label: string;
    value: number;
    friendshipNumber: number;
  }


  export interface FriendRequest {
    id: number;
    message: string;
    recipient: User;
    sender: User;
    special_type: "friend request";
  }
  
  export interface GiftRequest {
    id: number;
    message: string;
    recipient: User;
    sender: User;
    treasure?: number;
    special_type: "gift request" | "gift_request"; // support both just in case
  }
  
  export interface PendingRequestsResponse {
    pending_friend_requests: FriendRequest[];
    pending_gift_requests: GiftRequest[];
  }