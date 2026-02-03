// // import { Component, OnInit, OnDestroy } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { MatCardModule } from '@angular/material/card';
// // import { MatButtonModule } from '@angular/material/button';
// // import { MatIconModule } from '@angular/material/icon';
// // import { MatChipsModule } from '@angular/material/chips';
// // import { ApiService, TimeSlot } from '../api/api.service';
// // import { Subscription } from 'rxjs';

// // @Component({
// //   selector: 'app-calendar',
// //   standalone: true,
// //   imports: [
// //     CommonModule, 
// //     MatCardModule, 
// //     MatButtonModule, 
// //     MatIconModule,
// //     MatChipsModule
// //   ],
// //   templateUrl: './calendar.component.html',
// //   styleUrls: ['./calendar.component.css']
// // })
// // export class CalendarComponent implements OnInit, OnDestroy {
// //   slots: TimeSlot[] = [];
// //   currentWeekStart!: Date;
// //   selectedCategory: string = 'Cat 1';
// //   currentUserId = 1;
  
// //   private refreshSub?: Subscription;
// //   private categorySub?: Subscription;

// //   constructor(private api: ApiService) {}

// //   ngOnInit() {
// //     console.log('📅 Calendar initialized');
    
// //     // Initialize to current week
// //     this.currentWeekStart = this.getWeekStartDate(new Date());
    
// //     // Subscribe to category changes
// //     this.categorySub = this.api.selectedCategory$.subscribe(category => {
// //       console.log('📋 Category updated to:', category);
// //       this.selectedCategory = category;
// //       this.loadSlots();
// //     });
    
// //     // Subscribe to refresh events
// //     this.refreshSub = this.api.refresh$.subscribe(() => {
// //       console.log('🔄 Refresh triggered');
// //       this.loadSlots();
// //     });
    
// //     // Initial load
// //     this.loadSlots();
// //   }

// //   ngOnDestroy() {
// //     this.refreshSub?.unsubscribe();
// //     this.categorySub?.unsubscribe();
// //   }

// //   /**
// //    * Get Monday of the week for any given date
// //    * FIXED: Returns a new Date object set to Monday 00:00:00
// //    */
// //   private getWeekStartDate(date: Date): Date {
// //     const d = new Date(date);
// //     const day = d.getDay();
// //     const diff = d.getDate() - day + (day === 0 ? -6 : 1);
// //     d.setDate(diff);
// //     d.setHours(0, 0, 0, 0);
// //     return d;
// //   }

// //   /**
// //    * Load slots for current week and selected category
// //    * FIXED: Better logging and error handling
// //    */
// //   loadSlots() {
// //     const weekStartStr = this.formatDateForAPI(this.currentWeekStart);
// //     const weekEndStr = this.formatDateForAPI(this.getWeekEndDate());
    
// //     console.log('📥 Loading slots');
// //     console.log('   Week Start:', weekStartStr, this.currentWeekStart);
// //     console.log('   Week End:', weekEndStr);
// //     console.log('   Category:', this.selectedCategory);
    
// //     this.api.getSlots(weekStartStr, this.selectedCategory).subscribe({
// //       next: (slots) => {
// //         console.log('✅ Received slots:', slots.length);
// //         if (slots.length > 0) {
// //           console.log('   First slot:', slots[0]);
// //         }
// //         this.slots = slots.sort((a, b) => 
// //           new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
// //         );
// //       },
// //       error: (err) => {
// //         console.error('❌ Error loading slots:', err);
// //         console.error('   Error details:', err.error);
// //         this.slots = [];
// //       }
// //     });
// //   }

// //   /**
// //    * Navigate to previous week
// //    * FIXED: Create completely new date object
// //    */
// //   previousWeek() {
// //     const newWeekStart = new Date(this.currentWeekStart);
// //     newWeekStart.setDate(newWeekStart.getDate() - 7);
// //     this.currentWeekStart = newWeekStart;
    
// //     console.log('⬅️ Previous week');
// //     console.log('   New week start:', this.formatDateForAPI(this.currentWeekStart));
// //     this.loadSlots();
// //   }

// //   /**
// //    * Navigate to next week
// //    * FIXED: Create completely new date object
// //    */
// //   nextWeek() {
// //     const newWeekStart = new Date(this.currentWeekStart);
// //     newWeekStart.setDate(newWeekStart.getDate() + 7);
// //     this.currentWeekStart = newWeekStart;
    
// //     console.log('➡️ Next week');
// //     console.log('   New week start:', this.formatDateForAPI(this.currentWeekStart));
// //     this.loadSlots();
// //   }

