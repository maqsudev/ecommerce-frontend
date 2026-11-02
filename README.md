# Ecommerce Frontend

Modern, high-performance E-Commerce frontend built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **Zustand**. Fully aligned with the master E-Commerce API specification and resilient offline fallback mocks.

## 🚀 Features

- **Storefront & Catalog**: Faceted product filtering, search, category browsing, sorting, and responsive product cards.
- **Product Details & Reviews**: Dynamic product views, image galleries, customer ratings, and reviews submission.
- **Cart & Guest Session**: Persistent cart state managed with Zustand and guest session tokens.
- **Seamless Checkout**: Address management, delivery options, and payment gateway integration (Payme, Click, Uzum).
- **Authentication**: Modern OTP-first passwordless login, standard password fallback, JWT token management with auto-refresh, and protected routes.
- **Customer Account**: Profile management, order tracking with status timelines, saved payment cards, and in-app notifications.
- **Admin Dashboard**: Real-time sales metrics, order fulfillment, inventory management, and customer reviews moderation.
- **Resilient Mock Fallback**: Automatic seamless fallback engine with mock data when backend API is offline or in development.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Server State Management**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Client State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 🏁 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` or edit existing configuration:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

*(Note: If backend server is not running, the application will automatically activate mock fallback data so every feature remains 100% interactive.)*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```
