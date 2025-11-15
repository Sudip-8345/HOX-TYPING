# Planning Guide

TypistPro India - An online Hindi and English typing practice platform with real-time AI feedback, multiple font support (Mangal, KrutiDev, Remington, Inscript), exam mode simulations (SSC, RRB, High Court), and comprehensive performance tracking. Features a welcoming homepage, full typing practice mode with live metrics, and leaderboard system. Perfect for government exam preparation.

**Experience Qualities**: 
1. **Professional** - Clean, exam-focused interface similar to professional government typing test environments with clear visual feedback.
2. **Intuitive** - Simple typing interface with real-time character highlighting, audio guides, and instant metrics that make practice accessible.
3. **Educational** - Comprehensive AI-powered feedback with weak key detection, personalized tips, and progress tracking to accelerate learning.

**Complexity Level**: Complex Application (advanced functionality with multiple languages, fonts, AI, and exam modes)
  - Hindi/English typing practice platform with multi-language support, AI-powered coaching, real-time metrics, exam mode simulations, weak key detection, progress charts, and comprehensive leaderboard system.

## Essential Features

### Homepage & Navigation
- **Functionality**: Welcoming homepage showcasing platform features with clear navigation to practice and leaderboard sections
- **Purpose**: Provide users with overview and easy access to all features
- **Trigger**: Landing on the site or clicking home/back buttons
- **Progression**: User arrives → sees feature highlights and call-to-action → clicks "Start Practice" or "View Leaderboard" → navigates to respective section
- **Success criteria**: Fast page load, clear CTAs, responsive navigation on all devices

### Multi-Language & Font Support
- **Functionality**: Support for 8+ Indian languages (English, Hindi, Marathi, Punjabi, Bengali, Gujarati, Tamil, Telugu) with multiple fonts per language (KrutiDev 010/020/030, DevLys, Mangal, Apache, Remington GAIL/CBI for Hindi; JetBrains Mono, Courier for English)
- **Purpose**: Caters to diverse Indian typing exam requirements and regional language support
- **Trigger**: Language and font dropdowns in header
- **Progression**: User selects language → font dropdown updates with relevant fonts → user selects font → practice text and input area update accordingly
- **Success criteria**: Proper rendering of all fonts, no character overlap, fonts load within 1 second

### Exam Mode Simulation
- **Functionality**: Multiple exam modes (SSC 10min, RRB 8min, High Court, CRPF, Delhi Police) with specific rules like backspace disabled, 5% error penalty, exact timing
- **Purpose**: Prepares users for actual government typing exams with realistic constraints
- **Trigger**: Exam mode selector in header
- **Progression**: User selects exam type → timer sets automatically → backspace disables → practice begins → timer ends → results calculated with exam-specific scoring
- **Success criteria**: Timer accuracy ±1 second, backspace fully disabled in exam mode, scoring matches official exam formulas

### Real-Time AI Smart Coach
- **Functionality**: Analyzes typing patterns in real-time, identifies weak keys/combinations (e.g., "त्र", "ज्ञ", "श्र"), detects hand weakness (left/right), tracks backspace frequency per character
- **Purpose**: Provides intelligent, actionable feedback to accelerate improvement
- **Trigger**: Continuous analysis during typing, tips displayed after session or in real-time sidebar
- **Progression**: User types → AI tracks keystroke patterns → identifies weak areas → displays tips like "आप 'श' + 'ज्ञ' कॉम्बिनेशन में अटकते हो" → next paragraph auto-focuses on weakness
- **Success criteria**: Tips are specific and accurate, weakness detection 95%+ accurate, AI response within 2 seconds

### Weak Key Heatmap Visualization
- **Functionality**: Live keyboard heatmap showing color-coded weak/strong keys (red = weak, green = strong) using lightweight ML model
- **Purpose**: Visual representation of typing strengths/weaknesses for targeted practice
- **Trigger**: Displays in sidebar during and after typing sessions
- **Progression**: User types → keystroke data collected → heatmap updates live → color intensity reflects error frequency
- **Success criteria**: Heatmap updates smoothly without lag, colors accurately reflect performance, mobile-friendly layout

