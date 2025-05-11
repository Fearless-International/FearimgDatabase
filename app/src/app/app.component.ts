import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar'; // Not needed in standalone component
import { BookingFormComponent } from './components/booking-form/booking-form.components';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button'; // Optional if you're using PrimeNG buttons

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BookingFormComponent, // Add this import
    HeaderComponent,      // Add HeaderComponent import
    FooterComponent,      // Add FooterComponent import
    MatToolbarModule,     // Add MatToolbarModule import
    SidebarComponent,     // Add SidebarComponent import
    SidebarModule,        // Add SidebarModule import
    ButtonModule          // Add ButtonModule import
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'userspacegate';

  sidebarActive = false; // Property to manage sidebar state

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive; // Toggle the sidebar state
  }
}

