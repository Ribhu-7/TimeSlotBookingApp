import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService, TimeSlot } from '../api/api.service';
import { FilterPipe } from '../shared/filter.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    FilterPipe
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  // Form fields
  category = 'Cat 1';
  startTime: string = '';
  endTime: string = '';
  
  categories = ['Cat 1', 'Cat 2', 'Cat 3'];
  
  // All slots (for admin view)
  allSlots: TimeSlot[] = [];
  displayedColumns: string[] = ['id', 'category', 'startTime', 'endTime', 'status', 'userId'];
  
  // Filter
  filterCategory: string = '';
  
  private refreshSub?: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('🔧 Admin panel initialized');
    this.loadAllSlots();
    
    // Subscribe to refresh events
    this.refreshSub = this.api.refresh$.subscribe(() => {
      console.log('🔄 Refresh triggered in admin');
      this.loadAllSlots();
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  /**
   * Load all slots (optionally filtered by category)
   */
  loadAllSlots() {
    // Get slots for a wide date range to show all
    const startDate = '2024-01-01'; // Start from beginning of year
    console.log('📥 Loading all slots', this.filterCategory ? `for category: ${this.filterCategory}` : '');
    
    this.api.getSlots(startDate, this.filterCategory || undefined).subscribe({
      next: (slots) => {
        console.log('✅ Received admin slots:', slots.length);
        this.allSlots = slots.sort((a, b) => 
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );
      },
      error: (err) => {
        console.error('❌ Error loading admin slots:', err);
        this.allSlots = [];
      }
    });
  }

  /**
   * Apply category filter
   */
  applyFilter() {
    console.log('🔍 Filtering by category:', this.filterCategory);
    this.loadAllSlots();
  }

  /**
   * Clear filter
   */
  clearFilter() {
    this.filterCategory = '';
    this.loadAllSlots();
  }

  /**
   * Add new time slot
   */
  addSlot() {
    console.log('🔵 Add slot clicked');
    console.log('Start:', this.startTime, 'End:', this.endTime, 'Category:', this.category);
    
    if (!this.startTime || !this.endTime) {
      alert('Please select both start and end times');
      return;
    }

    // Validate that end time is after start time
    const start = new Date(this.startTime);
    const end = new Date(this.endTime);
    
    if (end <= start) {
      alert('End time must be after start time');
      return;
    }

    const payload: Partial<TimeSlot> = {
      category: this.category,
      start_time: start.toISOString(),
      end_time: end.toISOString()
    };
    
    console.log('📤 Sending payload:', payload);

    this.api.createSlot(payload).subscribe({
      next: (res) => {
        console.log('✅ Slot created:', res);
        // Clear form
        this.startTime = '';
        this.endTime = '';
        // Show success message
        alert('Time slot created successfully!');
      },
      error: (err) => {
        console.error('❌ Error creating slot:', err);
        alert('Failed to create time slot. Please try again.');
      }
    });
  }

  /**
   * Get status display for a slot
   */
  getSlotStatus(slot: TimeSlot): string {
    return slot.user_id ? 'Booked' : 'Available';
  }

  /**
   * Check if slot is in the past
   */
  isPastSlot(slot: TimeSlot): boolean {
    return new Date(slot.end_time) < new Date();
  }

  /**
   * Set form to current date/time
   */
  setToNow() {
    const now = new Date();
    this.startTime = this.formatDateTimeLocal(now);
    
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    this.endTime = this.formatDateTimeLocal(oneHourLater);
  }

  /**
   * Format date for datetime-local input
   */
  private formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
