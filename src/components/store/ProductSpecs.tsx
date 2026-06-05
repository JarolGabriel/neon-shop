const SPECS: string[] = [
  "¡Envío gratis, a todo Venezuela!",
  "Respaldo de corte de contorno transparente de alta calidad.",
  "Cada unidad viene con una garantía de 1 año en componentes eléctricos.",
  "Los carteles LED están diseñados solo para uso en interiores.",
  "Dimensiones: Pequeño: 38cm x 21cm. Mediano: 61cm x 32cm. Grande: 92cm x 47cm.",
  "Cable de alimentación de 1,8 metros.",
  "Incluye regulador de intensidad.",
  "Adaptador de corriente DC 12v incluido con 2 metros adicionales de cable negro.",
  "Incluye hardware de montaje.",
];

export function ProductSpecs() {
  return (
    <div className="text-sm text-muted-foreground sm:text-base">
      <ul className="list-disc space-y-2 pl-5 marker:text-vite-purple dark:marker:text-cyber-yellow">
        {SPECS.map((spec) => (
          <li key={spec} className="leading-relaxed">
            {spec}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs italic sm:text-sm">
        Los tamaños y colores pueden variar levemente respecto a las fotos.
      </p>
    </div>
  );
}
