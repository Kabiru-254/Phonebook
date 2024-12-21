import { Injectable } from '@angular/core';
import { Contact } from '../Models/ContactModel';
import {MOCK_CONTACTS } from '../Data/Contacts.data';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor() { }

  private contacts: Contact[] = [...MOCK_CONTACTS]; // Make a local copy to avoid modifying the original mock data

  // Get all contacts that are not marked as deleted
  getAllContacts(): Contact[] {
    return this.contacts.filter((contact) => !contact.deleted);
  }

  // Get a single contact by ID
  getContactById(id: string | null): Observable<Contact | undefined> {
    // Find the contact by id and return it as an observable
    const contact = this.contacts.find(contact => contact.id === id && !contact.deleted);
    return of(contact);  // Return the contact wrapped in an observable
  }

  // Add a new contact
  addContact(contact: Contact): void {
    this.contacts.push({ ...contact, deleted: false }); // Ensure new contacts are not deleted
  }

  // Update an existing contact by ID
  updateContact(id: string, updatedContact: Partial<Contact>): void {
    const contactIndex = this.contacts.findIndex((contact) => contact.id === id && !contact.deleted);
    if (contactIndex !== -1) {
      this.contacts[contactIndex] = {
        ...this.contacts[contactIndex],
        ...updatedContact,
      };
    }
  }

  // Mark a contact as deleted (soft delete)
  deleteContact(id: string): void {
    const contact = this.contacts.find((contact) => contact.id === id);
    if (contact) {
      contact.deleted = true;
    }
  }

  // Soft delete multiple contacts by marking them as deleted
  deleteContacts(ids: string[]): void {
    this.contacts.forEach((contact) => {
      if (ids.includes(contact.id)) {
        contact.deleted = true;
      }
    });
  }

  // Optionally: Restore a contact
  restoreContact(id: string): void {
    const contact = this.contacts.find((contact) => contact.id === id && contact.deleted);
    if (contact) {
      contact.deleted = false;
    }
  }
}
