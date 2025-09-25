# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vault is a Next.js-based auction marketplace for pop culture collectibles. The application uses modern React patterns with TypeScript, Tailwind CSS, and integrates with a backend API for authentication and auction management.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Frontend Stack
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components for primitives
- **Framer Motion** for animations
- **SWR** for data fetching and caching
- **Axios** for HTTP requests
- **React Hook Form** for forms
- **SignalR** for real-time auction updates

### Key Services & Patterns

**API Client (`lib/api-client.ts`)**
- Centralized HTTP client with automatic token refresh
- Handles authentication interceptors
- Default base URL: `https://localhost:7001/api/v1`
- Supports JWT token-based authentication

**Authentication (`hooks/use-auth.tsx`)**
- Context-based auth state management
- Automatic token refresh on app initialization
- LocalStorage-based token persistence
- Supports login, register, logout, and user refresh

**SignalR Integration (`lib/signalr-service.ts`)**
- Real-time auction updates
- Automatic reconnection with exponential backoff
- Auction group joining/leaving
- Bid notifications and user count updates

**Data Fetching**
- SWR for API calls with automatic caching
- Custom hooks pattern for data operations
- Configured with global SWR settings in `lib/swr-config.ts`

### Project Structure

```
app/                    # Next.js app directory (pages)
├── auctions/          # Auction listing and detail pages
├── auth/              # Login/register pages
├── categories/        # Category browsing
├── help/              # Help pages
├── search/            # Search functionality
├── sell/              # Auction creation
└── user/              # User profiles

components/            # Reusable UI components
├── auction/           # Auction-specific components
├── auth/              # Authentication forms
├── categories/        # Category navigation
├── layout/            # Header, footer, layout components
├── search/            # Search filters and results
├── ui/                # Base UI components (buttons, forms, etc.)
└── user/              # User profile components

hooks/                 # Custom React hooks
├── use-auth.tsx       # Authentication state management
├── use-auctions.ts    # Auction data fetching
├── use-signalr.ts     # SignalR connection management
├── use-user.ts        # User profile operations
└── use-ui.ts          # UI state management

lib/                   # Utility libraries
├── api-client.ts      # HTTP client and auth
├── signalr-service.ts # Real-time connection service
├── swr-config.ts      # SWR configuration
├── auth-utils.ts      # Authentication helpers
├── auction-utils.ts   # Auction-related utilities
└── utils-extended.ts  # Additional utilities

types/                 # TypeScript type definitions
├── auction.ts         # Auction-related types
├── user.ts            # User and authentication types
└── common.ts          # Shared types and interfaces
```

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_SIGNALR_HUB_URL` - SignalR hub URL

### Code Patterns

**Component Organization**
- Use functional components with hooks
- Separate UI components from business logic
- Implement custom hooks for complex state logic
- Use TypeScript interfaces for all props and data

**State Management**
- Context for global state (auth, UI preferences)
- SWR for server state and caching
- Local state with useState/useReducer for component state
- SignalR service for real-time updates

**Styling**
- Tailwind CSS utility classes
- Consistent spacing and color schemes
- Responsive design patterns
- Radix UI for accessible components

**Error Handling**
- Centralized error handling in API client
- User-friendly error messages
- Automatic retry logic for network failures
- Graceful fallbacks for missing data

## Authentication Flow

1. User credentials sent to `/auth/login` or `/auth/register`
2. Backend returns JWT tokens with user info
3. Tokens stored in localStorage with expiration
4. API client automatically includes Bearer token in requests
5. Automatic token refresh on 401 responses
6. Redirect to login on auth failure

## Real-time Features

- Live auction bidding updates
- Real-time user count for active auctions
- Instant notifications for bid activities
- Automatic reconnection on connection loss