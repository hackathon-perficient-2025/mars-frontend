# Mars Base Cargo Control

A comprehensive real-time resource monitoring system for Mars Base operations, built with React, TypeScript, and modern web technologies.

## Features

- **Real-time Dashboard**: Monitor critical resources (oxygen, water, food, spare parts) in real-time
- **Resource Analytics**: Visualize consumption trends with interactive charts
- **Alert System**: Get notified when resources reach critical or warning levels
- **Resupply Management**: Create and track resupply requests with priority levels
- **Inventory Management**: Complete overview of all base resources with filtering and search
- **Mars-themed UI**: Dark theme with Mars-inspired color palette

## Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **UI Components**: ShadcnUI
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks (custom)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner (ShadcnUI)

## Project Structure

```
src/
├── components/
│   ├── ui/              # ShadcnUI components
│   ├── layout/          # Layout components (Header, Sidebar, MainLayout)
│   ├── dashboard/       # Dashboard-specific components
│   └── common/          # Shared components
├── pages/               # Page components (Dashboard, Inventory, etc.)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── mocks/               # Mock data services
├── utils/               # Utility functions and constants
└── lib/                 # Shared libraries
```

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mars-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run preview
```

## Architecture Highlights

### Separation of Concerns

- **Components**: Organized by feature and type
- **Hooks**: Business logic separated into reusable hooks
- **Types**: Centralized type definitions
- **Mocks**: Isolated mock data for easy backend integration

### SOLID Principles

- **Single Responsibility**: Each component has a single, well-defined purpose
- **Open/Closed**: Components are extensible through props
- **Dependency Inversion**: Components depend on abstractions (hooks) not implementations

### DRY (Don't Repeat Yourself)

- Reusable utility functions in `utils/`
- Common components in `components/common/`
- Centralized type definitions in `types/`

## Key Components

### Dashboard
- Real-time resource monitoring
- Alert panel with acknowledgment system
- Quick actions for emergency resupply

### Inventory
- Searchable and filterable resource table
- Status indicators and trend information
- Last updated timestamps

### Analytics
- Historical resource level charts
- Consumption rate tracking
- Resource comparison visualizations
- Configurable time ranges (24h, 7d, 30d, 90d)

### Resupply Management
- Create new resupply requests
- Track request status (pending, approved, in transit, delivered)
- Priority-based request management

## Mock Data

The application currently uses mock data located in `src/mocks/`. To integrate with a real backend:

1. Create API service files in `src/services/`
2. Replace mock data calls in hooks with API calls
3. Update the hooks to handle loading and error states appropriately

Example structure for backend integration:

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const resourcesApi = {
  getAll: () => api.get('/resources'),
  getById: (id: string) => api.get(`/resources/${id}`),
  // ... more endpoints
};
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## Color Scheme

The application uses a Mars-inspired dark theme:

- Primary (Mars Red): `#C1440E`
- Accent (Mars Orange): `#E86A33`
- Background: Dark tones for space simulation
- Status Colors:
  - Critical: Red
  - Warning: Yellow
  - Success: Green
  - Info: Blue

## Contributing

When adding new features:

1. Follow the existing folder structure
2. Create TypeScript types in `src/types/`
3. Add mock data in `src/mocks/` if needed
4. Create reusable components in appropriate folders
5. Use custom hooks for business logic
6. Follow the DRY principle

## License

Copyright PERFICIENT - All rights reserved

## Acknowledgments

Built for Mars Base Operations - PERFICIENT Mission Control
