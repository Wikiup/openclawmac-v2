// ===================================================================
// INTERACTIVE LIVE AVAILABILITY CALENDAR PREVIEW
// Sprint #44 - 2026-02-10 7:57 AM
//
// Dynamic availability calendar with real-time slot visualization.
// Reduces booking friction by showing available times upfront.
//
// Features:
// - Dynamic month generation with prev/next navigation
// - Available/booked/today visual states
// - Click-to-select date interaction
// - Time slot preview with duration
// - Keyboard navigation (Arrow keys, Enter, Escape)
// - Touch-optimized mobile interactions
// - ARIA accessibility (role=grid, aria-selected)
// - Mock availability data (production: integrate with booking API)
// ===================================================================

class AvailabilityCalendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentDate = new Date();
    this.selectedDate = null;
    this.focusedDay = null;

    // Mock availability data (Production: replace with API call)
    this.availability = this.generateMockAvailability();

    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  // Generate mock availability data for next 60 days
  generateMockAvailability() {
    const availability = {};
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = this.formatDateKey(date);
      
      // Skip weekends for this demo
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        availability[dateKey] = { available: false, slots: [] };
        continue;
      }

      // 70% chance of having availability
      const hasAvailability = Math.random() > 0.3;
      
      if (hasAvailability) {
        availability[dateKey] = {
          available: true,
          slots: this.generateTimeSlots()
        };
      } else {
        availability[dateKey] = { available: false, slots: [] };
      }
    }

    return availability;
  }

  // Generate time slots for a day
  generateTimeSlots() {
    const slots = [
      { time: '9:00 AM', duration: '60 min' },
      { time: '10:30 AM', duration: '60 min' },
      { time: '1:00 PM', duration: '60 min' },
      { time: '2:30 PM', duration: '60 min' },
      { time: '4:00 PM', duration: '60 min' }
    ];

    // Randomly remove some slots to simulate partial availability
    const availableSlots = slots.filter(() => Math.random() > 0.3);
    return availableSlots;
  }

  formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  render() {
    const monthYear = this.currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    this.container.innerHTML = `
      <div class="calendar-nav">
        <div class="calendar-month-year">${monthYear}</div>
        <div class="calendar-nav-buttons">
          <button class="calendar-nav-btn" data-action="prev" aria-label="Previous month">
            ◀
          </button>
          <button class="calendar-nav-btn" data-action="next" aria-label="Next month">
            ▶
          </button>
        </div>
      </div>

      <div class="calendar-grid" role="grid" aria-label="Calendar">
        ${this.renderDayHeaders()}
        ${this.renderDays()}
      </div>

      <div class="time-slots-panel">
        ${this.renderTimeSlots()}
      </div>

      <div class="calendar-legend">
        <div class="legend-item">
          <div class="legend-dot available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot booked"></div>
          <span>Fully Booked</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot selected"></div>
          <span>Selected</span>
        </div>
      </div>
    `;
  }

  renderDayHeaders() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => 
      `<div class="calendar-day-header">${day}</div>`
    ).join('');
  }

  renderDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Adjust to start on Monday (1 = Monday in getDay())
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Convert Sunday (0) to 6
    
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    const todayKey = this.formatDateKey(today);
    
    let html = '';
    
    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      html += `<div class="calendar-day empty"></div>`;
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = this.formatDateKey(date);
      const availability = this.availability[dateKey] || { available: false };
      
      let classes = ['calendar-day'];
      
      if (dateKey === todayKey) {
        classes.push('today');
      }
      
      if (availability.available && availability.slots.length > 0) {
        classes.push('available');
      } else if (!availability.available || availability.slots.length === 0) {
        classes.push('booked');
      }
      
      if (this.selectedDate && dateKey === this.formatDateKey(this.selectedDate)) {
        classes.push('selected');
      }
      
      html += `
        <div 
          class="${classes.join(' ')}" 
          data-date="${dateKey}"
          role="gridcell"
          aria-selected="${classes.includes('selected') ? 'true' : 'false'}"
          tabindex="${classes.includes('available') ? '0' : '-1'}"
        >
          <div class="calendar-day-number">${day}</div>
          <div class="calendar-day-indicator"></div>
        </div>
      `;
    }
    
    return html;
  }

  renderTimeSlots() {
    if (!this.selectedDate) {
      return `
        <div class="time-slots-empty">
          <div class="time-slots-empty-icon">📅</div>
          <div class="time-slots-empty-text">
            Select an available date to view time slots
          </div>
        </div>
      `;
    }

    const dateKey = this.formatDateKey(this.selectedDate);
    const availability = this.availability[dateKey];

    if (!availability || !availability.available || availability.slots.length === 0) {
      return `
        <div class="time-slots-empty">
          <div class="time-slots-empty-icon">❌</div>
          <div class="time-slots-empty-text">
            No available time slots for this date
          </div>
        </div>
      `;
    }

    const formattedDate = this.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return `
      <div class="time-slots-header">
        <div class="time-slots-date">${formattedDate}</div>
        <div class="time-slots-count">
          <span class="count-number">${availability.slots.length}</span> slots available
        </div>
      </div>
      <div class="time-slots-grid">
        ${availability.slots.map(slot => `
          <div class="time-slot" data-time="${slot.time}" tabindex="0" role="button">
            <div class="time-slot-time">${slot.time}</div>
            <div class="time-slot-duration">${slot.duration}</div>
          </div>
        `).join('')}
      </div>
      <button class="time-slot-book-btn" onclick="scrollToBooking()">
        Book This Time →
      </button>
    `;
  }

  attachEventListeners() {
    // Navigation buttons
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.calendar-nav-btn');
      if (btn) {
        const action = btn.dataset.action;
        if (action === 'prev') {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else if (action === 'next') {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.render();
        this.attachEventListeners();
      }
    });

    // Day selection
    this.container.addEventListener('click', (e) => {
      const day = e.target.closest('.calendar-day.available');
      if (day) {
        const dateKey = day.dataset.date;
        this.selectedDate = new Date(dateKey + 'T12:00:00');
        this.render();
        this.attachEventListeners();
        
        // Smooth scroll to time slots
        const timeSlotsPanel = this.container.querySelector('.time-slots-panel');
        if (timeSlotsPanel) {
          timeSlotsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    // Time slot selection
    this.container.addEventListener('click', (e) => {
      const slot = e.target.closest('.time-slot');
      if (slot) {
        const time = slot.dataset.time;
        const dateKey = this.formatDateKey(this.selectedDate);
        
        // In production, this would pre-fill the booking form
        console.log('Selected time slot:', { date: dateKey, time });
        
        // Scroll to booking form
        scrollToBooking();
      }
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      const day = e.target.closest('.calendar-day.available');
      if (!day) return;

      const dateKey = day.dataset.date;
      const currentDate = new Date(dateKey + 'T12:00:00');
      
      let newDate = null;

      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 7);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 7);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.selectedDate = currentDate;
          this.render();
          this.attachEventListeners();
          return;
        case 'Escape':
          e.preventDefault();
          this.selectedDate = null;
          this.render();
          this.attachEventListeners();
          return;
      }

      if (newDate) {
        const newDateKey = this.formatDateKey(newDate);
        const newDayElement = this.container.querySelector(`[data-date="${newDateKey}"].available`);
        if (newDayElement) {
          newDayElement.focus();
        }
      }
    });

    // Time slot keyboard activation
    this.container.addEventListener('keydown', (e) => {
      const slot = e.target.closest('.time-slot');
      if (!slot) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        slot.click();
      }
    });
  }
}

// Helper function to scroll to booking form
function scrollToBooking() {
  const bookingSection = document.querySelector('#booking-form, .booking-form-section, [data-section="booking"]');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Focus first input after scroll
    setTimeout(() => {
      const firstInput = bookingSection.querySelector('input, textarea');
      if (firstInput) {
        firstInput.focus();
      }
    }, 500);
  }
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const calendar = new AvailabilityCalendar('availability-calendar-grid');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AvailabilityCalendar;
}
