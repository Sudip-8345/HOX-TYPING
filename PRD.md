# Planning Guide

A focused typing practice application that helps users improve their typing speed and accuracy through real-time feedback, personalized metrics, and intelligent insights.

**Experience Qualities**: 
1. **Effortless** - The interface fades into the background, allowing users to focus entirely on their typing practice without distraction or confusion.
2. **Responsive** - Every keystroke provides immediate, clear feedback that motivates improvement without overwhelming the learner.
3. **Empowering** - Users feel their progress through data-driven insights and see exactly where to improve next.

**Complexity Level**: Light Application (multiple features with basic state)
  - Single-screen focused practice with real-time metrics, session history tracking, and AI-powered feedback for improvement areas.

## Essential Features

### Real-Time Typing Practice
- **Functionality**: Displays prompt text, captures user input, highlights correct/incorrect characters in real-time
- **Purpose**: Core learning mechanism - immediate visual feedback reinforces correct typing patterns
- **Trigger**: Auto-focus on page load, keyboard shortcut (Ctrl+R) to restart
- **Progression**: User lands on page → sees prompt → begins typing → sees green (correct) / red (incorrect) highlighting → completes or restarts → views final metrics
- **Success criteria**: Character-by-character comparison works flawlessly, no input lag, highlighting updates <100ms

### Live Performance Metrics
- **Functionality**: Real-time WPM (words per minute), accuracy percentage, error count, elapsed time display
- **Purpose**: Provides immediate performance awareness and motivates improvement through gamification
- **Trigger**: Updates automatically on every keystroke during active session
- **Progression**: Session starts → timer begins → metrics calculate and update live → session ends → final metrics displayed
- **Success criteria**: Calculations are accurate, updates don't cause UI jank, metrics persist after session

### Session History & Progress Tracking
- **Functionality**: Stores past session data, displays line chart of WPM over time
- **Purpose**: Shows improvement trajectory, motivates continued practice
- **Trigger**: Automatically saves on session completion, displays in sidebar
- **Progression**: User completes session → data saved to KV store → chart updates → user sees progress trend
- **Success criteria**: Data persists across page refreshes, chart is readable and updates smoothly

### AI-Powered Insights
- **Functionality**: Analyzes error patterns, identifies problematic keys/character combinations
- **Purpose**: Provides actionable feedback on specific areas needing improvement
- **Trigger**: Generates after each completed session based on error data
- **Progression**: Session completes → AI analyzes error patterns → tip displayed in sidebar → user focuses on weak areas in next session
- **Success criteria**: Tips are specific and actionable, appear within 2 seconds of session end

### Language Support
- **Functionality**: Switch between English and Hindi (Devanagari) practice texts
- **Purpose**: Supports multilingual typing practice for diverse users
- **Trigger**: Language selector in header or footer
- **Progression**: User clicks language toggle → new prompt loads → practice continues in selected language
- **Success criteria**: Proper font rendering for Devanagari, appropriate difficulty level for each language

## Edge Case Handling

- **Empty Input**: If user hasn't typed anything, metrics show 0 WPM, 0% accuracy gracefully
- **Rapid Restarts**: Debounce restart button to prevent accidental double-clicks from breaking state
- **Incomplete Sessions**: Allow users to restart mid-session without penalty, don't save incomplete data
- **Long Sessions**: Cap practice sessions at 5 minutes to maintain data quality and user focus
- **No History**: Show empty state with encouraging message when user has no past sessions yet
- **Paste Prevention**: Disable paste to ensure genuine typing practice (show toast notification if attempted)

## Design Direction

The design should feel focused, calm, and professional - like a precision tool rather than a playful game. A minimal interface emphasizes the typing area, with metrics presented as clean data visualizations that inform without distracting. The aesthetic draws from developer tools and productivity apps: purposeful, unadorned, and highly functional.

## Color Selection