### Comprehensive Metrics Dashboard
- **Functionality**: Live tracking of Gross WPM, Net WPM, Accuracy %, Errors, Correct/Wrong Keystrokes, CPM, Timer with progress bars (linear + circular), mini speed trend graph
- **Purpose**: Complete performance visibility for data-driven improvement
- **Trigger**: Updates on every keystroke during active session
- **Progression**: Session starts → all metrics initialize → update in real-time → final values displayed on completion
- **Success criteria**: All calculations accurate, updates <50ms, no UI jank, metrics persist

### 1500+ Practice Paragraphs Library
- **Functionality**: Pre-loaded paragraphs including past 10 years real SSC/RRB questions, daily new content, difficulty levels, user upload via text/OCR
- **Purpose**: Diverse practice content that matches actual exam patterns
- **Trigger**: Random paragraph on load/restart, user can upload custom text or select from library
- **Progression**: User starts session → random paragraph loads → completes → new random paragraph on restart OR user uploads image → OCR extracts text → becomes practice paragraph
- **Success criteria**: Paragraph variety, accurate OCR (90%+), user uploads work smoothly

### Global & Local Leaderboards
- **Functionality**: Daily/Weekly/All-Time rankings, filterable by font/exam type/duration, Top 100 display + user rank, verified badges for 80+ WPM
- **Purpose**: Gamification and motivation through competition
- **Trigger**: View leaderboard button, auto-updates after session completion
- **Progression**: User completes session → score submitted → rank calculated → displayed on leaderboard → user sees improvement
- **Success criteria**: Real-time ranking, fair scoring, no duplicate entries, mobile-optimized view

### Comprehensive Analytics Dashboard
- **Functionality**: Advanced analytics page with progress trends over time (multi-line charts showing WPM, accuracy, CPM), session breakdown by time of day, performance heatmaps, accuracy progress tracking, language/exam type distribution pie charts, weak areas identification with heatmap grids, and AI-powered recommendations
- **Purpose**: Provide deep insights into typing performance patterns, identify strengths/weaknesses, track long-term improvement, and enable data-driven practice decisions
- **Trigger**: Analytics button in header, accessible from homepage and practice pages
- **Progression**: User clicks Analytics → comprehensive dashboard loads → user explores different metrics and time ranges → identifies weak areas → clicks focused practice recommendations → returns to targeted practice
- **Success criteria**: Charts render smoothly with real data, time range filters work correctly, responsive design works on all devices, AI recommendations are actionable and personalized

### Session Results & Certificates
- **Functionality**: Detailed result modal with confetti animation (50+ WPM or 97%+ accuracy), WPM chart per minute, accuracy timeline, weak keys list, global rank, downloadable PDF certificate, shareable social card
- **Purpose**: Celebration of achievement and shareable proof of skill
- **Trigger**: Session completion (time up or manual submit)
- **Progression**: Session ends → result modal opens with animation → user views detailed stats → downloads certificate OR shares on WhatsApp/Instagram
- **Success criteria**: Animations smooth, PDF generates correctly with user data, social cards optimized for sharing

## Edge Case Handling

- **No Internet Connection**: App works 100% offline after first load (PWA), syncs progress when reconnected
- **Empty Input**: Metrics show 0 gracefully with encouraging placeholder text
- **Mid-Session Restart**: Confirmation dialog prevents accidental data loss, doesn't save incomplete sessions
- **Paste Attempts**: Fully blocked with toast notification explaining why (maintains practice integrity)
- **Timer Accuracy**: Background tab handling - pause timer when tab loses focus to prevent cheating
- **Font Loading Failures**: Fallback fonts cascade properly, error message if critical font unavailable
- **Long Text Overflow**: Auto-scrolling follows cursor, line-by-line scroll after 3 lines
- **Mobile Keyboard**: Virtual keyboard option for Hindi (Inscript/Remington), handles on-screen keyboard height
- **Rapid Key Presses**: Debouncing prevents input buffer overflow and ensures accurate tracking
- **User Upload Errors**: Clear error messages for invalid files, OCR failure fallbacks, file size limits
- **Leaderboard Spam**: Rate limiting on submission, validation of scores to prevent cheating
- **Session Interruption**: Auto-save progress, resume capability, clear state management

## Design Direction

The design should feel professional, exam-focused, and distinctly Indian - combining the precision of government typing test environments with modern web app aesthetics. A clean, data-rich interface emphasizes the typing area while providing comprehensive metrics without overwhelming. The aesthetic balances traditional exam preparation tools with contemporary design patterns: focused, information-dense yet organized, and culturally appropriate with bilingual support throughout.

## Color Selection

