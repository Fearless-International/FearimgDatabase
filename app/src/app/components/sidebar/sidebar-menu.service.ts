// sidebar-menu.service.ts
import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuService {
  transformMenuItems(items: any[]): MenuItem[] {
    return items.map(item => {
      return {
        label: item.label,
        icon: item.icon,
        routerLink: item.route,
        styleClass: this.isRouteActive(item.route) ? 'active' : ''
      };
    });
  }

  private isRouteActive(route: string): boolean {
    // Simple implementation - in a real app, use Router or ActivatedRoute
    return window.location.pathname === route;
  }
}