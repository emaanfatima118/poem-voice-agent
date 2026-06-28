# Stackwise Strategy Studio — Design Guidelines

## Design Approach

**Selected Approach**: Reference-Based (SaaS Platform Design)  
**Primary References**: Linear (planning/organization), Notion (structured workflows), Asana (project clarity)  
**Rationale**: Strategy Studio is a productivity-focused strategic planning tool requiring clean information architecture, clear visual hierarchy, and efficient workflows. The experience should feel calm, purposeful, and coaching-oriented.

## Core Design Principles

1. **Calm Clarity**: Generous whitespace, minimal distractions, coaching tone throughout
2. **Visual Continuity**: Seamless integration with existing Stackwise gradient system
3. **Guided Momentum**: Clear progress indicators, logical step sequences, confidence-building micro-copy
4. **Strategic Focus**: Information hierarchy that prioritizes insights over decoration

## Color System

### Module Color Palette (from existing Stackwise)
- **Purple Module**: `#6218DF` (primary gradient anchor)
- **Magenta Module**: Pink/magenta gradient tones
- **Blue Module**: Blue gradient tones
- **Strategy Studio**: Multi-gradient blend incorporating all module colors OR clean purple-to-blue gradient symbolizing cohesion

### Gradient Applications
- **Hero sections**: Gradient backgrounds with subtle dot pattern overlay (matching existing pages)
- **Module cards**: Gradient accents on left border or top edge
- **CTA buttons**: Gradient fills with white text
- **Status indicators**: Color-coded confidence bars and progress rings

### Neutral Foundation
- Background: `#FAFBFC` (off-white)
- Surface cards: `#FFFFFF` with subtle shadows
- Text primary: `#1A1A1A`
- Text secondary: `#6B7280`
- Borders: `#E5E7EB`

## Typography System

**Font Stack**: 'Helvetica Neue', Arial, sans-serif (matching existing Stackwise)

### Hierarchy
- **Hero Headlines**: 48-56px, weight 600, tight line-height (1.1)
- **Section Headers**: 32-36px, weight 500
- **Wizard Step Titles**: 24-28px, weight 500
- **Card Titles**: 18-20px, weight 500
- **Body Text**: 15-16px, weight 400, line-height 1.6
- **Metadata/Labels**: 13-14px, weight 500, uppercase tracking
- **Assistant Micro-copy**: 14-15px, weight 400, conversational tone

## Layout System

**Tailwind Spacing Primitives**: Focus on units of **2, 4, 8, 12, 16** for consistency

### Grid Framework
- **Container max-width**: `max-w-7xl` (1280px) for application views
- **Landing page**: `max-w-[1600px]` to match existing pages
- **Content columns**: 2-column split for wizard (70% main / 30% assistant drawer)
- **Card grids**: 3-column on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

### Spacing Rhythm
- Section padding: `py-16` to `py-24` on desktop, `py-12` on mobile
- Card padding: `p-6` to `p-8`
- Element spacing: `space-y-4` for related items, `space-y-8` for sections
- Button spacing: `px-6 py-3` for primary, `px-4 py-2` for secondary

## Component Library

### Navigation
- **Top Nav**: Sticky white bar with backdrop blur (`bg-white/80 backdrop-blur-md`)
- **Module Tabs**: Horizontal pill-style tabs with gradient active state
- **Breadcrumbs**: Subtle gray with purple active links

### Wizard Components
- **Progress Tracker**: Horizontal dot indicators with connecting lines, current step highlighted in gradient
- **Step Cards**: Large white cards with shadow, rounded corners (`rounded-xl`)
- **Input Fields**: Clean outlined style, focus state with gradient border
- **Selection Cards**: Hoverable cards with gradient left-border on selection
- **Autosave Indicator**: Subtle "Saved" text with checkmark, fades after 2s

### Assistant Drawer
- **Placement**: Right-side slide-out panel, 420px width on desktop
- **Tabs**: Three horizontal tabs (Insights, Simulations, Recommendations)
- **Content Cards**: Light gray backgrounds (`bg-gray-50`), rounded, with module color accents
- **Confidence Bars**: Horizontal gradient bars (red to green spectrum)
- **Action Buttons**: Small ghost buttons for secondary actions, gradient primary for main CTA

