# Next.js Universal Auth Template

A production-ready Next.js starter template pre-configured with the **Universal Auth** library. This template gives you a complete authentication flow (Login, Register, Dashboard, Profile Management) out of the box, connecting seamlessly to your Universal Auth Spring Boot backend.

## Features

- 🔐 **Pre-integrated Authentication**: Fully configured to use `universal-auth-nextjs`.
- 🛡️ **Protected Routes**: Middleware and server-side checks already implemented.
- 🎨 **Shadcn UI & Tailwind CSS**: Beautiful, responsive, and accessible UI components.
- 🚀 **Next.js App Router**: Utilizing the latest React Server Components and Server Actions.

## Getting Started

### 1. Set up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your Spring Boot Universal Auth backend (defaults to `http://localhost:8080/api/v1`).

### 2. Install Dependencies

```bash
npm install
```

> **Note**: This template relies on the `universal-auth-nextjs` package. Ensure it is either published to NPM, hosted on your GitHub, or linked locally in your workspace.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. You will be automatically redirected to the `/login` page if you are not authenticated.

## Project Structure

- `src/app/(auth)/login` - Login page
- `src/app/(auth)/register` - Registration page
- `src/app/dashboard` - Protected dashboard route
- `src/components/dashboard` - Dashboard UI components
- `next.config.ts` - Pre-configured to transpile the auth library

## Customization

You can easily swap out the Shadcn UI components or modify the layout by editing the files in `src/components` and `src/app`.
