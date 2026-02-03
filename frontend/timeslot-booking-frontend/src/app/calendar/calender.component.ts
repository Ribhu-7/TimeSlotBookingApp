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
  currentWeekStart = new Date();
  selectedCategory: string = 'Cat 1';
  currentUserId = 1; // In a real app, this would come from auth service
  
  private refreshSub?: Subscription;
  private categorySub?: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('📅 Calendar initialized');
    
    // Set week to start of current week (Monday)
    this.setToStartOfWeek(this.currentWeekStart);
    
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
   * Set date to Monday of the week
   */
  private setToStartOfWeek(date: Date): void {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
  }

  /**
   * Load slots for current week and selected category
   */
  loadSlots() {
    const weekStartStr = this.formatDate(this.currentWeekStart);
    console.log('📥 Loading slots for week:', weekStartStr, 'category:', this.selectedCategory);
    
    this.api.getSlots(weekStartStr, this.selectedCategory).subscribe({
      next: (slots) => {
        console.log('✅ Received slots:', slots.length);
        this.slots = slots.sort((a, b) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      },
      error: (err) => {
        console.error('❌ Error loading slots:', err);
        this.slots = [];
      }
    });
  }

  /**
   * Navigate to previous week
   */
  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.currentWeekStart = new Date(this.currentWeekStart); // Trigger change detection
    console.log('⬅️ Previous week:', this.formatDate(this.currentWeekStart));
    this.loadSlots();
  }

  /**
   * Navigate to next week
   */
  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.currentWeekStart = new Date(this.currentWeekStart); // Trigger change detection
    console.log('➡️ Next week:', this.formatDate(this.currentWeekStart));
    this.loadSlots();
  }

  /**
   * Go to current week
   */
  goToCurrentWeek() {
    this.currentWeekStart = new Date();
    this.setToStartOfWeek(this.currentWeekStart);
    console.log('📍 Current week:', this.formatDate(this.currentWeekStart));
    this.loadSlots();
  }

  /**
   * Sign up for a time slot
   */
  signup(slot: TimeSlot) {
    if (!slot.id) return;
    
    console.log('✍️ Signing up for slot:', slot.id);
    this.api.signup(slot.id, this.currentUserId).subscribe({
      next: () => {
        console.log('✅ Signed up successfully');
      },
      error: (err) => {
        console.error('❌ Error signing up:', err);
        alert('Failed to sign up. The slot may already be taken.');
      }
    });
  }

  /**
   * Unsubscribe from a time slot
   */
  unsubscribe(slot: TimeSlot) {
    if (!slot.id) return;
    
    console.log('🚫 Unsubscribing from slot:', slot.id);
    this.api.unsubscribe(slot.id).subscribe({
      next: () => {
        console.log('✅ Unsubscribed successfully');
      },
      error: (err) => {
        console.error('❌ Error unsubscribing:', err);
        alert('Failed to unsubscribe. Please try again.');
      }
    });
  }

  /**
   * Check if user is signed up for this slot
   */
  isSignedUp(slot: TimeSlot): boolean {
    return slot.user_id === this.currentUserId;
  }

  /**
   * Check if slot is available for signup
   */
  isAvailable(slot: TimeSlot): boolean {
    return !slot.user_id;
  }

  /**
   * Get the week range display string
   */
  getWeekRange(): string {
    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${this.formatDateDisplay(this.currentWeekStart)} - ${this.formatDateDisplay(weekEnd)}`;
  }

  /**
   * Format date for API (YYYY-MM-DD)
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
   * Check if week is current week
   */
  isCurrentWeek(): boolean {
    const now = new Date();
    this.setToStartOfWeek(now);
    return this.formatDate(now) === this.formatDate(this.currentWeekStart);
  }
}
