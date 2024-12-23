import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ContactsService } from '../../Services/contacts.service';
import { Contact } from '../../Models/ContactModel';
import { NotificationsService } from '../../Services/notifications.service';
import { DarkModeService } from '../../Services/dark-mode.service';
import { CommonModule } from '@angular/common';
import {Blob, File} from 'node:buffer';


@Component({
  selector: 'app-export-import',
  imports: [CommonModule],
  templateUrl: './export-import.component.html',
  standalone: true,
  styleUrl: './export-import.component.css'
})
export class ExportImportComponent implements OnInit, AfterViewInit{

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  fileToUpload: File | null = null;
  contacts: Contact[] = []; // Hold imported contacts
  errorMessage: string = ''; // Error message for invalid files
  successMessage: string = ''; // Success message for successful imports

  constructor(
    private contactsService: ContactsService,
    private notificationService: NotificationsService,
    private darkModeService: DarkModeService
  ) {
  }

  ngOnInit(): void {


  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.readCSVFile(file);
    }
  }

  readCSVFile(file: File): void {
    const reader = new FileReader();

    // Event listener when the file is successfully read
    reader.onload = () => {
      const fileContent = reader.result as string;
      this.parseCSV(fileContent);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.errorMessage = 'Error reading file. Please try again.';
      this.notificationService.showError(this.errorMessage);
    };

    // Read the file as text
    if (this.fileToUpload) {
      // @ts-ignore
      reader.readAsText(this.fileToUpload as Blob);  // Explicitly asserting as Blob
    }

  }

  parseCSV(csvContent: string): void {
    const lines = csvContent.split('\n');

    // Skip header or empty lines, if any
    const contactLines = lines.filter((line) => line.trim().length > 0);

    // Map the CSV data to the Contact model
    const contacts: Contact[] = contactLines.map((line) => {
      const [firstName, lastName, email, phone] = line.split(',');

      return {
        id: this.generateUniqueId(), // Generate unique ID for each contact
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        phone: phone || '',
        isFavorite: false, // Default value
        deleted: false, // Default value
        imageUrl: '', // Default empty image URL
        physicalAddress: '', // Default empty physical address
        groupCategory: '', // Default empty group category
        addedDate: new Date(), // Default current date for addedDate
        lastViewedDate: new Date(), // Default current date for lastViewedDate
      };
    });

    // Simple validation (check if required fields are not empty)
    const invalidContacts = contacts.filter(
      (contact) => !contact.firstName || !contact.email || !contact.phone
    );

    if (invalidContacts.length > 0) {
      this.errorMessage = 'Some contacts are invalid. Please check the CSV format.';
      this.notificationService.showError(this.errorMessage);
    } else {
      this.contacts = contacts;
      this.successMessage = 'Contacts successfully parsed. You can now import them.';
      this.notificationService.showSuccess(this.successMessage);
    }
  }

  // Helper function to generate a unique ID for each contact (can be customized)
  generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9); // Random string
  }

  importContacts(): void {
    if (this.contacts.length > 0) {
      const response = this.contactsService.importContacts(this.contacts); // Directly call the import function

      this.successMessage = 'Contacts successfully imported.';
      this.notificationService.showSuccess(response);

      // Clear the contacts array after import
      this.contacts = [];
    } else {
      this.errorMessage = 'No valid contacts to import.';
      this.notificationService.showError(this.errorMessage);
    }
  }

  // Export contacts as CSV
  exportContacts(): void {
    this.notificationService.showSuccess("Exporting...")
    // this.contacts = this.contactsService.getAllContacts();
    // const csvContent = this.convertContactsToCSV(this.contacts);
    // const blob: Blob = new Blob([csvContent], { type: 'text/csv' }); // Explicitly type the blob as Blob
    // const url = window.URL.createObjectURL(blob); // Create object URL from Blob
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'contacts.csv';
    // a.click();
    // window.URL.revokeObjectURL(url); // Clean up after download
  }


  // Convert contacts to CSV format
  convertContactsToCSV(contacts: Contact[]): string {
    const header = 'First Name,Last Name,Email,Phone\n';
    const rows = contacts
      .map(
        (contact) =>
          `${contact.firstName},${contact.lastName},${contact.email},${contact.phone}`
      )
      .join('\n');
    return header + rows;
  }

  ngAfterViewInit(): void {
    // Ensure fileInput is available after the view is initialized
    if (this.fileInput) {
      this.notificationService.showSuccess('File input is available');
    } else {
      this.notificationService.showError('File input is not available');
    }
  }


}
