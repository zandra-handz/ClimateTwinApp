export interface User {
    id: string; // Assuming the user model has an 'id' as a string (e.g., a UUID or integer)
    username: string;
    email: string; 
    is_superuser: boolean; // Added this to customize my own UI during dev as superuser

}