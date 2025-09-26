import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>FX Intelligence</title>
        <meta name="description" content="FX Intelligence with 3D Robot" />
        <link rel="icon" href="/assets/FX-Intelligence.png" />
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.21/build/spline-viewer.js" />
      </Head>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/10 shadow-md">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-10 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img src="/assets/FX-Intelligence.png" alt="FX Icon" className="w-10 h-10 drop-shadow" />
            <h1 className="text-white font-bold text-xl">FX Intelligence</h1>
          </div>

          {/* Nav Links */}
          <ul className="hidden md:flex gap-10 text-white font-semibold text-base">
            <li><a className="hover:text-white/70 transition" href="#home">Home</a></li>
            <li><a className="hover:text-white/70 transition" href="#features">Features</a></li>
            <li><a className="hover:text-white/70 transition" href="#technology">Technology</a></li>
            <li><a className="hover:text-white/70 transition" href="#about">About</a></li>
            <li><a className="hover:text-white/70 transition" href="#support">Support</a></li>
          </ul>

          {/* Try AI Button */}
          <button
            type="button"
            onClick={() => window.location.href = "#features"}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2 rounded-full transition"
          >
            Try AI
          </button>
        </nav>
      </header>

      {/* Main Section */}
      <main className="pt-24 min-h-screen bg-black text-white relative overflow-hidden" id="home">
        {/* Spline 3D Viewer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <spline-viewer url="https://prod.spline.design/IP5xsf4E8ezdTzxD/scene.splinecode"></spline-viewer>
        </div>

        {/* Main Title */}
        <section className="relative z-10 flex flex-col items-center justify-center h-[100vh] text-center">
          <h1 className="text-6xl sm:text-8xl font-extrabold drop-shadow-xl">
            FX INTELLIGENCE
          </h1>
          <p className="mt-4 text-lg opacity-70">Discover the power of intelligent 3D AI</p>
        </section>
      </main>

      {/* Features Section Placeholder */}
      <section id="features" className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h2 className="text-4xl font-bold">Features Section</h2>
      </section>
    </>
  );
}
