import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../Services/notifications.service';
import { ContactsService } from '../../../Services/contacts.service';
import { NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Contact } from '../../../Models/ContactModel';
import { Router } from '@angular/router';
import {DarkModeService} from '../../../Services/dark-mode.service';


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
  selectedGroupCategory: string = '';
  selectedContacts: string[] = [];
  searchQuery: string = '';
  viewMode: 'list' | 'grid' = 'list';
  darkMode: boolean = false;
  showFavoritesOnly: boolean = false;
  showCheckboxes: boolean = false;
  selectedContactsMap: { [key: string]: boolean } = {};
  showRecentContactsOnly = false;


  constructor(
    private contactService: ContactsService,
    private notificationService: NotificationsService,
    private router: Router,
    private darkModeService: DarkModeService
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

  fetchLoadedContacts(): Contact[]{
    this.loadContacts();
    return this.filteredContacts;
  }

  toggleTheme() {
    // localStorage.removeItem('darkMode');
    // this.darkMode = !this.darkMode;
    // if (this.darkMode) {
    //   document.documentElement.classList.add('dark');
    // } else {
    //   document.documentElement.classList.remove('dark');
    // }
    // console.log(`We are in dark mode:: ${this.darkMode}`);
    // localStorage.setItem('darkMode', JSON.stringify(this.darkMode));

    this.darkModeService.toggleMode();
    this.darkModeService.setMode(this.darkModeService.getCurrentMode())
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

  // Toggle visibility of checkboxes
  toggleCheckboxVisibility(): void {
    this.showCheckboxes = !this.showCheckboxes;

    // If hiding checkboxes, clear the selected contacts
    if (!this.showCheckboxes) {
      this.selectedContacts = [];
    }
  }

  toggleContactSelection(contactId: string): void {
    if (this.selectedContactsMap[contactId]) {
      if (!this.selectedContacts.includes(contactId)) {
        this.selectedContacts.push(contactId);
      }
    } else {
      this.selectedContacts = this.selectedContacts.filter(id => id !== contactId);
    }
  }


  selectAllContacts(): void {
    this.filteredContacts.forEach(contact => {
      if (!this.selectedContacts.includes(contact.id)) {
        this.selectedContacts.push(contact.id);
        this.selectedContactsMap[contact.id] = true;
      }
    });
  }

  deselectAllContacts(): void {
    this.selectedContacts = [];
    this.selectedContactsMap = {};
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

  openImportExportPage(){
    this.router.navigate(['/importExportContacts']);
  }

  toggleRecentContactsFilter() {
    this.showRecentContactsOnly = !this.showRecentContactsOnly;

    // If showing recent contacts, sort by lastViewedDate and take the top 10
    this.filteredContacts = this.showRecentContactsOnly
      ? this.contacts
        .sort((a, b) => b.lastViewedDate.getTime() - a.lastViewedDate.getTime()) // Sort by most recent first
        .slice(0, 10)
      : this.fetchLoadedContacts();
  }

  filterByGroupCategory() {
    if (this.selectedGroupCategory) {
      this.filteredContacts = this.contacts.filter(
        (contact) => contact.groupCategory === this.selectedGroupCategory
      );
    } else {
      this.filteredContacts = [...this.contacts]; // Show all contacts if no category is selected
    }
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

  deleteContact(contact: Contact) {
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
