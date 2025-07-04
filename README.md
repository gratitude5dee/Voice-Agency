
**URL**: https://lovable.dev/projects/4c32a171-4fc4-420f-b80c-e065521c67f8

### Analysis Summary

The "Awaken Galaxy Voice" project is a visually stunning and technologically sophisticated single-page application that serves as a landing page for a real-time, conversational voice AI. The project's primary purpose is to showcase the voice AI's capabilities and collect user interest via a waitlist form.

-   **Core Technology**: The application is built with **React** and **TypeScript**, powered by the **Vite** build tool. The user interface is crafted with the highly popular **shadcn/ui** component library, which leverages **Tailwind CSS** for styling. This results in a sleek, modern, and responsive UI with a custom "galaxy" dark theme.

-   **Key Features**:
    -   **Interactive 3D Visualization**: The centerpiece is a beautiful, audio-reactive 3D waveform created with **React Three Fiber** and **Three.js**. It features a dynamic particle system and waveform bars that respond to microphone input, creating an immersive user experience.
    -   **Real-time Voice AI**: The `VoiceAgent` component integrates directly with the **ElevenLabs API** using their official React SDK (`@11labs/react`), enabling real-time, conversational AI interaction.
    -   **Backend Integration**: The project uses **Supabase** as a Backend-as-a-Service (BaaS) to handle the waitlist and contact form submissions. The Supabase integration is clearly defined with auto-generated TypeScript types for database tables.
    -   **Polished UI/UX**: The application boasts a rich, animated user interface with custom Tailwind CSS keyframes for effects like floating, shimmering, and glowing, creating a polished and engaging "cosmic" aesthetic.

-   **Project Structure**: The codebase is exceptionally well-organized. It features a clear separation of concerns, with dedicated folders for `components`, `pages`, `hooks`, `integrations`, and `utils`. Custom hooks like `useAudioData` manage client-side state with **Zustand**, demonstrating modern state management practices.

-   **Developer Experience**: The project is set up for a smooth developer workflow with path aliases configured in `tsconfig.json` and a standard Vite development environment. The provided code is clean, well-commented, and uses TypeScript effectively. The only missing element is a formal testing suite.

In essence, "Awaken Galaxy Voice" is an exemplary showcase of combining cutting-edge frontend technologies (React, Vite, Three.js) with powerful AI services (ElevenLabs) and a modern BaaS (Supabase) to create a compelling and interactive product landing page.

***

# Awaken Ambience ✨

