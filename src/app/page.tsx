export default function Home() {
  return (
    // Usamos bg-vite-dark que definimos en el theme
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-vite-dark text-white">
      <div className="relative">
        {/* Usamos bg-vite-purple */}
        <div className="absolute -inset-10 bg-vite-purple opacity-20 blur-3xl rounded-full"></div>

        <h1 className="relative text-8xl font-bold tracking-tighter uppercase italic">
          NEON
          {/* Usamos text-cyber-yellow y un shadow con la misma variable */}
          <span className="text-cyber-yellow drop-shadow-[0_0_15px_rgba(252,238,10,0.8)]">
            {" "}
            SHOP
          </span>
        </h1>
      </div>

      <p className="mt-6 text-lg text-gray-400 font-medium tracking-wide">
        HANDMADE IN{" "}
        <span className="text-neon-pink font-bold uppercase">Venezuela</span>
      </p>

      {/* El botón ahora usa bg-cyber-yellow automáticamente */}
      <button className="mt-10 px-10 py-4 bg-cyber-yellow text-black font-black hover:scale-105 transition-transform skew-x-[-12deg]">
        <span className="inline-block skew-x-[12deg]">EXPLORAR TIENDA</span>
      </button>
    </main>
  );
}
