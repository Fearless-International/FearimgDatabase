import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from 'primeng/api'; // Import MenuItem type
import { MenuModule } from 'primeng/menu'; // 
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MenuModule,
    BadgeModule,
    AvatarModule,
  ]
})
export class HeaderComponent {
  items: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'About', icon: 'pi pi-info', routerLink: '/about' },
    {
      label: 'Services',
      icon: 'pi pi-cog',
      items: [
        { label: 'Web Development', icon: 'pi pi-code' },
        { label: 'UI/UX Design', icon: 'pi pi-palette' },
      ],
    },
    { label: 'Contact', icon: 'pi pi-envelope', routerLink: '/contact' },
  ];
}
