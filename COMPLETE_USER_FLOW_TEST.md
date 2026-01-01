# 🧪 Complete User Flow Testing Guide

## 🎯 Testing as Passenger & Driver

This document guides you through testing all functionality as both a passenger and driver.

## 👤 Testing as PASSENGER

### Step 1: Register/Login ✅

**Option A: Email Registration**
1. Visit: `https://airbear.me/auth/signup`
2. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
   - Username: `testuser`
3. Click "Sign up"
4. Check email for confirmation link
5. Click confirmation link
6. Should redirect to `/dashboard`

**Option B: Google OAuth**
1. Visit: `https://airbear.me/auth/signup`
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to `/dashboard`

**Option C: Apple OAuth**
1. Visit: `https://airbear.me/auth/signup`
2. Click "Continue with Apple"
3. Authenticate with Apple
4. Should redirect to `/dashboard`

**Verification:**
- ✅ User redirected to `/dashboard`
- ✅ User profile created in database
- ✅ Session persists on refresh

---

### Step 2: View Map & Available Rides ✅

1. Visit: `https://airbear.me/map`
2. **Expected:**
   - ✅ Map loads with Binghamton centered
   - ✅ Spots marked on map (green = available AirBears)
   - ✅ AirBear vehicles shown (🚲 icons)
   - ✅ Click spot markers to see details
   - ✅ Stats show available AirBears count

**Verification:**
- ✅ Map renders correctly
- ✅ Markers display
- ✅ Real-time updates work
- ✅ Stats are accurate

---

### Step 3: Book a Ride ✅

**Option A: From Map Page**
1. Visit: `https://airbear.me/map`
2. Click "Book a Ride" button
3. OR click a spot marker → Click "Book from Here"

**Option B: Direct Booking Page**
1. Visit: `https://airbear.me/book`
2. Select pickup location from list
3. Select destination from list
4. **Expected:**
   - ✅ Distance calculated automatically
   - ✅ Fare shown ($4.00 flat rate)
   - ✅ Estimated time shown

5. Click "Book Ride & Continue to Payment"
6. **Expected:**
   - ✅ Ride created in database
   - ✅ Status: "pending"
   - ✅ Redirects to `/checkout?rideId=XXX&amount=4.00`

**Verification:**
- ✅ Ride appears in database
- ✅ Correct pickup/destination
- ✅ Fare calculated correctly
- ✅ Redirects to checkout

---

### Step 4: Complete Payment ✅

1. On checkout page (`/checkout`)
2. **Expected:**
   - ✅ Ride summary displayed
   - ✅ Payment form loads
   - ✅ Stripe Elements rendered

3. **Test Payment Methods:**

   **A. Credit Card:**
   - Enter test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
   - Click "Pay $4.00"
   - **Expected:** ✅ Payment succeeds, redirects to dashboard

   **B. Apple Pay (if available):**
   - Click Apple Pay button
   - Authenticate
   - **Expected:** ✅ Payment succeeds

   **C. Google Pay (if available):**
   - Click Google Pay button
   - Authenticate
   - **Expected:** ✅ Payment succeeds

4. **After Payment:**
   - ✅ Redirects to `/dashboard`
   - ✅ Ride status: "accepted" or "pending"
   - ✅ Payment recorded in database
   - ✅ Toast notification shows success

**Verification:**
- ✅ Payment processed via Stripe
- ✅ Ride status updated
- ✅ Payment record created
- ✅ User redirected correctly

---

### Step 5: View Dashboard & Ride History ✅

1. Visit: `https://airbear.me/dashboard`
2. **Expected:**
   - ✅ Welcome message with username
   - ✅ Stats cards:
     - Total Rides
     - Completed Rides
     - Total Spent
     - CO₂ Saved
   - ✅ Recent rides list
   - ✅ Quick action buttons

3. **Check Ride Details:**
   - ✅ Ride shows correct pickup/destination
   - ✅ Status badge (pending/accepted/in_progress/completed)
   - ✅ Fare displayed
   - ✅ Date/time shown

**Verification:**
- ✅ Dashboard loads correctly
- ✅ Stats are accurate
- ✅ Ride history displays
- ✅ All data matches database

---

## 🚗 Testing as DRIVER