// //   /**
// //    * Go to current week
// //    * FIXED: Get fresh Monday date
// //    */
// //   goToCurrentWeek() {
// //     this.currentWeekStart = this.getWeekStartDate(new Date());
// //     console.log('📍 Current week:', this.formatDateForAPI(this.currentWeekStart));
// //     this.loadSlots();
// //   }

// //   /**
// //    * Sign up for a time slot
// //    */
// //   signup(slot: TimeSlot) {
// //     if (!slot.id) return;
    
// //     console.log('✍️ Signing up for slot:', slot.id);
// //     this.api.signup(slot.id, this.currentUserId).subscribe({
// //       next: () => {
// //         console.log('✅ Signed up successfully');
// //       },
// //       error: (err) => {
// //         console.error('❌ Error signing up:', err);
// //         alert('Failed to sign up. The slot may already be taken.');
// //       }
// //     });
// //   }

// //   /**
// //    * Unsubscribe from a time slot
// //    */
// //   unsubscribe(slot: TimeSlot) {
// //     if (!slot.id) return;
    
// //     console.log('🚫 Unsubscribing from slot:', slot.id);
// //     this.api.unsubscribe(slot.id).subscribe({
// //       next: () => {
// //         console.log('✅ Unsubscribed successfully');
// //       },
// //       error: (err) => {
// //         console.error('❌ Error unsubscribing:', err);
// //         alert('Failed to unsubscribe. Please try again.');
// //       }
// //     });
// //   }

// //   /**
// //    * Check if user is signed up for this slot
// //    */
// //   isSignedUp(slot: TimeSlot): boolean {
// //     return slot.user_id === this.currentUserId;
// //   }

// //   /**
// //    * Check if slot is available for signup
// //    */
// //   isAvailable(slot: TimeSlot): boolean {
// //     return !slot.user_id;
// //   }

// //   /**
// //    * Get the week range display string
// //    */
// //   getWeekRange(): string {
// //     const weekEnd = this.getWeekEndDate();
// //     return `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
// //   }

// //   /**
// //    * Get the end date of current week (Sunday)
// //    */
// //   private getWeekEndDate(): Date {
// //     const weekEnd = new Date(this.currentWeekStart);
// //     weekEnd.setDate(weekEnd.getDate() + 6);
// //     weekEnd.setHours(23, 59, 59, 999);
// //     return weekEnd;
// //   }

// //   /**
// //    * Format date for API (YYYY-MM-DD)
// //    * FIXED: Use local date, not UTC
// //    */
// //   private formatDateForAPI(date: Date): string {
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     const day = String(date.getDate()).padStart(2, '0');
// //     return `${year}-${month}-${day}`;
// //   }

// //   /**
// //    * Format date for display (MMM DD, YYYY)
// //    */
// //   private formatDateDisplay(date: Date): string {
// //     return date.toLocaleDateString('en-US', { 
// //       month: 'short', 
// //       day: 'numeric', 
// //       year: 'numeric' 
// //     });
// //   }

// //   /**
// //    * Check if week is current week
// //    * FIXED: Compare date strings properly
// //    */
// //   isCurrentWeek(): boolean {
// //     const today = this.getWeekStartDate(new Date());
// //     return this.formatDateForAPI(today) === this.formatDateForAPI(this.currentWeekStart);
// //   }
// // }

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatChipsModule } from '@angular/material/chips';
// import { ApiService, TimeSlot } from '../api/api.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-calendar',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     MatCardModule, 
//     MatButtonModule, 
//     MatIconModule,
//     MatChipsModule
//   ],
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css']
// })
// export class CalendarComponent implements OnInit, OnDestroy {
//   slots: TimeSlot[] = [];
//   currentWeekStart!: Date;
//   selectedCategory: string = 'Cat 1';
//   currentUserId = 1;
  
//   private refreshSub?: Subscription;
//   private categorySub?: Subscription;

//   constructor(private api: ApiService) {}

//   ngOnInit() {
//     console.log('📅 Calendar initialized');
    
//     // Initialize to current week
//     this.currentWeekStart = this.getWeekStartDate(new Date());
    
//     // Subscribe to category changes
//     this.categorySub = this.api.selectedCategory$.subscribe(category => {
//       console.log('📋 Category updated to:', category);
//       this.selectedCategory = category;
//       this.loadSlots();
//     });
    
//     // Subscribe to refresh events
//     this.refreshSub = this.api.refresh$.subscribe(() => {
//       console.log('🔄 Refresh triggered');
//       this.loadSlots();
//     });
    
