import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
// Remove the unused Chart import and just register the components needed
// Removed unused 'register' import from 'chart.js/auto'
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DashboardService } from '../../services/dashboard.services';
import { MessageService } from 'primeng/api';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChartModule,
    CardModule,
    ButtonModule,
    TableModule,
    ProgressBarModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    SelectButtonModule,
    FormsModule
  ],
  providers: [MessageService],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  recentBookings: any[] = [];
  statistics = {
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    revenue: 0,
    revenueGrowth: 0,
    bookingGrowth: 0
  };
  
  notifications: any[] = [];
  // Removed duplicate declaration of currentUser
  loading = false;
  periodOptions = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ];
  selectedPeriod = 'month';
  // Set the specific UTC time
  currentTime: Date = new Date('2025-05-11T19:28:41Z');
  currentUser: string = 'fmjmadeit';
  protected Math = Math;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initDashboard();
    this.startRealTimeUpdates();
    this.initChartOptions();
  }

  private initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
        y: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255,255,255,0.1)'
          }
        }
      }
    };
  }

  private initDashboard() {
    this.loading = true;
    Promise.all([
      this.loadDashboardStats(),
      this.loadChartData(),
      this.loadRecentBookings(),
      this.loadNotifications()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private startRealTimeUpdates() {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date(this.currentTime.getTime() + 1000);
    }, 1000);

    // Refresh dashboard data every 5 minutes
    setInterval(() => {
      this.initDashboard();
    }, 300000);
  }

  onPeriodChange(event: any) {
    this.loadChartData(event.value);
  }

  private async loadDashboardStats() {
    try {
      const stats = await this.dashboardService.getDashboardStats().toPromise();
      this.statistics = stats;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load dashboard statistics'
      });
    }
  }

  private async loadChartData(period: string = 'month') {
    try {
      const data = await this.dashboardService.getChartData(period).toPromise();
      this.chartData = {
        labels: data.labels,
        datasets: [
          {
            label: 'Bookings',
            data: data.bookings,
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.4
          },
          {
            label: 'Revenue',
            data: data.revenue,
            fill: false,
            borderColor: '#66BB6A',
            tension: 0.4
          }
        ]
      };
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load chart data'
      });
    }
  }

  private async loadRecentBookings() {
    try {
      this.recentBookings = await this.dashboardService.getRecentBookings().toPromise();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load recent bookings'
      });
    }
  }

  private async loadNotifications() {
    try {
      this.notifications = await this.dashboardService.getUserNotifications().toPromise();
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  }
}