### Step 1: Register as Driver ✅

**Option A: Email Registration**
1. Visit: `https://airbear.me/auth/signup`
2. Register with email: `driver@airbear.me`
3. After registration, update user role in Supabase:
   ```sql
   UPDATE users SET role = 'driver' WHERE email = 'driver@airbear.me';
   ```

**Option B: OAuth (then update role)**
1. Register with Google/Apple
2. Update role in Supabase dashboard

**Verification:**
- ✅ User created
- ✅ Role set to "driver"

---

### Step 2: Login as Driver ✅

1. Visit: `https://airbear.me/auth/login`
2. Login with driver credentials
3. **Expected:** ✅ Redirects to `/dashboard` or `/driver`

---

### Step 3: Access Driver Dashboard ✅

1. Visit: `https://airbear.me/driver`
2. **Expected:**
   - ✅ Driver dashboard loads
   - ✅ Shows "Pending Ride Requests"
   - ✅ Auto-refreshes every 5 seconds
   - ✅ Shows active ride if one exists

**Verification:**
- ✅ Dashboard loads
- ✅ Pending rides displayed
- ✅ Real-time updates work

---

### Step 4: Accept a Ride ✅

1. On driver dashboard (`/driver`)
2. Find a pending ride request
3. Click "Accept Ride" button
4. **Expected:**
   - ✅ Ride status: "accepted"
   - ✅ Driver ID set to current driver
   - ✅ `accepted_at` timestamp set
   - ✅ Ride moves to "Active Ride" section
   - ✅ Toast notification shows success

**Verification:**
- ✅ Ride status updated in database
- ✅ Driver assigned correctly
- ✅ UI updates immediately

---

### Step 5: Start Ride ✅

1. On driver dashboard with active ride
2. Click "Start Ride" button
3. **Expected:**
   - ✅ Ride status: "in_progress"
   - ✅ `started_at` timestamp set
   - ✅ Button changes to "Complete Ride"

**Verification:**
- ✅ Status updated correctly
- ✅ Timestamps accurate

---

### Step 6: Complete Ride ✅

1. On driver dashboard with in-progress ride
2. Click "Complete Ride" button
3. **Expected:**
   - ✅ Ride status: "completed"
   - ✅ `completed_at` timestamp set
   - ✅ AirBear marked as available
   - ✅ Ride removed from active section
   - ✅ Toast notification shows success

**Verification:**
- ✅ Ride completed in database
- ✅ AirBear availability updated
- ✅ UI updates correctly

---

## 🔄 Complete End-to-End Test

### Passenger Flow:
1. ✅ Register → Login
2. ✅ View Map
3. ✅ Book Ride
4. ✅ Complete Payment
5. ✅ View Dashboard
6. ✅ See Ride Status Updates

### Driver Flow:
1. ✅ Register as Driver → Login
2. ✅ View Driver Dashboard
3. ✅ Accept Pending Ride
4. ✅ Start Ride
5. ✅ Complete Ride

### Combined Flow:
1. **Passenger** books ride → Status: "pending"
2. **Driver** sees ride in dashboard
3. **Driver** accepts ride → Status: "accepted"
4. **Passenger** sees status update in dashboard
5. **Driver** starts ride → Status: "in_progress"
6. **Driver** completes ride → Status: "completed"
7. **Passenger** sees completed ride in history

---

## 🐛 Common Issues & Fixes

### Issue: "Unauthorized" error
**Fix:** Check user is logged in, verify session

### Issue: Payment fails
**Fix:** Check Stripe keys are set, verify test card numbers

### Issue: Ride not appearing
**Fix:** Check database connection, verify ride was created

### Issue: Driver can't accept ride
**Fix:** Verify driver role is set, check ride status is "pending"

---

## ✅ Success Criteria

**All flows work when:**
- ✅ Registration/Login works (email + OAuth)
- ✅ Map loads and shows spots/AirBears
- ✅ Booking creates ride in database
- ✅ Payment processes successfully
- ✅ Dashboard shows correct data
- ✅ Driver can accept/start/complete rides
- ✅ Real-time updates work
- ✅ All status transitions work correctly

---

**Status:** Ready for comprehensive testing! 🧪




