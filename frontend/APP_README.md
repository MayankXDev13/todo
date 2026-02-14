# TodoApp Frontend

A modern, full-featured Todo application built with Next.js 16, TypeScript, shadcn/ui, TanStack Query, Zustand, and Zod.

## Features

- **Authentication**: Login, register, forgot/reset password flows
- **Todo Management**: Create, read, update, delete todos with priority levels
- **Filtering & Search**: Filter by status, priority, and search by title
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (56+ components)
- **State Management**: Zustand (client-side), TanStack Query (server-side)
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React

## Project Structure

```
app/
├── (auth)/              # Auth routes (login, register, etc.)
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── (app)/               # Protected routes with layout
│   ├── todos/           # Main todos list
│   ├── calendar/        # Calendar view
│   ├── stats/           # Statistics dashboard
│   └── settings/        # User settings
├── layout.tsx           # Root layout with providers
└── page.tsx             # Landing page

components/
├── ui/                  # shadcn/ui components (56+)
├── auth/                # Authentication forms
├── todos/               # Todo-related components
└── layout/              # Layout components (header, etc.)

hooks/
├── api/                 # TanStack Query hooks
│   ├── auth.ts         # Auth API hooks
│   └── todos.ts        # Todo API hooks
└── auth.ts             # Auth utility hooks

lib/
├── api.ts              # Axios client configuration
├── schemas/            # Zod validation schemas
│   ├── auth.ts
│   └── todo.ts
└── utils.ts            # Utility functions

stores/
├── auth-store.ts       # Authentication state (Zustand)
└── ui-store.ts         # UI state (Zustand)

types/
└── models.ts           # TypeScript type definitions

providers/
└── query-provider.tsx  # TanStack Query provider
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables (create `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
```

## API Integration

The app is configured to work with your Todo API at `/api/v1`. Make sure your backend server is running on the port specified in `NEXT_PUBLIC_API_URL`.

### Authentication Flow

1. User logs in → Tokens stored in localStorage and HTTP-only cookies
2. Axios interceptor adds Bearer token to requests
3. On 401 errors, automatic token refresh is attempted
4. If refresh fails, user is redirected to login

### State Management

- **Server State**: TanStack Query for API data with caching
- **Client State**: Zustand for auth and UI state
- **Form State**: React Hook Form with Zod validation

## Features Implemented

✅ Authentication (Login, Register, Forgot/Reset Password)
✅ JWT token handling with automatic refresh
✅ Todo CRUD operations
✅ Priority levels (Low, Medium, High)
✅ Due dates with calendar
✅ Search and filtering
✅ Pagination
✅ Dark mode toggle
✅ Responsive navigation
✅ Form validation with Zod
✅ Toast notifications
✅ Loading states and skeletons
✅ Protected routes
✅ Error handling

## Routes

- `/` - Landing page
- `/login` - Sign in
- `/register` - Create account
- `/forgot-password` - Request password reset
- `/reset-password/[token]` - Reset password
- `/todos` - Main todo list
- `/calendar` - Calendar view
- `/stats` - Statistics dashboard
- `/settings` - Account settings

## Customization

### Adding New API Endpoints

1. Add types to `types/models.ts`
2. Create validation schema in `lib/schemas/`
3. Add API functions and hooks in `hooks/api/`
4. Create components in `components/`
5. Add pages in `app/(app)/`

### Theme Customization

The app uses CSS variables for theming. Edit `app/globals.css` to customize colors.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
