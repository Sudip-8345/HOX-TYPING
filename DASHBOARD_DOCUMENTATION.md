# General Dashboard - Complete Feature Documentation

## Overview
The General Dashboard is the main landing page after user login, providing a comprehensive overview of all typing practice features, progress tracking, and personalized insights.

## Route Configuration
- **Path**: `/dashboard`
- **Protection**: Protected route (requires authentication)
- **Default after login**: Users are automatically redirected to dashboard after successful login/signup

## Key Features Implemented

### 1. Welcome Header
- **User Profile Display**: Shows user avatar (with fallback to initials)
- **Personalized Greeting**: Displays user's full name
- **Quick Access**: "Full Analytics" button linking to detailed analytics page

### 2. Progress Summary Cards (4 Cards)
1. **Average WPM**
   - Real-time calculation from typing sessions
   - Trend indicator (↑ percentage from last week)
   - Visual: Lightning icon in blue

2. **Accuracy**
   - Percentage accuracy from all sessions
   - Improvement percentage display
   - Visual: Target icon in green

3. **Current Streak**
   - Days of consecutive practice tracking
   - Motivational message
   - Visual: Fire icon in orange

4. **Practice Time**
   - Total hours of practice
   - Total session count
   - Visual: Clock icon in purple

### 3. Quick Start Section
Four quick-access buttons with icons:
- **Start Typing**: Begin immediate practice
- **Dictation Test**: Audio transcription tests
- **Exam Prep**: SSC, RRB, Courts preparation
- **AI Coach**: Get personalized feedback

### 4. Exam Readiness Analyzer
- **Readiness Score**: 0-100% calculation based on:
  - WPM performance (50% weight)
  - Accuracy performance (50% weight)
- **Status Badge**: 
  - Excellent (80%+): Green
  - Good (60-79%): Yellow
  - Needs Improvement (<60%): Orange
- **Target Metrics Display**:
  - Current WPM vs Target (30 WPM for SSC)
  - Current Accuracy vs Target (90% for SSC)
- **Personalized Recommendations**: Contextual advice based on score

### 5. Daily Attendance Heatmap (Practice Calendar)
- **12-Week View**: 84 days of practice history
- **Visual Color Coding**:
  - Gray: No practice
  - Light green (1 session)
  - Medium green (2 sessions)
  - Dark green (3 sessions)
  - Darkest green (4+ sessions)
- **Hover Details**: Date and session count on hover
- **Legend**: Shows color scale meaning

### 6. Recommended Drills
Four personalized drill recommendations:
1. **Accuracy Booster**: Focus on reducing errors (Medium, 15 min)
2. **Speed Training**: Increase typing speed (Hard, 20 min)
3. **Hindi Mangal Practice**: Master Mangal font (Medium, 30 min)
4. **Common Words Drill**: Practice frequent words (Easy, 10 min)

Each drill shows:
- Icon representation
- Duration
- Difficulty level
- Brief description

### 7. AI Coach Widget
- **Personalized Insights**: Weekly improvement analysis
- **Daily Tips**: Specific practice recommendations
- **Visual Branding**: Gradient blue-purple design
- **Call-to-Action**: Link to full AI Coach analysis

### 8. Leaderboard Preview
- **Top 5 Players Display**:
  - Rank indicators (Crown icons for top 3)
  - Avatar/initials
  - WPM and accuracy stats
  - Current streak with fire icon
- **Current User Highlighting**: Special styling for logged-in user
- **Full Board Link**: Navigate to complete leaderboard

### 9. Notifications Panel
- **Unread Indicator**: Badge showing count of new notifications
- **Notification Types**:
  - Achievements (milestones)
  - Tips (practice advice)
  - Updates (new features/content)
- **Timestamp**: Relative time display
- **Visual Distinction**: Different styling for read/unread

### 10. Recent Activity Feed
Shows last 4 practice sessions with:
- **Activity Type Icons**: Test, Practice, Dictation, Drill
- **Performance Metrics**: WPM and accuracy
- **Timestamp**: Relative time
- **Color-Coded Categories**:
  - Blue: Tests
  - Green: Practice
  - Purple: Dictation
  - Orange: Drills

### 11. Dictation & Transcription Section
Featured card highlighting dictation practice:
- **Feature Grid**: 4 key features
  - Audio Control (Play/Pause)
  - Speed Control (0.75x - 1.5x)
  - WPM & Accuracy Analysis
  - Hindi & English support
- **Call-to-Action**: "Start Dictation Test" button
- **Visual Design**: Purple-pink gradient styling
- **Badge**: "Free Tests Available"

### 12. Quick Tips Section
Three exam preparation tips:
1. **Consistency is Key**: Daily practice importance
2. **Accuracy First**: Focus on reducing errors before speed
3. **Practice All Fonts**: Master Mangal, KrutiDev, Remington

