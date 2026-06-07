<div align="center">
  <h1>🌐 IEEE CS SBC GECI Website 3.0</h1>
  <p><strong>The official web platform for the IEEE Computer Society Student Branch Chapter at GECI.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![InsForge](https://img.shields.io/badge/InsForge-Backend-green?style=for-the-badge)](https://insforge.dev/)
</div>

<br />

Welcome to the **IEEE CS GECI Website 3.0** repository! This platform serves as the digital home for our student branch chapter, providing an elegant, high-performance, and maintainable interface for managing events, showcasing achievements, and connecting members.

## ✨ Features

- **Dynamic Event Management**: Seamlessly propose, manage, and showcase upcoming and past events.
- **Admin Dashboard**: A secure, centralized hub for managing members, events, and chapter resources.
- **Premium Animations & Design**: Crafted with [Emil Kowalski's design engineering philosophy](https://animations.dev/), featuring smooth easing curves, glassmorphism, and highly responsive interactions.
- **Robust Backend Integration**: Powered by [InsForge](https://insforge.dev/) for database CRUD, authentication, and storage.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Custom CSS mapped cleanly in `@/styles`
- **Backend (BaaS)**: [InsForge](https://insforge.dev/) (Postgres, Auth, Storage)

## 📁 Architecture & File Structure

We follow a strict, scalable file structure to ensure long-term maintainability. "A clean file structure reflects clean thinking."

```text
/src
  /app           # Next.js App Router pages and layouts
  /components    # Reusable UI components (Header, Footer, Modals)
  /services      # Modular backend logic (authService, eventService, memberService)
  /styles        # Global and modular CSS stylesheets
  /utils         # Reusable helper functions (e.g., dateUtils)
/tests
  /unit          # Unit test suites
  /integration   # Integration test suites
```

*Note: The monolithic backend clients have been entirely decoupled into scalable domains under `/src/services`.*

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ImNotHari/ieee-cs-geci-website-3.0.git
cd ieee-cs-geci-website-3.0
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your InsForge / Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-insforge-api-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-insforge-anon-key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page automatically updates as you edit the source files.

## 🎨 Design Engineering Guidelines

This repository enforces high standards for UI polish:
- **Animations**: Prefer `ease-out` for UI elements entering the screen. Keep durations under 300ms.
- **Hover & Active States**: Buttons must feel responsive (`transform: scale(0.97)` on `:active`).
- **Clean Styling**: We use pure, vanilla CSS. If you're contributing UI components, place the stylesheets in `/src/styles/` and import them via absolute paths (e.g., `import "@/styles/component.css";`).

## 🤝 Contributing

Contributions are always welcome! If you'd like to improve the codebase, please ensure your changes adhere to our [File Structure Guidelines](.cursor/rules/file-structure.mdc). 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
