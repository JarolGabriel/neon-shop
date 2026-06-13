/**
 * Seed temporal del Showroom (7–10 posts de demo).
 * Uso: node scripts/seed-showroom-posts.mjs
 * Borrar: node scripts/clean-showroom-seed.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env") });

const SEED_MARKER = "__SHOWROOM_SEED__";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const POSTS = [
  {
    title: "Letrero gaming en mi setup",
    comment: `Instalé este neón detrás del monitor y el cuarto se ve otra cosa por las noches. Calidad top.\n\n${SEED_MARKER}\n\n#gaming #setup #neón`,
    image_url: "/images/logo-diseno/logo-diseno1.webp",
    rating: 5,
    daysAgo: 1,
  },
  {
    title: "Logo personalizado para mi barbería",
    comment: `Pedí el diseño con el logo del local y quedó perfecto en la pared del mostrador.\n\n${SEED_MARKER}\n\n#barberia #negocio #personalizado`,
    image_url: "/images/logo-diseno/logo-diseno2.webp",
    rating: 5,
    daysAgo: 2,
  },
  {
    title: "Neón rosa en la recámara",
    comment: `Mi esposa quería algo suave para la habitación. Este tono se ve espectacular con las luces apagadas.\n\n${SEED_MARKER}\n\n#hogar #dormitorio #rosa`,
    image_url: "/images/logo-diseno/logo-diseno3.webp",
    rating: 4,
    daysAgo: 3,
  },
  {
    title: "Frase motivacional en el home office",
    comment: `Trabajo desde casa y este detalle me levanta el ánimo en las jornadas largas.\n\n${SEED_MARKER}\n\n#homeoffice #motivacion #led`,
    image_url: "/images/logo-diseno/logo-diseno4.webp",
    rating: 5,
    daysAgo: 4,
  },
  {
    title: "Detalle neón en la sala",
    comment: `Lo usamos como luz ambiental cuando vemos películas. El brillo es justo, no molesta.\n\n${SEED_MARKER}\n\n#sala #decoracion #cine`,
    image_url: "/images/logo-diseno/logo-diseno5.webp",
    rating: 4,
    daysAgo: 5,
  },
  {
    title: "Letrero para el local de tatuajes",
    comment: `Se ve brutal en la entrada del estudio. Varios clientes ya preguntaron dónde lo compramos.\n\n${SEED_MARKER}\n\n#tatuajes #local #estilo`,
    image_url: "/images/logo-diseno/logo-diseno6.webp",
    rating: 5,
    daysAgo: 6,
  },
  {
    title: "Regalo de aniversario",
    comment: `Se lo regalé a mi novia con nuestras iniciales. Fue el detalle favorito de la noche.\n\n${SEED_MARKER}\n\n#regalo #aniversario #pareja`,
    image_url: "/images/logo-diseno/logo-diseno7.webp",
    rating: 5,
    daysAgo: 7,
  },
  {
    title: "Neón en la terraza",
    comment: `Resiste bien la humedad y se ve genial en las reuniones con amigos.\n\n${SEED_MARKER}\n\n#terraza #fiesta #exterior`,
    image_url: "/images/logo-diseno/logo-diseno8.webp",
    rating: 4,
    daysAgo: 8,
  },
  {
    title: "Mi primera compra en Neon Shop",
    comment: `Llegó bien empaquetado y la instalación fue sencilla. Repetiré seguro.\n\n${SEED_MARKER}\n\n#cliente #recomendado #neónshop`,
    image_url: "/images/logo-diseno/logo-diseno9.webp",
    rating: 5,
    daysAgo: 9,
  },
  {
    title: "Post solo texto — sin foto",
    comment: `Aún no tengo foto pro del letrero instalado, pero quería compartir que el servicio fue excelente y la entrega rápida.\n\n${SEED_MARKER}\n\n#experiencia #servicio`,
    image_url: null,
    rating: 5,
    daysAgo: 10,
  },
];

const SAMPLE_COMMENTS = [
  "¡Se ve brutal! ¿Cuánto tardó la entrega?",
  "Me encanta el color, justo lo que busco para mi cuarto.",
  "¿Lo conectaste directo a corriente o con transformador?",
  "Quedó muy profesional, felicidades.",
];

function daysAgoIso(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

async function removeExistingSeed() {
  const { data: existing, error } = await supabase
    .from("customer_reviews")
    .select("id")
    .like("comment", `%${SEED_MARKER}%`);

  if (error) throw error;
  if (!existing?.length) return 0;

  const ids = existing.map((row) => row.id);

  await supabase.from("review_comments").delete().in("review_id", ids);
  await supabase.from("review_reactions").delete().in("review_id", ids);
  const { error: deleteError } = await supabase
    .from("customer_reviews")
    .delete()
    .in("id", ids);

  if (deleteError) throw deleteError;
  return ids.length;
}

async function main() {
  console.log("== Seed Showroom (demo) ==");

  const removed = await removeExistingSeed();
  if (removed > 0) {
    console.log(`Eliminados ${removed} posts demo anteriores.`);
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .limit(10);

  if (profilesError) throw profilesError;

  if (!profiles?.length) {
    console.error("No hay perfiles en la base de datos. Crea al menos un usuario primero.");
    process.exit(1);
  }

  const insertedIds = [];

  for (let index = 0; index < POSTS.length; index += 1) {
    const post = POSTS[index];
    const author = profiles[index % profiles.length];

    const { data: review, error: insertError } = await supabase
      .from("customer_reviews")
      .insert({
        user_id: author.id,
        title: post.title,
        comment: post.comment,
        rating: post.rating,
        image_url: post.image_url,
        is_approved: true,
        created_at: daysAgoIso(post.daysAgo),
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    insertedIds.push(review.id);
  }

  const reactionTypes = ["like", "fire", "celebrate", "wow", "unicorn"];

  for (const reviewId of insertedIds) {
    const reactors = profiles.slice(0, Math.min(3, profiles.length));
    for (const profile of reactors) {
      const type = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      await supabase.from("review_reactions").upsert(
        {
          review_id: reviewId,
          user_id: profile.id,
          reaction_type: type,
        },
        { onConflict: "review_id,user_id,reaction_type", ignoreDuplicates: true },
      );
    }
  }

  for (let i = 0; i < Math.min(4, insertedIds.length); i += 1) {
    const reviewId = insertedIds[i];
    const commenter = profiles[(i + 1) % profiles.length];
    await supabase.from("review_comments").insert({
      review_id: reviewId,
      user_id: commenter.id,
      comment: SAMPLE_COMMENTS[i % SAMPLE_COMMENTS.length],
      is_approved: true,
    });
  }

  console.log(`Listo: ${insertedIds.length} publicaciones demo creadas y aprobadas.`);
  console.log("Recarga /comunidad para verlas.");
  console.log("Para borrarlas: npm run seed:showroom:clean");
}

main().catch((error) => {
  console.error("Error en seed:", error.message ?? error);
  process.exit(1);
});
