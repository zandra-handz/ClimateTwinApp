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
  date_of_birth: string; // ISO format, e.g. "1989-07-13"
  first_name: string;
  id: number;
  last_name: string;
  most_recent_visit: {
    latitude: number;
    longitude: number;
    location_name: string;
    visited_on: string; // ISO datetime format, e.g. "2025-04-18T23:26:16.568164Z"
  };
  total_visits: number;
  user: number;
}

export interface AddFriendRequest {
    message: string,
    sender: string,
    recipient: number,
}

export interface DropdownOption {
    label: string;
    value: number;
    friendshipNumber: number;
  }

 