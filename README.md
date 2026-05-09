# Synora

Modern collaborative social-learning platform built with **Next.js 16**, **React 19**, **Prisma 7**, **TypeScript**, and **Tailwind CSS v4**.

Synora focuses on document sharing, structured content organization, and real-time interaction for students and collaborative learning communities.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-0C344B?style=flat-square&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)

---

## Features

### Real-time Interaction
- Real-time messaging and communication
- Live notification updates
- Interactive social collaboration features

### Collaborative Workspace
- Hierarchical content organization
- Nested workspace navigation
- Dynamic breadcrumb generation

### Document & Resource Sharing
- Upload and share learning materials
- File attachment and preview support
- Structured content organization

### AI-assisted Features
- Document summarization with Gemini API
- Intelligent metadata tagging
- Improved document discoverability

### Modern Architecture
- Next.js 16 App Router
- React Server Components
- Type-safe architecture with Prisma and TypeScript

### UI/UX
- Responsive and minimal interface
- Built with Tailwind CSS v4 and shadcn/ui
- Optimized for readability and modern interaction patterns

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database

---

### Installation

```bash
# Clone repository
git clone https://github.com/ychrisdev/synora.git

# Navigate into project
cd synora

# Install dependencies
npm install
```

---

### Environment Variables

```bash
cp .env.example .env
```

Update your database connection string inside `.env`.

---

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

---

### Run Development Server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:3000
```

---

## Project Structure

```text
src/
├── app/                      # Next.js App Router
│
├── components/
│   ├── ui/                   # shadcn/ui shared components
│   ├── layout/               # Navbar, Sidebar, Shell
│   ├── feed/                 # Feed & posts UI
│   ├── chat/                 # Messaging UI
│   ├── document/             # Document/file components
│   ├── workspace/            # Recursive content/workspace
│   ├── group/                # Community/group components
│   ├── profile/              # User profile UI
│   ├── notification/         # Notification components
│   └── shared/               # Reusable business components
│
├── features/                 # Feature/domain logic
│   ├── auth/
│   ├── posts/
│   ├── chat/
│   ├── documents/
│   ├── workspace/
│   ├── groups/
│   └── notifications/
│
├── hooks/                    # Shared hooks
│
├── lib/                      # Utilities & configs
│   ├── prisma/
│   ├── socket/
│   ├── auth/
│   ├── ai/
│   └── utils/
│
├── services/                 # API/service layer
│
├── store/                    # Zustand stores
│
├── types/                    # Shared TypeScript types
│
├── styles/                   # Global styles
│
└── constants/                # Static configs/constants
```

---

## Tech Stack

| Category         | Technologies                          |
| ---------------- | ------------------------------------- |
| Framework        | Next.js 16                            |
| Frontend         | React 19 + TypeScript                 |
| Styling          | Tailwind CSS v4 + Shadcn UI           |
| Database         | PostgreSQL                            |
| ORM              | Prisma 7                              |
| State Management | Zustand                               |
| Realtime         | Socket.io                             |
| AI Integration   | Gemini API                            |
| Deployment       | Vercel                                |

---

## Development Commands

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push
```

---

## Live Demo

[Live Demo](https://synora.vercel.app)

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
