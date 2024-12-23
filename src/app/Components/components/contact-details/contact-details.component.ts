import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ContactsService } from '../../../Services/contacts.service';
import { NotificationsService } from '../../../Services/notifications.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Contact} from '../../../Models/ContactModel';
import {CommonModule} from '@angular/common';
import {DarkModeService} from '../../../Services/dark-mode.service';

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

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  contact!: Contact;
  contactId!: string | null;
  contactForm!: FormGroup;
  isDarkMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactsService,
    private notificationService: NotificationsService,
    private fb: FormBuilder,
    private router: Router,
    private darkModeService: DarkModeService
  ) {
  }
  ngOnInit(): void {


    this.isDarkMode = this.darkModeService.getCurrentMode() == "darkMode"

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
      phone: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      isFavorite: [false],
      imageUrl: [''],
      physicalAddress: [''],
      groupCategory: [''],
      addedDate: [{ value: '', disabled: true }],
      lastViewedDate: [{ value: '', disabled: true }],
      id: ['', [Validators.required]]
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
      groupCategory: this.contact.groupCategory,
      id: this.contact.id
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService.updateContact(this.contactForm.get('id')?.value, this.contactForm.value);
      this.notificationService.showSuccess('Contact details updated successfully!');
      setTimeout(()=>{
        this.router.navigate(['/contact-list']);
      }, 2000)
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
       this.notificationService.showSuccess("Contact deleted successfully");
        setTimeout(()=>{
          this.router.navigate(['/contact-list']);
        }, 1000)
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // Update the contact's imageUrl with the selected image
        this.contact.imageUrl = reader.result as string;
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  // This method triggers the file input click event programmatically
  triggerFileInputClick() {
    this.fileInput.nativeElement.click();
  }

  // Change group category
  onGroupCategoryChange(newCategory: string): void {
    this.contact.groupCategory = newCategory;
    this.contactForm.patchValue({ groupCategory: newCategory });
  }


}
