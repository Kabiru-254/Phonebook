import { Routes } from '@angular/router';
import {ContactDetailsComponent} from './Components/components/contact-details/contact-details.component';
import {ContactListComponent} from './Components/components/contact-list/contact-list.component';

export const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'contact-list', component: ContactListComponent },
  { path: 'contact-details/:id', component: ContactDetailsComponent },
];