A real-time, conversational voice AI with stunning audio-reactive 3D visualizations, built with React, Three.js, ElevenLabs, and Supabase.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite&style=flat-square)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js&style=flat-square)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase&style=flat-square)](https://supabase.com)

**Awaken Ambience** is a showcase of the next generation of voice assistants. It combines natural, real-time voice conversations powered by the ElevenLabs API with an immersive, audio-reactive 3D visualization built with React Three Fiber. This project serves as a landing page to demonstrate the technology and gather interest via a waitlist.

https://github.com/gpt-engineer-org/awaken-galaxy-voice/assets/10826888/443657ff-43f1-4f6c-8422-544d6738aa63

## ✨ Features

-   **🎙️ Real-Time Voice Interaction**: Engage in natural, responsive conversations with a voice AI powered by the **ElevenLabs API**.
-   **🔮 Interactive 3D Waveform**: A stunning audio-reactive visualization built with **React Three Fiber** and **Three.js** that responds to your voice.
-   **🌌 Dynamic Particle System**: An ambient particle system that ebbs and flows with the audio, creating an immersive "galaxy" experience.
-   **🎨 Polished & Animated UI**: A sleek, dark-themed interface with custom animations, built using **shadcn/ui** and **Tailwind CSS**.
-   **🚀 Waitlist & Contact Forms**: Seamlessly collect user interest and sales inquiries via a robust **Supabase** backend.
-   **📱 Fully Responsive**: A beautiful experience on all devices, from mobile to desktop.

## 🛠️ Tech Stack

-   **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom themes and animations
-   **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [Drei](https://github.com/pmndrs/drei)
-   **Backend & Database**: [Supabase](https://supabase.com/)
-   **Voice AI**: [ElevenLabs React SDK](https://github.com/11-labs/elevenlabs-react)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack Query](https://tanstack.com/query/latest)

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or newer)
-   A package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [bun](https://bun.sh/)
-   **Supabase Account**: To store waitlist data. [Sign up here](https://supabase.com/).
-   **ElevenLabs API Key**: For the voice AI functionality. [Get a key here](https://elevenlabs.io/).

### ⚡ Quick Start

For a fast setup, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/awaken-galaxy-voice-30-main.git
cd awaken-galaxy-voice-30-main

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Fill in your API keys in the .env file

# 5. Run the development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### ⚙️ Configuration

Create a `.env` file in the root of the project by copying the example:

```bash
cp .env.example .env
```

Open the `.env` file and add your Supabase and ElevenLabs credentials.

```env
# Get from your Supabase project settings
VITE_SUPABASE_URL="https://your-project-url.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Get from your ElevenLabs account
VITE_ELEVENLABS_API_KEY="your-elevenlabs-api-key"
```

> **Note**: For the Supabase integration to work, you will need to create two tables in your Supabase project: `waitlist` and `contact_sales`. You can find the required schema in `src/integrations/supabase/types.ts` or use the SQL definitions below:
>
> ```sql
> -- Waitlist Table
> CREATE TABLE waitlist (
>   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
>   name TEXT NOT NULL,
>   email TEXT NOT NULL UNIQUE,
>   referral_code TEXT,
>   skip_waitlist BOOLEAN DEFAULT FALSE,
>   created_at TIMESTAMPTZ DEFAULT NOW()
> );
>
> -- Contact Sales Table
> CREATE TABLE contact_sales (
>   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
>   name TEXT NOT NULL,
>   email TEXT NOT NULL,
>   company_name TEXT NOT NULL,
>   phone_number TEXT,
>   message TEXT,
>   created_at TIMESTAMPTZ DEFAULT NOW()
> );
> ```

## 🖥️ Usage

Once the application is running, you can explore its features:

-   **Activate the Voice Agent**: Click the "Activate Voice AI" button to start the microphone.
-   **Interact with the AI**: Speak into your microphone. The AI will respond, and the 3D waveform will react to the audio.
-   **Join the Waitlist**: Scroll down to the waitlist form to sign up for early access.
-   **Explore the UI**: Enjoy the smooth animations and the galaxy-themed design.

## ✅ Testing

This project does not have an automated testing suite. Adding tests with a framework like [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) would be a valuable contribution.

A basic test script can be added to `package.json`:

```json
"scripts": {
  // ...
  "test": "vitest"
}
```

## 🚢 Deployment

The application can be deployed as a static site to any modern hosting provider.

1.  **Build the Project**:
    ```bash
    npm run build
    ```
    This command creates an optimized, production-ready build in the `dist/` directory.

2.  **Deploy**:
    Deploy the contents of the `dist/` folder to a platform like [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or [GitHub Pages](https://pages.github.com/).

    **Important**: Remember to set your environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ELEVENLABS_API_KEY`) in your hosting provider's dashboard.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or want to fix a bug, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/MyAwesomeFeature`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/MyAwesomeFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🙏 Acknowledgments

-   **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)** for making 3D in React a joy.
-   **[ElevenLabs](https://elevenlabs.io/)** for their powerful voice AI API.
-   **[Supabase](https://supabase.com/)** for the excellent developer experience and BaaS.
-   **[shadcn/ui](https://ui.shadcn.com/)** for the fantastic, accessible component library.
-   Project scaffolding by **[Lovable](https://lovable.dev/)**.
