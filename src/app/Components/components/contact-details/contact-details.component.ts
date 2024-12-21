import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../../../Services/contacts.service';
import { NotificationsService } from '../../../Services/notifications.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Contact} from '../../../Models/ContactModel';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-contact-details',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './contact-details.component.html',
  standalone: true,
  styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent implements OnInit{
  contact!: Contact;
  contactId!: string | null;
  contactForm!: FormGroup;
  isDarkMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactsService,
    private notificationService: NotificationsService,
    private fb: FormBuilder
  ) {
  }
  ngOnInit(): void {

    // Retrieve the dark mode preference from local storage
    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;

    this.createForm();
    this.contactId = this.route.snapshot.paramMap.get('id');
    this.fetchContactDetails();

  }

  fetchContactDetails(): void {
    this.contactService.getContactById(this.contactId).subscribe((contact: Contact | undefined) => {
      if (contact) {
        this.contact = contact;
        this.populateForm();
      } else {
        this.notificationService.showError('Contact not found!');
      }
    });
  }


  createForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      isFavorite: [false],
      imageUrl: [''],
      physicalAddress: [''],
      groupCategory: [''],
      addedDate: [{ value: '', disabled: true }],
      lastViewedDate: [{ value: '', disabled: true }]
    });
  }

  populateForm(): void {
    this.contactForm.patchValue({
      firstName: this.contact.firstName,
      lastName: this.contact.lastName,
      email: this.contact.email,
      phone: this.contact.phone,
      isFavorite: this.contact.isFavorite,
      imageUrl: this.contact.imageUrl,
      physicalAddress: this.contact.physicalAddress,
      groupCategory: this.contact.groupCategory
    });
  }

  onSubmit(contact: Contact): void {
    console.log("Pressed!");
    if (this.contactForm.valid) {
      this.contactService.updateContact(contact.id, this.contactForm.value);
      this.notificationService.showInfo('Contact details updated successfully!');
    } else {
      this.notificationService.showError('Please fill out all required fields correctly.');
    }
  }

  deleteContact(contact: Contact): void {
    this.notificationService.showConfirmation(
      'Are you sure you want to delete this contact?',
      'You wont be able to revert back!',
      () => {
       this.contactService.deleteContact(contact.id);
      });
  }

  redirectToRandomImage() {
    window.open('https://randomuser.me/', '_blank');
  }

  // Toggle the favorite status of the contact
  toggleFavorite(): void {
    this.contact.isFavorite = !this.contact.isFavorite;
    this.contactForm.patchValue({ isFavorite: this.contact.isFavorite });
    this.notificationService.showInfo(
      this.contact.isFavorite ? 'Contact marked as favorite.' : 'Contact unmarked as favorite.'
    );
  }

  // Change group category
  onGroupCategoryChange(newCategory: string): void {
    this.contact.groupCategory = newCategory;
    this.contactForm.patchValue({ groupCategory: newCategory });
  }


}
