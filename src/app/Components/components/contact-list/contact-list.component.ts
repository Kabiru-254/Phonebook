import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../Services/notifications.service';
import { ContactsService } from '../../../Services/contacts.service';
import { NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Contact } from '../../../Models/ContactModel';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact-list',
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './contact-list.component.html',
  standalone: true,
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContacts: string[] = [];
  searchQuery: string = '';
  viewMode: 'list' | 'grid' = 'list';
  darkMode: boolean = false;
  showFavoritesOnly: boolean = false;

  constructor(
    private contactService: ContactsService,
    private notificationService: NotificationsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // if (localStorage != undefined){
    //   this.loadViewModePreference();
    // }
    this.loadContacts();
  }

  loadContacts() {
    this.contacts = this.contactService.getAllContacts();
    this.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
    this.filteredContacts = [...this.contacts];
  }

  toggleTheme() {
    localStorage.removeItem('darkMode');
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    console.log(`We are in dark mode:: ${this.darkMode}`);
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
    localStorage.setItem('viewMode', this.viewMode);
  }
  loadViewModePreference() {
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      this.viewMode = savedViewMode as 'list' | 'grid';
    }
  }

  // Saves the view mode preference to localStorage
  setViewMode(mode: 'list' | 'grid') {
    this.viewMode = mode;
    localStorage.setItem('viewMode', mode);  // Store the preference
  }


  onSearch() {
    this.filteredContacts = this.contacts.filter((contact) =>
      [contact.firstName, contact.lastName, contact.email, contact.phone]
        .join(' ')
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }


  toggleFavorite(contact: any) {
    contact.isFavorite = !contact.isFavorite;
    this.notificationService.showSuccess(
      `${contact.firstName} ${contact.lastName} ${
        contact.isFavorite ? 'added to' : 'removed from'
      } favorites.`
    );
  }

  toggleFavoriteFilter() {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.filteredContacts = this.showFavoritesOnly
      ? this.contacts.filter((contact) => contact.isFavorite)
      : [...this.contacts];
  }

  viewDetails(contact: Contact) {
    this.notificationService.showInfo('Navigating to contact details...');
    this.router.navigate(['/contact-details', contact.id]);
  }

  confirmDelete(contact: any) {
    this.notificationService.showConfirmation(
      'Delete Contact',
      `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
      () => this.deleteContact(contact)
    );
  }

  deleteContact(contact: any) {
    this.contactService.deleteContact(contact.id);
    this.loadContacts();
    this.notificationService.showSuccess('Contact deleted successfully.');
  }

  confirmBulkDelete() {
    this.notificationService.showConfirmation(
      'Delete Selected Contacts',
      'Are you sure you want to delete the selected contacts?',
      () => this.bulkDelete()
    );
  }

  bulkDelete() {
    this.contactService.deleteContacts(this.selectedContacts);
    this.loadContacts();
    this.notificationService.showSuccess('Contacts deleted successfully.');
  }
}
