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

 