//     // Initial load
//     this.loadSlots();
//   }

//   ngOnDestroy() {
//     this.refreshSub?.unsubscribe();
//     this.categorySub?.unsubscribe();
//   }

//   /**
//    * Get Monday of the week for any given date
//    */
//   private getWeekStartDate(date: Date): Date {
//     const d = new Date(date);
//     const day = d.getDay();
//     const diff = d.getDate() - day + (day === 0 ? -6 : 1);
//     d.setDate(diff);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   }

//   /**
//    * Get the end date of current week (Sunday 23:59:59)
//    */
//   private getWeekEndDate(): Date {
//     const weekEnd = new Date(this.currentWeekStart);
//     weekEnd.setDate(weekEnd.getDate() + 6);
//     weekEnd.setHours(23, 59, 59, 999);
//     return weekEnd;
//   }

//   /**
//    * Load slots for current week and selected category
//    * FIXED: Properly filter slots to only show current week
//    */
//   loadSlots() {
//     const weekStartStr = this.formatDateForAPI(this.currentWeekStart);
//     const weekEnd = this.getWeekEndDate();
    
//     console.log('📥 Loading slots');
//     console.log('   Week Start:', weekStartStr, this.currentWeekStart);
//     console.log('   Week End:', this.formatDateForAPI(weekEnd), weekEnd);
//     console.log('   Category:', this.selectedCategory);
    
//     this.api.getSlots(weekStartStr, this.selectedCategory).subscribe({
//       next: (slots) => {
//         console.log('✅ Received slots from API:', slots.length);
        
//         // FIXED: Filter slots to only show those within the current week
//         const weekStartTime = this.currentWeekStart.getTime();
//         const weekEndTime = weekEnd.getTime();
        
//         const filteredSlots = slots.filter(slot => {
//           const slotStartTime = new Date(slot.start_time).getTime();
//           const isInWeek = slotStartTime >= weekStartTime && slotStartTime <= weekEndTime;
          
//           if (!isInWeek) {
//             console.log(`   ⏭️  Filtering out slot ${slot.id}: ${slot.start_time} (outside week range)`);
//           }
          
//           return isInWeek;
//         });
        
//         console.log('   📊 Slots after filtering:', filteredSlots.length);
        
//         if (filteredSlots.length > 0) {
//           console.log('   First slot:', filteredSlots[0]);
//           console.log('   Last slot:', filteredSlots[filteredSlots.length - 1]);
//         }
        
//         // Sort by start time
//         this.slots = filteredSlots.sort((a, b) => 
//           new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
//         );
        
//         console.log('   ✅ Final slots count:', this.slots.length);
//       },
//       error: (err) => {
//         console.error('❌ Error loading slots:', err);
//         console.error('   Error details:', err.error);
//         this.slots = [];
//       }
//     });
//   }

//   /**
//    * Navigate to previous week
//    */
//   previousWeek() {
//     const newWeekStart = new Date(this.currentWeekStart);
//     newWeekStart.setDate(newWeekStart.getDate() - 7);
//     this.currentWeekStart = newWeekStart;
    
//     console.log('⬅️ Previous week');
//     console.log('   New week start:', this.formatDateForAPI(this.currentWeekStart));
//     this.loadSlots();
//   }

//   /**
//    * Navigate to next week
//    */
//   nextWeek() {
//     const newWeekStart = new Date(this.currentWeekStart);
//     newWeekStart.setDate(newWeekStart.getDate() + 7);
//     this.currentWeekStart = newWeekStart;
    
//     console.log('➡️ Next week');
//     console.log('   New week start:', this.formatDateForAPI(this.currentWeekStart));
//     this.loadSlots();
//   }

//   /**
//    * Go to current week
//    */
//   goToCurrentWeek() {
//     this.currentWeekStart = this.getWeekStartDate(new Date());
//     console.log('🎯 Current week:', this.formatDateForAPI(this.currentWeekStart));
//     this.loadSlots();
//   }

//   /**
//    * Sign up for a time slot
//    */
//   signup(slot: TimeSlot) {
//     if (!slot.id) return;
    
//     console.log('✏️ Signing up for slot:', slot.id);
//     this.api.signup(slot.id, this.currentUserId).subscribe({
//       next: () => {
//         console.log('✅ Signed up successfully');
//         // The refresh$ observable will trigger a reload
//       },
//       error: (err) => {
//         console.error('❌ Error signing up:', err);
//         alert('Failed to sign up. The slot may already be taken.');
//       }
//     });
//   }

