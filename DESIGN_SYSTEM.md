---
Paleta de Colores (Actualizado para Tailwind v4)
Token Tailwind    Hex / Variable    Uso principal
`cyber-yellow`    `#fcee0a`         CTAs primarios, badges, precios destacados, hover dark.
`neon-pink`       `#ff007a`         Acentos, likes, hover states, logo light, etiquetas.
`vite-purple`     `#bd34fe`         Gradientes, elementos secundarios.
`vite-dark`       `#1e1e20`         Fondo técnico oscuro secundario.
`neon-surface`    var(--neon-surface) Superficie de Navbar, cards y menús flotantes.

Variables semánticas integradas en Tailwind v4 vía `@theme inline`:
Fondos: `bg-background`, `bg-card`, `bg-muted`, `bg-popover`, `bg-neon-surface`
Textos: `text-foreground`, `text-muted-foreground`
Bordes: `border`, `border-input`

Comportamiento dinámico de enlaces en Navbar:
- Modo claro  → hover cambia a `text-neon-pink`
- Modo oscuro → hover cambia a `text-cyber-yellow`
---

Modo Claro / Oscuro & Arquitectura de Superficies Default: dark Toggle: Ícono
`Sun` / `Moon` de lucide-react en el Navbar (Client component optimizado para
React 19 sin efectos sincrónicos). Implementación: `next-themes` con
`attribute="class"` y `defaultTheme="dark"`.

Mapeo estricto de variables en globals.css:

- En modo claro (`:root`), el fondo (`--background`) es blanco puro
  (`oklch(1 0 0)`) y las utilidades `--neon-surface` son `#ffffff`.
- En modo oscuro (`.dark`), el fondo (`--background`) es `oklch(0.18 0.01 260)`
  (azul muy oscuro estilo Vite) y las superficies elevadas (`--card`,
  `--popover`, `--neon-surface`) se unifican bajo el color técnico `#1f1f24`.

## Regla de Oro: Nunca hardcodear colores (`bg-white`, `text-black`). Utilizar siempre las variables semánticas para garantizar la mutación de temas.

Anulaciones Críticas de Componentes (shadcn/ui) Debido a que los sub-componentes
nativos de shadcn/ui (como `NavigationMenuContent` o `DropdownMenu`) inyectan
estilos internos rígidos, se debe forzar el acoplamiento visual usando el
operador `!` (important) de Tailwind en las capas de componentes de
`globals.css`:

```css
.nav-link {
  @apply text-foreground transition-colors duration-200 hover:text-neon-pink!;
}
.dark .nav-link {
  @apply hover:text-cyber-yellow!;
}
.nav-dropdown-item:hover {
  @apply text-neon-pink!;
}
.dark .nav-dropdown-item:hover {
  @apply text-cyber-yellow!;
}
```
