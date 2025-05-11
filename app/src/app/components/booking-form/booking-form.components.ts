import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { bookingData, BookingService } from '../../services/booking.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTimepickerModule } from '@angular/material/timepicker';


@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    MatIconModule,
    MatTimepickerModule
    
  ],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  isSubmitting = false;
  currentDate = new Date();
  currentUser = 'fmjmadeit';

  services = [
    { value: 'haircut', label: 'Haircut' },
    { value: 'coloring', label: 'Hair Coloring' },
    { value: 'styling', label: 'Hair Styling' },
    { value: 'treatment', label: 'Hair Treatment' }
  ];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      service: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      notes: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  getErrorMessage(fieldName: string): string {
    const control = this.bookingForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    } else if (control?.hasError('email')) {
      return `Invalid email address`;
    } else if (control?.hasError('pattern')) {
      if (fieldName.toLowerCase() === 'time') {
        return `Invalid time format (HH:mm)`;
      }
      return `Invalid phone number format`;
    }
    return '';
  }

  private formatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  private formatTimeWithMilliseconds(time: string): string {
    if (!time) {
      throw new Error('Time is required');
    }

    // Validate the time format using a regular expression
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      throw new Error('Invalid time format, expected HH:mm');
    }

    return `${time}:00.000`;
  }

  onSubmit(): void {
    if (this.bookingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
  
      try {
        const formValues = this.bookingForm.value;
  
        // Ensure the date is a valid Date object
        let dateValue = formValues.date;
        if (typeof dateValue === 'string') {
          dateValue = new Date(dateValue);
        }
        if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
          throw new Error('Invalid date provided');
        }
  
        // Structure the data according to Strapi's expectations (no wrapping 'data' object)
        const bookingData: bookingData = {
          service: formValues.service,
          date: this.formatDate(dateValue),
          time: this.formatTimeWithMilliseconds(formValues.time),
          notes: formValues.notes,
          statuses: 'pending',
          "user": {
            name: formValues.userName,
            email: formValues.userEmail,
            phone: formValues.userPhone
          }
        };
  
        console.log('Sending booking data:', bookingData);
  
        this.bookingService.createBooking(bookingData).subscribe({
          next: (response) => {
            console.log('Booking success:', response);
            this.isSubmitting = false;
            this.snackBar.open('Booking created successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.bookingForm.reset();
          },
          error: (error) => {
            console.error('Booking error details:', error);
            this.isSubmitting = false;
  
            let errorMessage = 'Error creating booking!';
            if (error.error?.error?.details?.errors) {
              errorMessage = error.error.error.details.errors
                .map((e: any) => e.message)
                .join(', ');
            } else if (error.error?.error?.message) {
              errorMessage = error.error.error.message;
            }
  
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } catch (error) {
        this.isSubmitting = false;
        this.snackBar.open(error instanceof Error ? error.message : 'Error processing form data', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}