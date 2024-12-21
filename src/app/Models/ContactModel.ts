export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isFavorite: boolean;
  deleted: boolean;
  imageUrl: string;
  physicalAddress: string;
  groupCategory: string;
  addedDate: Date;
  lastViewedDate: Date;
}