//   /**
//    * Unsubscribe from a time slot
//    */
//   unsubscribe(slot: TimeSlot) {
//     if (!slot.id) return;
    
//     console.log('🚫 Unsubscribing from slot:', slot.id);
//     this.api.unsubscribe(slot.id).subscribe({
//       next: () => {
//         console.log('✅ Unsubscribed successfully');
//         // The refresh$ observable will trigger a reload
//       },
//       error: (err) => {
//         console.error('❌ Error unsubscribing:', err);
//         alert('Failed to unsubscribe. Please try again.');
//       }
//     });
//   }

//   /**
//    * Check if user is signed up for this slot
//    */
//   isSignedUp(slot: TimeSlot): boolean {
//     return slot.user_id === this.currentUserId;
//   }

//   /**
//    * Check if slot is available for signup
//    */
//   isAvailable(slot: TimeSlot): boolean {
//     return !slot.user_id;
//   }

//   /**
//    * Get the week range display string
//    */
//   getWeekRange(): string {
//     const weekEnd = this.getWeekEndDate();
//     return `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
//   }

//   /**
//    * Format date for API (YYYY-MM-DD)
//    */
//   private formatDateForAPI(date: Date): string {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   /**
//    * Format date for display (MMM DD, YYYY)
//    */
//   private formatDateDisplay(date: Date): string {
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric', 
//       year: 'numeric' 
//     });
//   }

