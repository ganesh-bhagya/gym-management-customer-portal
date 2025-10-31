# 📋 Customer Portal - Implementation Plan

## ✅ Currently Implemented

- [x] Registration with invite code
- [x] Multi-step registration (invite → personal info → programs → account)
- [x] Login authentication
- [x] Admin approval system
- [x] Waiting approval page
- [x] Basic dashboard with stats (programs, weight, height, BMI)
- [x] Complete dark theme across all pages
- [x] Responsive design (mobile + desktop)
- [x] **App-style bottom navigation (mobile)**
- [x] **Clean top navigation (desktop)**
- [x] **My Schedule - Workout viewer with numbered workouts**

---

## 🚀 Features to Build

### ✅ 1. Navigation Menu 🧭

**Status:** ✅ COMPLETE

**Implemented:**

- Bottom navigation bar (mobile) - like Instagram
- Clean top navigation (desktop)
- 5 main tabs: Home, Schedule, Progress, Diet, More
- "More" menu for Profile, Membership, Payments, Settings
- Notification bell with badge
- User profile display
- Logout functionality

---

### ✅ 2. My Schedule 📅

**Status:** ✅ COMPLETE

**Implemented:**

- View all assigned workouts
- Numbered workout list (Day 1, Day 2, Day 3...)
- Click workout to view exercises
- Exercise details: sets, reps, rest time, notes
- Program info and duration
- Empty state for no workouts
- Refresh functionality
- Mobile & desktop responsive

**Backend:**

- `GET /schedules/my-schedule` endpoint created
- Returns all client workouts with exercises

---

### 3. Diet Plans 🍎

**Status:** ⏭️ NEXT UP

**Requirements:**

- View assigned diet plans
- See meals by category:
  - Breakfast 🌅
  - Lunch 🍽️
  - Dinner 🌙
  - Snacks 🍪
  - Tea ☕
- Display food items and calories
- Notes/instructions from trainer
- Empty state if no diet plan

**API Endpoints Needed:**

- `GET /diet-plans/my-diet` (get client's diet plans)

**Design:**

- Card-based meal layout
- Calorie badges
- Collapsible meal sections
- Print-friendly layout
- Dark theme consistent

---

### 4. Profile Management 📝

**Status:** Pending

**Requirements:**

- View personal profile (full name, email, phone, DOB, gender)
- Edit profile information
- Update height/weight
- Manage emergency contact
- Update medical notes
- View account status
- Profile picture (optional)
- Save changes functionality

**API Endpoints Needed:**

- `GET /clients/me` (already exists)
- `PATCH /clients/me` (update profile)

**Design:**

- Editable form fields
- Save/Cancel buttons
- Validation
- Success/error messages
- Dark theme

---

### 5. Progress Tracking 📈

**Status:** Pending

**Requirements:**

- View progress history (weight over time)
- Add new progress entries:
  - Current weight
  - Body measurements (chest, waist, hips, arms, legs)
  - Progress notes
- Charts showing weight trends
- Compare before/after stats
- Timeline view

**API Endpoints Needed:**

- `GET /progress/my-progress` (get client's progress)
- `POST /progress` (add new entry - may need new endpoint)

**Libraries:**

- ApexCharts (for weight chart)

**Design:**

- Line chart for weight trend
- "Add Progress" button
- Progress cards with dates
- Dark theme charts

---

### 6. My Membership 💳

**Status:** Pending

**Requirements:**

- View active membership details:
  - Enrolled programs
  - Payment period (monthly/6-month/yearly)
  - Monthly amount
  - Start date
  - End date
  - Status (active/expired)
- Membership card display
- Renewal information

**API Endpoints Needed:**

- `GET /memberships/my-membership` (get client's membership)

**Design:**

- Card-style membership display
- Program badges
- Payment info
- Expiry warning if near end
- Dark theme

---

### 7. Payment History 💰

**Status:** Pending

**Requirements:**

- View all payment records
- See payment status:
  - ✅ Paid (green)
  - ⏳ Pending Review (yellow)
  - ❌ Unpaid (red)
- Display:
  - Month/year
  - Amount (LKR)
  - Payment method (cash/bank transfer)
  - Payment date
  - Due date
- Upcoming payments reminder
- Filter by status

**API Endpoints Needed:**

- `GET /payments/my-payments` (get client's payment history)

**Design:**

- Timeline/list view
- Status badges
- Filter chips
- Upcoming payment alert
- Dark theme

---

### 8. Dashboard Enhancements 🎯

**Status:** Pending (after other features)

**Requirements:**

- Recent activity feed
- Next workout preview
- Progress mini-chart (last 30 days)
- Payment status widget
- Quick action buttons
- Streak counter (days attended)
- Motivational messages

**Technical:**

- Aggregate data from multiple endpoints
- Create dashboard widgets
- Add mini charts

---

### 9. Settings Page ⚙️

**Status:** Pending

**Requirements:**

- Change password
- Update email
- Notification preferences
- Account information
- Privacy settings
- App version info
- Logout

**API Endpoints Needed:**

- `PATCH /auth/change-password`
- `PATCH /clients/me` (update email)

---

### 10. Notifications 🔔

**Status:** Pending (optional/later)

**Requirements:**

- Notification icon in header (already added)
- Show unread count badge
- Notification list
- Mark as read
- Notification types:
  - Payment due
  - New schedule
  - New diet plan
  - Admin messages

**API Endpoints Needed:**

- Backend notification system (not built yet)

---

## 📱 Priority Order (Updated)

### Phase 1 - Core Features ⭐

1. ✅ Registration & Login
2. ✅ Navigation Menu
3. ✅ My Schedule
4. 🔜 **Diet Plans (NEXT)**
5. 👤 Profile Management
6. 📈 Progress Tracking

### Phase 2 - Member Services

7. 💳 My Membership
8. 💰 Payment History
9. 🎯 Dashboard Enhancements

### Phase 3 - Settings & Extras

10. ⚙️ Settings Page
11. 🔔 Notifications (optional)

---

## 📊 Progress Summary

**Completed:** 2/10 features (20%)

- ✅ Navigation Menu
- ✅ My Schedule

**In Progress:** 0
**Remaining:** 8 features

**Next Up:** 🍎 Diet Plans

---

## 🎨 Design System (Established)

**Colors:**

- Background: `slate-900` → `slate-800` → `black` gradient
- Cards: `slate-900/95` with backdrop blur
- Borders: `slate-700/50`
- Text: `white` (headings), `gray-300` (labels), `gray-400` (descriptions)
- Accents: Orange/red gradients
- Icons: `orange-400`

**Components:**

- Bottom nav (mobile)
- Top nav (desktop)
- Card layouts
- Gradient headers
- Empty states
- Loading spinners

---

## 📝 Notes

- All pages follow dark gym theme
- Mobile-first approach
- Bottom nav for easy thumb access
- Consistent gradient buttons
- Toast notifications for feedback
- Empty states for all features

---

Last Updated: October 31, 2025

**Current Task:** Building Diet Plans feature 🍎
