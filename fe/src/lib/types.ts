export interface CurrentUser {
     id: string                
    name: string               
    email: string             
    role: 'tourist' | 'police'                       
    gender: string             
}

export interface Trip {
  id: string;
  destination: string;
  date: string;
  status: string;
  type: string;
}