Triadic color scheme representing professionalism, focus, and energy - suitable for exam preparation with Indian sensibilities.

- **Primary Color**: Deep Blue (oklch(0.40 0.12 240)) - Represents trust and professionalism, used for main actions and header
- **Secondary Colors**: Warm Orange (oklch(0.65 0.15 40)) for success highlights and positive feedback, Teal (oklch(0.55 0.12 180)) for supporting elements
- **Accent Color**: Vibrant Saffron (oklch(0.70 0.18 60)) - Energizing accent for active states and achievements, culturally resonant
- **Foreground/Background Pairings**:
  - Background (Light Cream oklch(0.97 0.01 80)): Dark Navy text (oklch(0.25 0.05 240)) - Ratio 12.1:1 ✓
  - Card (White oklch(0.99 0 0)): Dark Navy text (oklch(0.25 0.05 240)) - Ratio 13.5:1 ✓
  - Primary (Deep Blue oklch(0.40 0.12 240)): White text (oklch(0.98 0 0)) - Ratio 9.2:1 ✓
  - Secondary (Warm Orange oklch(0.65 0.15 40)): Dark text (oklch(0.25 0.05 240)) - Ratio 5.8:1 ✓
  - Accent (Saffron oklch(0.70 0.18 60)): Dark text (oklch(0.25 0.05 240)) - Ratio 6.2:1 ✓
  - Success (Green oklch(0.60 0.15 145)): White text - Ratio 5.1:1 ✓
  - Error (Red oklch(0.55 0.20 25)): White text - Ratio 4.8:1 ✓
  - Muted (Soft Gray oklch(0.88 0 0)): Muted text (oklch(0.50 0 0)) - Ratio 6.1:1 ✓

## Font Selection

Typography must support multiple scripts (Devanagari, Latin, regional Indian scripts) with high legibility and authentic exam font rendering.

- **Primary Font**: Inter (Google Fonts) - Clean sans-serif for UI elements and English content
- **Hindi Fonts**: Mangal (system fallback), Noto Sans Devanagari (Google Fonts) for authentic Hindi rendering
- **Monospace Font**: JetBrains Mono (Google Fonts) for English typing practice, Noto Sans Mono for Hindi

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/26px/tight tracking (-0.02em) with Hindi: Noto Sans Devanagari Bold/28px
  - H2 (Section Headers): Inter SemiBold/20px/normal tracking
  - Body (Practice Text English): JetBrains Mono Regular/22px/relaxed leading (1.8)
  - Body (Practice Text Hindi): Noto Sans Devanagari Regular/24px/relaxed leading (1.9)
  - Metrics (Numbers): Inter Bold/36px/tight tracking for emphasis
  - Labels: Inter Medium/13px/wide tracking (0.02em) uppercase
  - AI Tips: Inter Regular/15px/normal, bilingual support
  - Button Text: Inter SemiBold/15px

Note: User-selectable fonts (KrutiDev, DevLys, etc.) will be loaded dynamically based on selection.

## Animations

Animations should be purposeful and performance-focused, celebrating achievements while maintaining professional exam simulation atmosphere.

- **Purposeful Meaning**: Motion confirms actions (key press feedback), celebrates milestones (confetti on high scores), guides attention (weak key highlights), and provides system feedback
- **Hierarchy of Movement**: Character highlighting (instant 0ms), keystroke feedback (50ms pulse), metric updates (200ms), UI transitions (300ms), celebration animations (1-2s)

### Specific Animation Patterns:
- **Character Feedback**: Instant color change for correct/incorrect, subtle shake (100ms) on error
- **Metric Updates**: Smooth counter animations (300ms ease-out) for WPM/accuracy changes
- **Confetti Celebration**: Physics-based confetti burst (2s) on achieving 50+ WPM or 97%+ accuracy
- **Progress Bar**: Smooth fill animation (200ms) as typing progresses
- **Heatmap Updates**: Gradual color transitions (500ms) on key performance data
- **Modal Entrance**: Slide-up with fade (400ms ease-out) for result modal
- **Button Interactions**: 100ms scale (0.95) on press, 200ms hover elevation
- **Toast Notifications**: Slide-in from top (300ms) for alerts
- **Chart Animations**: Smooth line drawing (800ms) on new data points

## Component Selection

