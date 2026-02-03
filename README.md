# Cultilytics — Plant Cultivation Analytics Platform

A full-stack web application for tracking and managing plant cultivation with an interactive map-based interface. Built for gardeners, farmers, and plant enthusiasts who need comprehensive plant management tools including health monitoring, growth tracking, task scheduling, and expense management.

## Overview

A full-stack web application for tracking and managing plant cultivation with an interactive map-based interface. Built for gardeners, farmers, and plant enthusiasts who need comprehensive plant management tools including health monitoring, growth tracking, task scheduling, and expense management.

## Goals

- Create an intuitive, map-first interface for visualizing plant locations
- Provide comprehensive tracking for all aspects of plant care (health, treatments, growth, tasks, yield, expenses)
- Enable photo documentation with automatic thumbnail generation
- Support both mobile and desktop experiences with responsive design
- Implement secure user authentication and data isolation

## Process

**Architecture Planning:** Designed a modular component structure following atomic design principles (Atoms/Molecules) with clear separation of concerns between UI components, composables, and stores.

**Database Design:** Created a relational schema with 9 interconnected tables using Drizzle ORM, supporting complex relationships between users, markers (plants), and tracking records with proper cascade deletes.

**Map Integration:** Implemented MapLibre GL with satellite imagery, draggable markers, and interactive popups for geographic plant management.

**Image Processing:** Built a custom image pipeline using Sharp for automatic thumbnail/medium/large generation with carousel viewing and deletion capabilities.

**Responsive UI:** Developed dual layouts—mobile bottom sheet and desktop sidebar—both providing quick action buttons, timeline views, and statistics dashboards.

**Security:** Integrated nuxt-security for CSP headers, request size limiting, and method restrictions; implemented session-based auth with Zod validation.

## Solution

**Tech Stack:** Nuxt 4 (Vue 3), SQLite + Drizzle ORM, Pinia, Tailwind CSS, MapLibre GL, Sharp

**Key Features:**
- **Interactive Map:** Click-to-add markers, draggable positioning, satellite imagery
- **Plant Tracking:** Health records (5-level status), treatments (6 types), growth measurements, task management with priorities
- **Yield & Expense Tracking:** Harvest logging with quality ratings, cost categorization for ROI analysis
- **Photo Management:** Multi-size image processing, carousel viewer, grid display
- **Timeline View:** Chronological activity feed combining treatments, growth, and health updates
- **Mobile-First Design:** Bottom sheet UI with quick actions, responsive statistics cards
- **Real-Time Updates:** Immediate data refresh after form submissions via modular EntityForm component

**Components:** 35+ Vue components including form system with configuration-driven fields, reusable atoms (buttons, badges, inputs), molecules (timeline, uploader, carousel), and stores for state management.

## Development

```bash
# Development
npm run dev                    # Start development server with --host flag
npm run build                  # Build for production
npm run generate               # Generate static site
npm run preview                # Preview production build

# Database
npm run db:generate           # Generate Drizzle migrations
npm run db:migrate            # Run database migrations

# Post-install
npm run postinstall           # Prepare Nuxt (runs automatically after npm install)
```
