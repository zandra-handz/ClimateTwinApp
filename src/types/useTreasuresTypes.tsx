import { User } from "./UserContextTypes";

export interface Treasure {
  user: User;
  original_user: string;  // use this to determine if logged in user can delete the treasure
  miles_traveled_to_collect: number;
  location_name: string;
  found_at_latitude: number;
  found_at_longitude: number;
  descriptor: string;
  description?: string | null;
  item_name: string;
  item_category: string;

  add_data?: Record<string, unknown> | null;
  pending: boolean;

  // Gift-related fields
  message?: string | null;
  giver?: User | null;
  recipient?: User | null;
  created_on: string;
  owned_since?: string | null;
}


export interface CollectTreasureRequest {
    item: string;
    descriptor: string;
    description: string;
    third_data?: string; // no need to add | null if it is already optional because of the ?
}

export interface GiftTreasureRequest {
    treasure: number;
    message: string | '';
    sender: string;
    recipient: number;
}


export interface Message {
    
}