Analogous color scheme centered around blue-violet, conveying focus, professionalism, and trust while maintaining visual harmony.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 250)) - Represents focus and precision, used for primary actions and key UI elements
- **Secondary Colors**: Soft Blue-Gray (oklch(0.65 0.05 240)) for supporting elements, Light Periwinkle (oklch(0.85 0.08 260)) for hover states
- **Accent Color**: Vibrant Violet (oklch(0.55 0.20 280)) - Draws attention to active states and important metrics
- **Foreground/Background Pairings**:
  - Background (White oklch(0.98 0 0)): Dark text (oklch(0.20 0 0)) - Ratio 15.8:1 ✓
  - Card (Light Gray oklch(0.96 0 0)): Dark text (oklch(0.20 0 0)) - Ratio 14.5:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text (oklch(0.98 0 0)) - Ratio 8.2:1 ✓
  - Accent (Vibrant Violet oklch(0.55 0.20 280)): White text (oklch(0.98 0 0)) - Ratio 5.1:1 ✓
  - Muted (Soft Gray oklch(0.90 0 0)): Muted text (oklch(0.50 0 0)) - Ratio 5.9:1 ✓
  - Success (Green oklch(0.65 0.15 145)): White text - Ratio 4.9:1 ✓
  - Error (Red oklch(0.60 0.20 25)): White text - Ratio 5.2:1 ✓

## Font Selection

Typography should feel modern, technical, and highly legible at various sizes - optimized for extended reading and data display.

- **Primary Font**: Inter (Google Fonts) - Clean, neutral sans-serif with excellent legibility for UI elements and metrics
- **Monospace Font**: JetBrains Mono (Google Fonts) - For typing practice area, ensures character-level precision visibility

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter SemiBold/24px/tight tracking (-0.02em)
  - H2 (Section Headers): Inter Medium/18px/normal tracking
  - Body (Practice Text): JetBrains Mono Regular/20px/relaxed leading (1.7)
  - Metrics (Numbers): Inter Bold/32px/tight tracking for emphasis
  - Labels: Inter Regular/14px/wide tracking (0.01em) uppercase
  - AI Tips: Inter Regular/15px/normal, italic for differentiation

## Animations

Animations should be subtle and functional, reinforcing user actions without demanding attention - think of smooth state transitions rather than celebratory flourishes.

- **Purposeful Meaning**: Motion communicates system response (button press feedback) and state changes (metric updates, session completion)
- **Hierarchy of Movement**: Character highlighting receives highest priority (instant), followed by metric updates (smooth 200ms), then secondary UI transitions (300ms)

### Specific Animation Patterns:
- **Character Feedback**: Instant color change (0ms) for correct/incorrect, subtle scale (1.02x, 100ms) on error
- **Metric Updates**: Number counter animations (400ms ease-out) when values change significantly
- **Session Complete**: Gentle fade-in of final stats card (300ms), subtle confetti burst only on personal best
- **Button States**: 150ms ease for hover/press states, maintaining responsive feel
- **Chart Updates**: Smooth line interpolation (500ms) when new data point added

## Component Selection

- **Components**: 
  - Card (practice area, metrics panel, session results)
  - Button (restart, settings, language switch)
  - Progress bar (session timer visualization)
  - Separator (dividing metrics from practice area)
  - Tooltip (explaining metric calculations)
  - Sheet/Drawer (settings panel for advanced options)
  - Badge (language indicator, session status)
  - Alert (paste prevention warning)
  
- **Customizations**: 
  - Custom TypingDisplay component with character-level highlighting
  - Custom MetricCard with animated number counters
  - Custom ProgressChart using recharts library for session history
  - Custom KeyboardShortcut hint component

- **States**: 
  - Buttons: Default/Hover (scale 1.02)/Active (scale 0.98)/Disabled (opacity 0.5)
  - Input area: Focused (subtle glow ring)/Typing (hide cursor between chars)/Complete (read-only)
  - Metrics: Updating (pulse animation)/Stable/Final (bold emphasis)
  - Practice text characters: Pending (muted)/Current (accent border)/Correct (success green)/Incorrect (error red bg)

- **Icon Selection**: 
  - @phosphor-icons/react throughout
  - ArrowCounterClockwise (restart)
  - Gear (settings)
  - ChartLine (progress/stats)
  - Keyboard (typing mode indicator)
  - Timer (session duration)
  - Target (accuracy)
  - Lightning (WPM)
  - Warning (errors)

- **Spacing**: 
  - Consistent use of Tailwind spacing scale
  - Main container: px-6 py-4 (desktop), px-4 py-3 (mobile)
  - Card padding: p-6 (desktop), p-4 (mobile)
  - Metrics grid: gap-4
  - Between sections: mb-8 (desktop), mb-6 (mobile)

- **Mobile**: 
  - Desktop: Two-column layout (80% practice / 20% metrics sidebar)
  - Tablet: Metrics collapse below practice area, full-width stacked
  - Mobile: Single column, metrics become compact horizontal cards
  - Touch targets minimum 44x44px
  - Collapsible metrics panel with show/hide toggle on mobile
