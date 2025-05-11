// filepath: f:\fearlessagency\userspacegate\src\app\app.routes.ts
import { Routes } from '@angular/router';
import { BookingFormComponent } from './components/booking-form/booking-form.components';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

export const routes: Routes = [
  { path: '', component: BookingFormComponent }, // Default route
  { path: 'booking', component: BookingFormComponent }, // Example route
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
];