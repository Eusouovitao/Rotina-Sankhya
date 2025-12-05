# Design Guidelines: Gantt Chart System Routine Manager

## Design Approach

**Selected Approach**: Design System-Inspired Dashboard
Drawing from Linear's clean data presentation, Notion's efficient forms, and modern admin dashboard patterns (Retool, Vercel Dashboard). Focus on information density, clarity, and efficient workflow for technical users managing system routines.

## Core Design Elements

### Typography
- **Primary Font**: Inter or similar system font via Google Fonts
- **Headings**: 
  - Page title: text-2xl font-semibold
  - Section headers: text-lg font-medium
  - Card titles: text-base font-medium
- **Body Text**: text-sm for most UI elements, text-xs for metadata/timestamps
- **Code/Technical**: font-mono for routine IDs, time displays

### Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Compact elements: p-2, gap-2
- Page margins: px-6 to px-8

**Grid Structure**:
- Sidebar (fixed): 256px width on desktop, collapsible on mobile
- Main content: Full remaining width with max-w-7xl container
- Gantt chart: Full-width scrollable container

### Component Library

**Dashboard Layout**:
- Fixed left sidebar with navigation and quick stats
- Top bar with breadcrumbs, search, and user menu
- Main content area split into:
  - Control panel (top): Add routine button, filters, view toggles
  - Gantt chart viewer (center): Primary visualization
  - Routine list (side panel or bottom): Table/cards showing all routines

**Gantt Chart Visualization**:
- 24-hour timeline as horizontal axis
- Each routine as horizontal bar showing duration and frequency
- Color-coded bars:
  - Seconds-frequency: Distinct color (e.g., orange/amber tones)
  - Minutes-frequency: Distinct color (e.g., blue tones)
  - Hours-frequency: Distinct color (e.g., purple tones)
- Timeline grid lines every hour with labels
- Hover states showing routine details in tooltip
- Current time indicator as vertical line
- Zoomable timeline (show hours/minutes/seconds based on zoom level)

**Routine Management Panel**:
- Modal or slide-over panel for add/edit routine
- Form fields:
  - Routine name (text input)
  - Frequency type (radio buttons or segmented control: Second/Minute/Hour)
  - Start time (time picker, 24h format)
  - Duration (number input with unit selector)
  - Status toggle (active/inactive)
- Clear primary action button for save
- Secondary actions for cancel/delete

**Data Table/List**:
- Compact table showing all routines
- Columns: Name, Type, Start Time, Duration, Status, Actions
- Inline quick actions (edit, delete, toggle status)
- Sortable columns
- Search/filter capabilities

**Navigation Sidebar**:
- Dashboard home
- Routines overview
- Active routines
- Routine history/logs
- Settings
- Footer with system status indicator

**Status Indicators**:
- Badge components for frequency types
- Status dots for active/inactive states
- Real-time pulse animation for currently running routines

### Visual Hierarchy

**Information Density**:
- Prioritize Gantt chart as primary focus (60% of viewport height)
- Efficient use of space with compact controls
- Collapsible panels for detailed information
- Strategic use of whitespace only around major sections

**Interactive States**:
- Subtle hover states on table rows and chart bars
- Clear focus states for keyboard navigation
- Loading skeletons for real-time data updates
- Toast notifications for CRUD actions

### Responsive Behavior

**Desktop (lg:)**:
- Sidebar visible, full Gantt chart, side-by-side panels

**Tablet (md:)**:
- Collapsible sidebar, full-width Gantt, stacked panels

**Mobile (base)**:
- Hidden sidebar (hamburger menu), horizontal scroll Gantt, stacked layout
- Touch-optimized controls with larger tap targets

### Images

**No hero image required** - This is a functional dashboard prioritizing data visualization over marketing aesthetics. Focus on chart clarity and interface efficiency.

### Key Interactions

- Drag-and-drop to adjust routine timing on Gantt chart
- Click bar to view/edit routine details
- Real-time updates without page refresh
- Keyboard shortcuts for power users (add routine, search, etc.)
- Export functionality (CSV/PDF of schedule)

### Accessibility

- ARIA labels on all interactive chart elements
- Keyboard navigation through Gantt bars and timeline
- Screen reader announcements for routine updates
- High contrast mode support for chart visualization
- Focus trap in modals

This dashboard prioritizes **clarity, efficiency, and real-time monitoring** for technical users managing complex system routines.