Color-coded cards with checkmark icons.

## Data Management

### State Variables
```typescript
- stats: Dashboard statistics (WPM, accuracy, streak, etc.)
- recentSessions: Array of typing sessions from useKV
- attendance: 84-day attendance array
- notifications: Array of notification objects
- profile: User profile from useKV storage
```

### Calculations
1. **Average WPM**: Mean of all session WPMs
2. **Average Accuracy**: Mean of all session accuracies
3. **Total Practice Time**: Sum of session durations (converted to hours)
4. **Current Streak**: Consecutive days with practice
5. **Exam Readiness**: `((avgWPM / 40) * 50) + ((avgAccuracy / 100) * 50)`
6. **Best WPM**: Maximum WPM from all sessions

### Default Values (New Users)
- Average WPM: 25
- Average Accuracy: 92%
- Total Practice Time: 45 hours
- Current Streak: 3 days
- Best WPM: 32
- Total Tests: 12
- Exam Readiness: 65%

## Responsive Design

### Breakpoints
- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 1024px)**: 2-column grid
- **Desktop (1024px+)**: Full 3-column layout with sidebars

### Grid Layouts
- Progress Cards: 1/2/4 columns (mobile/tablet/desktop)
- Quick Start: 1/2/4 columns
- Main Content: 2/3 split on large screens
- Drills: 1/2 columns

## Navigation Links

### Internal Routes
- `/analytics` - Full Analytics page
- `/start-type` - Start typing practice
- `/dictation` - Dictation hub
- `/exam-prep` - Exam preparation hub
- `/ai-coach` - AI Coach full page
- `/leaderboard` - Complete leaderboard
- `/practice` - Practice page

## Styling & Design

### Color Scheme
- **Primary Actions**: Blue gradient
- **Success/Accuracy**: Green shades
- **Speed/Performance**: Orange shades
- **AI Features**: Blue-purple gradient
- **Dictation**: Purple-pink gradient
- **Warnings**: Yellow shades

### Icons (Phosphor Icons)
- Lightning: Speed/Quick actions
- Target: Accuracy
- Fire: Streaks
- Clock: Time
- Trophy: Rankings
- Brain: AI features
- Microphone: Dictation
- Certificate: Exams
- Calendar: Attendance

### Components Used
- Card (shadcn/ui)
- Button (shadcn/ui)
- Badge (shadcn/ui)
- Progress (shadcn/ui)
- Avatar (shadcn/ui)
- Tabs (shadcn/ui)

## Performance Optimizations
1. **useEffect Dependencies**: Properly managed for stats calculation
2. **Conditional Rendering**: Default stats for new users
3. **Data Memoization**: Attendance generation only on mount
4. **Lazy Loading**: Routes loaded on demand

## Future Enhancement Ideas
1. Add goal setting widget
2. Implement achievement unlocking system
3. Add practice reminders configuration
4. Integrate real-time multiplayer practice
5. Add voice commands for accessibility
6. Export progress reports (PDF/Excel)
7. Social sharing of achievements
8. Custom theme selection
9. Practice analytics graphs
10. Typing speed history chart

## Accessibility Features
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on interactive elements
- Color contrast compliance
- Screen reader friendly text
- Focus indicators on all interactive elements

## Mobile-First Considerations
- Touch-friendly button sizes (min 44px)
- Responsive grid layouts
- Swipeable card elements
- Optimized font sizes
- Reduced motion option support

## Integration Points
- **AuthContext**: User authentication state
- **useKV Hook**: Persistent data storage (profile, sessions)
- **React Router**: Navigation between pages
- **shadcn/ui**: Component library
- **Phosphor Icons**: Icon system

---

## Quick Setup Guide

1. **Login/Signup**: Users redirected automatically to dashboard
2. **First Visit**: Shows default stats and empty calendar
3. **After Practice**: Stats update automatically from session data
4. **Data Persistence**: All data stored via useKV hook
5. **Real-time Updates**: Stats recalculate on component mount and data changes

## Testing Checklist
- [ ] Login redirects to dashboard
- [ ] Signup redirects to dashboard
- [ ] Profile data loads correctly
- [ ] Stats calculate accurately
- [ ] Attendance heatmap displays
- [ ] Quick start buttons navigate correctly
- [ ] Leaderboard shows current user highlighted
- [ ] Notifications display with unread count
- [ ] Recent activity shows latest sessions
- [ ] Responsive on mobile, tablet, desktop
- [ ] All links work correctly
- [ ] Icons render properly
- [ ] Default values show for new users
- [ ] Full Analytics button navigates correctly

---

**Last Updated**: November 17, 2025
**Version**: 1.0.0
**Component**: GeneralDashboard.tsx