### Dashboard Elements
- **Metric Cards**: White cards with large number display, trend indicators (up/down arrows), sparkline charts
- **Playbook Cards**: Recipe cards with status badges, performance tags (🌟 High Performing), last-run dates
- **Quarterly Countdown**: Circular progress ring with days remaining in center
- **Insights Feed**: Timeline-style cards with icon indicators for wins/watchouts/next-moves

### Evaluation Matrix & Milestones
- **Matrix Grid**: 2x2 quadrant layout with priority/risk axes, draggable items plotted as cards
- **30/60/90 Columns**: Kanban-style columns with drag-and-drop, manual add buttons at top
- **Milestone Cards**: Compact cards with checkbox, title, assignee avatar, timeline badge
- **Filter Bar**: Top-aligned with dropdown selectors and search input

### Forms & Inputs
- **Text Inputs**: Outlined style with label above, placeholder text in gray
- **Dropdowns**: Custom styled with gradient caret, smooth animation
- **Multi-select Chips**: Purple pills with × close button
- **Toggle Switches**: Rounded switch with gradient active state
- **Radio Buttons**: Custom styled with gradient fill when selected

### Modals & Overlays
- **Explain My Suggestion Panel**: Slide-in drawer or centered modal with sections for summary, key influencers, confidence score, calculation note
- **Simulation Results**: Modal with before/after comparison, directional impact summary
- **Confirmation Dialogs**: Simple centered card with clear action buttons

## Strategy Studio Landing Page

### Hero Section (80vh)
- **Background**: Full-width gradient blend (purple → blue) with dot pattern overlay
- **Layout**: Centered content with headline, subheadline, dual CTAs
- **Headline**: "Your Marketing Strategy, Guided Every 90 Days"
- **Subheadline**: Coaching tone explaining the quarterly rhythm
- **CTAs**: Primary gradient button "Start Free Setup" + Ghost button "See How It Works"
- **Hero Image**: Dashboard preview floating with subtle shadow (right-aligned)

### Features Section (3-column grid)
- **Cards**: White cards with gradient top border, icon, title, description
- **Icons**: Simple line icons representing onboarding, quarterly rhythm, AI coaching
- **Spacing**: Generous padding between cards (`gap-8`)

### How It Works Section (Timeline)
- **Layout**: Vertical timeline with 3 phases (Onboarding → Active Quarter → Review)
- **Visual**: Gradient connector line between phase cards
- **Cards**: Large cards with phase number, duration, key activities

### Integration Section (2-column)
- **Left**: Text explaining module connections
- **Right**: Visual diagram or screenshot showing data flow between modules

### Social Proof (if applicable)
- **Layout**: Logo carousel or testimonial cards
- **Style**: Subtle grayscale logos with hover color effect

### CTA Section
- **Background**: Gradient similar to hero but inverted (blue → purple)
- **Content**: Short headline, single primary CTA
- **Spacing**: Generous vertical padding (`py-24`)

## Home Page Integration Suggestions

1. **Top Navigation**: Add "Strategy Studio" link between module links
2. **Hero CTA**: Secondary button "Set Up Your Strategy (Free)" 
3. **Module Cards Section**: Add Strategy Studio card with unique gradient showing it ties all modules together
4. **Floating Badge**: Subtle animated badge on module cards indicating "Connects to Strategy Studio"

## Animations (Minimal)

- **Page transitions**: Smooth fade-in for wizard steps (300ms)
- **Card hover**: Subtle lift effect (`hover:translate-y-[-2px]` with shadow increase)
- **Progress indicators**: Smooth fill animations for confidence bars and countdown rings
- **Drawer slide**: 400ms ease-out slide for Assistant drawer
- **Success states**: Brief scale pulse (1.05) on save/complete actions
- **Floating hero images**: Gentle float animation (existing pattern)

## Accessibility Standards

- **Keyboard navigation**: Full tab/arrow key support throughout wizards
- **Focus indicators**: Clear gradient outline on focused elements
- **ARIA labels**: Descriptive labels for all interactive elements
- **Color contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Screen reader support**: Semantic HTML with proper heading hierarchy

## Micro-copy Tone

- **Coaching**: "You're evolving, not rebuilding"
- **Clarity**: "This step takes 2-3 minutes"
- **Transparency**: "I noticed engagement dropped — that's why this surfaced"
- **Confidence**: "Strong alignment with your current goals"
- **Calm**: Avoid urgency language, focus on guidance