//   /**
//    * Check if viewing current week
//    */
//   isCurrentWeek(): boolean {
//     const today = this.getWeekStartDate(new Date());
//     return this.formatDateForAPI(today) === this.formatDateForAPI(this.currentWeekStart);
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService, TimeSlot } from '../api/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  slots: TimeSlot[] = [];
  currentWeekStart!: Date;
  selectedCategory: string = 'Cat 1';
  currentUserId = 1;
  
  private refreshSub?: Subscription;
  private categorySub?: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('📅 Calendar initialized');
    
    // Initialize to current week
    this.currentWeekStart = this.getWeekStartDate(new Date());
    
    // Subscribe to category changes
    this.categorySub = this.api.selectedCategory$.subscribe(category => {
      console.log('📋 Category updated to:', category);
      this.selectedCategory = category;
      this.loadSlots();
    });
    
    // Subscribe to refresh events
    this.refreshSub = this.api.refresh$.subscribe(() => {
      console.log('🔄 Refresh triggered');
      this.loadSlots();
    });
    
    // Initial load
    this.loadSlots();
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
    this.categorySub?.unsubscribe();
  }

  /**
   * Get Monday of the week for any given date
   * Returns a Date object set to Monday at 00:00:00
   */
  private getWeekStartDate(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get the end date of current week (Sunday 23:59:59)
   */
  private getWeekEndDate(): Date {
    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd;
  }

  /**
   * Check if a date falls within the current week
   * Uses date-only comparison to avoid timezone issues
   */
  private isDateInCurrentWeek(dateStr: string): boolean {
    // Parse the slot date
    const slotDate = new Date(dateStr);
    
    // Create date-only versions for comparison (midnight local time, no timezone conversion)
    const slotDateOnly = new Date(
      slotDate.getFullYear(), 
      slotDate.getMonth(), 
      slotDate.getDate()
    );
    
    const weekStart = new Date(
      this.currentWeekStart.getFullYear(), 
      this.currentWeekStart.getMonth(), 
      this.currentWeekStart.getDate()
    );
    
    const weekEnd = this.getWeekEndDate();
    const weekEndOnly = new Date(
      weekEnd.getFullYear(), 
      weekEnd.getMonth(), 
      weekEnd.getDate()
    );
    
    // Compare date-only values
    return slotDateOnly >= weekStart && slotDateOnly <= weekEndOnly;
  }

  /**
   * Load slots for current week and selected category
   * Filters API results to only show slots within the current week
   */
  loadSlots() {
    const weekStartStr = this.formatDateForAPI(this.currentWeekStart);
    const weekEnd = this.getWeekEndDate();
    
    console.log('📥 Loading slots for week');
    console.log('   Week Start:', weekStartStr, '(', this.currentWeekStart.toDateString(), ')');
    console.log('   Week End:', this.formatDateForAPI(weekEnd), '(', weekEnd.toDateString(), ')');
    console.log('   Category:', this.selectedCategory);
    
    this.api.getSlots(weekStartStr, this.selectedCategory).subscribe({
      next: (slots) => {
        console.log('✅ Received slots from API:', slots.length);
        
        // Filter slots to only show those within the current week
        const filteredSlots = slots.filter(slot => {
          const slotDate = new Date(slot.start_time);
          const isInWeek = this.isDateInCurrentWeek(slot.start_time);
          
          if (isInWeek) {
            console.log(`   ✅ INCLUDED - Slot ${slot.id}: ${slot.start_time} (${slotDate.toDateString()})`);
          } else {
            console.log(`   ❌ EXCLUDED - Slot ${slot.id}: ${slot.start_time} (${slotDate.toDateString()})`);
          }
          
          return isInWeek;
        });
        
        console.log('   📊 Filtered slots for this week:', filteredSlots.length);
        
        if (filteredSlots.length > 0) {
          console.log('   First slot:', filteredSlots[0].start_time);
          console.log('   Last slot:', filteredSlots[filteredSlots.length - 1].start_time);
        }
        
        // Sort by start time
        this.slots = filteredSlots.sort((a, b) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        
        console.log('   ✅ Final display count:', this.slots.length);
      },
      error: (err) => {
        console.error('❌ Error loading slots:', err);
        console.error('   Error details:', err.error);
        this.slots = [];
      }
    });
  }

  /**
   * Navigate to previous week
   */
  previousWeek() {
    const newWeekStart = new Date(this.currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    this.currentWeekStart = newWeekStart;
    
    console.log('⬅️ Previous week');
    console.log('   New week:', this.getWeekRange());
    this.loadSlots();
  }

  /**
   * Navigate to next week
   */
  nextWeek() {
    const newWeekStart = new Date(this.currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    this.currentWeekStart = newWeekStart;
    
    console.log('➡️ Next week');
    console.log('   New week:', this.getWeekRange());
    this.loadSlots();
  }

  /**
   * Go to current week
   */
  goToCurrentWeek() {
    this.currentWeekStart = this.getWeekStartDate(new Date());
    console.log('🎯 Current week:', this.getWeekRange());
    this.loadSlots();
  }

  /**
   * Sign up for a time slot
   */
  signup(slot: TimeSlot) {
    if (!slot.id) {
      console.error('❌ Cannot sign up: slot has no ID');
      return;
    }
    
    console.log('✏️ Signing up for slot:', slot.id);
    console.log('   Slot details:', {
      id: slot.id,
      category: slot.category,
      start: slot.start_time,
      end: slot.end_time
    });
    
    this.api.signup(slot.id, this.currentUserId).subscribe({
      next: () => {
        console.log('✅ Signed up successfully');
        // The refresh$ observable will automatically trigger a reload
      },
      error: (err) => {
        console.error('❌ Error signing up:', err);
        console.error('   Error details:', err.error);
        alert('Failed to sign up. The slot may already be taken.');
      }
    });
  }

  /**
   * Unsubscribe from a time slot
   */
  unsubscribe(slot: TimeSlot) {
    if (!slot.id) {
      console.error('❌ Cannot unsubscribe: slot has no ID');
      return;
    }
    
    console.log('🚫 Unsubscribing from slot:', slot.id);
    console.log('   Slot details:', {
      id: slot.id,
      category: slot.category,
      start: slot.start_time,
      end: slot.end_time
    });
    
    this.api.unsubscribe(slot.id).subscribe({
      next: () => {
        console.log('✅ Unsubscribed successfully');
        // The refresh$ observable will automatically trigger a reload
      },
      error: (err) => {
        console.error('❌ Error unsubscribing:', err);
        console.error('   Error details:', err.error);
        alert('Failed to unsubscribe. Please try again.');
      }
    });
  }

  /**
   * Check if user is signed up for this slot
   */
  isSignedUp(slot: TimeSlot): boolean {
    const signedUp = slot.user_id === this.currentUserId;
    return signedUp;
  }

  /**
   * Check if slot is available for signup
   */
  isAvailable(slot: TimeSlot): boolean {
    const available = !slot.user_id;
    return available;
  }

  /**
   * Get the week range display string
   */
  getWeekRange(): string {
    const weekEnd = this.getWeekEndDate();
    return `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
  }

  /**
   * Format date for API (YYYY-MM-DD)
   * Uses local timezone, not UTC
   */
  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format date for display (MMM DD, YYYY)
   */
  private formatDateDisplay(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  /**
   * Check if viewing current week
   */
  isCurrentWeek(): boolean {
    const today = this.getWeekStartDate(new Date());
    const todayStr = this.formatDateForAPI(today);
    const currentStr = this.formatDateForAPI(this.currentWeekStart);
    return todayStr === currentStr;
  }
}