- **Components**: 
  - Card (practice area, metrics panel, session results, leaderboard entries)
  - Button (restart, pause/resume, submit, language/font/exam selectors)
  - Select/Dropdown (language, font, duration, exam mode dropdowns in header)
  - Progress bar (session timer linear + circular variants)
  - Separator (dividing sections)
  - Tooltip (metric explanations, keyboard shortcuts)
  - Dialog (result modal with detailed stats)
  - Sheet/Drawer (settings panel, leaderboard side panel on mobile)
  - Badge (language indicator, exam mode badge, verified user badges)
  - Tabs (switching between different views: practice/leaderboard/history)
  - Switch (sound toggle, backspace mode, dark mode)
  - Alert/Toast (paste warnings, session notifications)
  - ScrollArea (long paragraph display, leaderboard scrolling)
  - Accordion (collapsible metrics on mobile)
  
- **Customizations**: 
  - Custom TypingDisplay with advanced character-level highlighting and line-by-line scroll
  - Custom MetricCard with real-time animated counters and icon variants
  - Custom ProgressChart using recharts for multi-metric visualization (WPM, accuracy, CPM over time)
  - Custom KeyboardHeatmap component visualizing weak/strong keys with color gradient
  - Custom VirtualKeyboard for mobile Hindi typing (Inscript/Remington layouts)
  - Custom CertificateGenerator for PDF download with user stats
  - Custom ConfettiEffect using canvas-confetti library
  - Custom AICoachPanel with real-time tips and weakness detection
  - Custom LeaderboardTable with filtering and ranking
  - Custom ExamModeIndicator showing exam type and rules

- **States**: 
  - Buttons: Default/Hover (lift shadow)/Active (scale 0.95)/Disabled (opacity 0.5 + cursor-not-allowed)/Loading (spinner)
  - Input area: Focused (accent border glow)/Active Typing (pulse indicator)/Paused (dim overlay)/Complete (success border)/Error (red shake)
  - Metrics: Live Updating (subtle pulse)/Milestone Reached (highlight flash)/Final (bold emphasis)
  - Practice text characters: Pending (gray)/Current (accent underline + cursor)/Correct (green bg)/Incorrect (red bg + underline)/Skipped (yellow bg)
  - Exam mode: Pre-start (countdown)/Active (strict rules)/Time Warning (red timer flash)/Complete (locked)
  - Leaderboard entries: Current user (highlight bg)/Top 3 (gold/silver/bronze badges)/Verified (check badge)

- **Icon Selection**: 
  - @phosphor-icons/react (weight="duotone" for main features, weight="bold" for actions)
  - Keyboard (app logo)
  - ArrowCounterClockwise (restart)
  - Gear (settings)
  - ChartLine (progress/stats)
  - Trophy (leaderboard)
  - Target (accuracy)
  - Lightning (speed/WPM)
  - Warning/X (errors)
  - Clock/Timer (time tracking)
  - Fire (streak/hot keys)
  - Brain (AI coach)
  - DownloadSimple (certificate download)
  - ShareNetwork (social sharing)
  - Play/Pause (session control)
  - SpeakerHigh/SpeakerSlash (sound toggle)
  - Translate (language switch)
  - TextAa (font selector)
  - Certificate (exam mode)
  - CaretDown (dropdowns)

- **Spacing**: 
  - Consistent use of Tailwind spacing scale
  - Header: px-6 py-4 (fixed, backdrop-blur)
  - Main container: px-4 md:px-6 lg:px-8 py-6 (responsive)
  - Card padding: p-4 md:p-6 (adaptive)
  - Metrics grid: gap-3 md:gap-4
  - Between major sections: space-y-6 md:space-y-8
  - Button groups: gap-2 md:gap-3
  - Form elements: space-y-4

- **Mobile**: 
  - Desktop (>1024px): Three-column layout (sidebar-left metrics / center practice area / sidebar-right coach)
  - Tablet (768-1024px): Two-column (practice area / collapsible sidebar)
  - Mobile (<768px): Single column with fixed header, scrollable content, fixed bottom action bar
  - Touch targets: minimum 44x44px for all interactive elements
  - Virtual keyboard: slides up from bottom, doesn't cover input area
  - Swipe gestures: swipe right for metrics drawer, swipe left for coach panel
  - Bottom bar: always visible with Restart/Pause/Submit/Settings icons
  - Collapsible sections: Accordion for metrics, expandable AI tips
  - Font sizes: scale up 10-15% on mobile for better readability
