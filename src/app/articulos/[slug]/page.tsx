import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import ArticleClientView from "@/components/blog/ArticleClientView";

export const revalidate = 60; // ISR cada 60 segundos

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Artículos de respaldo con las 3 capas lingüísticas
const fallbackArticulos = [
  {
    id: 1,
    slug: "como-pronunciar-la-r-francesa-guia-definitiva",
    titulo: "Cómo pronunciar la \"R\" francesa sin morir en el intento",
    extracto:
      "Descubre el método anatómico y los 3 ejercicios prácticos que uso con mis alumnos de París para dominar la R gutural francesa desde la primera semana.",
    contenido: `## El mito del sonido imposible

Para la gran mayoría de hispanohablantes, la **R francesa** (técnicamente conocida como fricativa uvular sonora) parece un obstáculo insuperable. Sin embargo, no se trata de fuerza ni de suerte: se trata de comprender **dónde** se produce el sonido en tu boca.

En español, la "R" se articula con la punta de la lengua golpeando el paladar anterior (alveolos). En francés, **la punta de la lengua no se mueve en absoluto**: se queda relajada detrás de los dientes inferiores. Todo el trabajo ocurre en la parte posterior, junto a la campanilla (úvula).

---

### Paso 1: El truco del bostezo o de hacer gárgaras

El mejor punto de partida es imitar la posición que adopta tu garganta al hacer gárgaras suaves con agua:

1. Coloca un poco de agua o simplemente simula el gesto en seco.
2. Siente cómo la parte posterior de la lengua sube ligeramente hacia el velo del paladar.
3. Exhala aire suavemente: notarás una vibración suave sin forzar la laringe.

> **💡 Consejo parisino:** No intentes raspar la garganta con agresividad como si fuera una "J" española fuerte. La R francesa moderna en París es suave y fluida, casi un suspiro con fricción.

---

### Paso 2: La posición de la lengua (La regla de oro)

Apoya la punta de tu lengua detrás de los dientes incisivos inferiores y **mantenla pegada allí**. Ahora intenta pronunciar las siguientes combinaciones:

- **Tra** -> *Train* (Tren)
- **Gra** -> *Grand* (Grande)
- **Par** -> *Paris* (París)
- **Mer** -> *Merci* (Gracias)

Notarás que al principio suena exagerado, pero con 5 minutos de práctica diaria frente al espejo, tu cerebro creará el nuevo camino neuromuscular.

---

### ¿Quieres practicar con retroalimentación en tiempo real?

En mis clases individuales 1 a 1 corregimos tu postura vocal, entonación y ritmo desde la primera lección para que hables con total naturalidad y seguridad. ¡Reserva tu sesión de prueba gratuita y compruébalo tú mismo!`,
    titulo_fr: "Comment prononcer le \"R\" français sans effort",
    extracto_fr:
      "Découvrez la méthode anatomique et les 3 exercices pratiques que j'utilise avec mes élèves à Paris pour maîtriser le R français dès la première semaine.",
    contenido_fr: `## Le mythe du son impossible

Pour beaucoup d'apprenants, le **R français** semble être un obstacle insurmontable. Pourtant, ce n'est ni une question de force ni de hasard : il s'agit simplement de comprendre **où** le son est produit dans votre bouche.

La pointe de votre langue ne doit pas bouger : elle reste détendue derrière les incisives inférieures. Tout le travail se passe à l'arrière, près de la luette.

---

### Étape 1 : Le réflexe du gargarisme

Le meilleur point de départ est d'imiter la position de votre gorge lorsque vous vous gargarisez doucement :

1. Faites le geste doucement à sec ou avec une gorgée d'eau.
2. Sentez l'arrière de votre langue remonter vers le voile du palais.
3. Expirez doucement : vous obtiendrez une légère vibration sans forcer sur les cordes vocales.

> **💡 Conseil parisien :** Ne forcez pas la gorge de manière agressive. Le R parisien moderne est doux, fluide et presque aérien.

---

### Étape 2 : La position de la langue

Gardez la pointe de la langue bien collée derrière vos dents du bas. Répétez ces mots :

- **Train**
- **Grand**
- **Paris**
- **Merci**

---

### Envie de pratiquer avec un retour personnalisé ?

Dans mes cours particuliers 1 à 1, nous travaillons votre prononciation et votre aisance pour que vous parliez avec plaisir et confiance. Réservez votre séance d'essai gratuite !`,
    titulo_en: "How to Pronounce the French \"R\" Without the Struggle",
    extracto_en:
      "Discover the anatomical technique and 3 practical exercises I use with my students in Paris to master the French guttural R from week one.",
    contenido_en: `## The Myth of the Impossible Sound

For many learners, the **French R** seems like an insurmountable barrier. However, it is not about force or throat scraping: it is about understanding **where** the sound is produced in your mouth.

In English or Spanish, the tongue taps forward. In French, **the tip of the tongue does not move at all**: it rests relaxed behind your bottom front teeth. All the articulation happens at the back, near the uvula.

---

### Step 1: The Gentle Gargle Technique

The easiest way to locate the right muscle is to mimic the gentle throat position of gargling water:

1. Imagine gargling gently without water.
2. Feel the back of your tongue rise toward your soft palate.
3. Exhale smoothly: you will produce a gentle friction sound.

> **💡 Parisian Tip:** Never scrape aggressively. The modern Parisian R is soft, subtle, and effortless.

---

### Step 2: Practice Pairs

Keep the tip of your tongue locked behind your lower teeth and pronounce:

- **Train**
- **Grand**
- **Paris**
- **Merci**

---

### Want Real-Time Feedback from a Native?

In my 1-on-1 private lessons, we refine your accent and natural flow from day one. Book your free 20-minute trial session today!`,
    imagen_portada:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    categoria: "Pronunciación",
    palabras_clave: "pronunciacion francesa, r francesa, hablar frances, fonetica francesa",
    meta_titulo: "Cómo pronunciar la R francesa: Guía paso a paso | Florentin",
    meta_descripcion:
      "Aprende a pronunciar la R francesa de forma natural con técnicas anatómicas y ejercicios prácticos de un profesor nativo parisino.",
    tiempo_lectura: 4,
    idioma: "es",
    autor: "Florentin",
    visitas: 142,
    creado_en: new Date().toISOString()
  },
  {
    id: 2,
    slug: "diferencia-entre-c-est-y-il-est",
    titulo: "C'est vs Il est: Deja de confundirlos para siempre",
    extracto:
      "Una de las dudas más frecuentes de los estudiantes de francés explicada con una fórmula sencilla y ejemplos claros de la vida cotidiana en Francia.",
    contenido: `## Una duda clásica que delata a los estudiantes

Tanto **"C'est"** como **"Il est"** se traducen frecuentemente al español como *"Es"*. Por eso, es completamente natural que al empezar a hablar francés dudes cuál utilizar en cada frase.

Pero la buena noticia es que existe una **regla de oro infalible** que te permitirá acertar el 99% de las veces.

---

### La Regla de Oro

#### 1. Usamos "C'est" cuando va seguido de un determinante:
Un determinante puede ser un artículo (*un, une, des, le, la, les*) o un posesivo (*mon, ma, ton, son*):

- **C'est un** ami. *(Es un amigo.)*
- **C'est le** professeur de français. *(Es el profesor de francés.)*
- **C'est ma** valise. *(Es mi maleta.)*
- **C'est** Florentin. *(Es Florentin - nombre propio).*

> **Regla nemotécnica:** Si después de "es" dices "un/una/el/la/mi/tu", siempre usa **C'est**.

---

#### 2. Usamos "Il est" / "Elle est" cuando va seguido directamente de un adjetivo o una profesión:
En este caso **no hay artículo** en medio:

- **Il est** français. *(Es francés - nacionalidad/adjetivo).*
- **Elle est** médecin. *(Ella es médico - profesión sin artículo).*
- **Il est** intelligent. *(Él es inteligente - adjetivo).*
- **Il est** 15h00. *(Son las 15:00 - para decir la hora).*

---

### Tabla Comparativa Rápida

| Estructura | Ejemplo Francés | Traducción |
| :--- | :--- | :--- |
| **C'est + determinante + sustantivo** | *C'est un bon livre.* | Es un buen libro. |
| **Il est + adjetivo** | *Il est grand.* | Es alto. |
| **Il est + profesión** | *Il est professeur.* | Es profesor. |
| **C'est + nombre propio** | *C'est Sophie.* | Es Sophie. |`,
    titulo_fr: "C'est vs Il est : La règle d'or pour ne plus hésiter",
    extracto_fr:
      "L'une des erreurs les plus fréquentes des apprenants enfin expliquée avec une formule claire et des exemples concrets du quotidien.",
    contenido_fr: `## Une confusion fréquente

Beaucoup d'étudiants hésitent entre **"C'est"** et **"Il est"**. Pourtant, il existe une règle très simple pour ne plus jamais vous tromper.

---

### La Règle d'Or

#### 1. Utilisez "C'est" devant un déterminant + nom :
Un déterminant peut être un article (*un, une, des, le, la, les*) ou un possessif (*mon, ma, ton*) :

- **C'est un** ami.
- **C'est le** professeur.
- **C'est ma** valise.
- **C'est** Florentin. *(Prénom)*

---

#### 2. Utilisez "Il est" / "Elle est" directement devant un adjectif ou une profession :
Ici, **aucun article** n'est utilisé :

- **Il est** français. *(Nationalité)*
- **Elle est** médecin. *(Profession)*
- **Il est** ponctuel. *(Adjectif)*
- **Il est** 14h00. *(Heure)*`,
    titulo_en: "C'est vs Il est: The Golden Rule to Stop Confusing Them",
    extracto_en:
      "One of the most common pitfalls for French learners explained with a simple formula and real-life everyday examples.",
    contenido_en: `## A Classic French Dilemma

Both **"C'est"** and **"Il est"** translate to *"It is"* or *"He is"*. It is completely natural to hesitate when speaking.

Here is the **foolproof rule** that works 99% of the time.

---

### The Golden Rule

#### 1. Use "C'est" before a determiner + noun:
A determiner means an article (*un, une, le, la*) or a possessive (*mon, ma, ton*):

- **C'est un** ami. *(He is a friend / It is a friend.)*
- **C'est le** professeur. *(He is the teacher.)*
- **C'est ma** valise. *(It is my suitcase.)*
- **C'est** Florentin. *(It is Florentin - proper name).*

---

#### 2. Use "Il est" / "Elle est" directly before an adjective or profession (No article):
- **Il est** français. *(He is French - nationality).*
- **Elle est** médecin. *(She is a doctor - profession without article).*
- **Il est** intelligent. *(He is intelligent - adjective).*
- **Il est** 15:00. *(It is 3 PM - time).*`,
    imagen_portada:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    categoria: "Gramática",
    palabras_clave: "gramatica francesa, c est vs il est, errores comunes en frances",
    meta_titulo: "C'est vs Il est en Francés: Guía y Diferencias | Florentin",
    meta_descripcion:
      "Descubre la regla infalible para no volver a confundir C'est y Il est en francés con ejemplos prácticos y tabla resumen.",
    tiempo_lectura: 5,
    idioma: "es",
    autor: "Florentin",
    visitas: 98,
    creado_en: new Date().toISOString()
  },
  {
    id: 3,
    slug: "vocabulario-esencial-restaurante-paris",
    titulo: "Cómo pedir en un restaurante en París como un auténtico local",
    extracto:
      "Las frases indispensables, las normas de cortesía que los parisinos aprecian y los errores más comunes al pedir la cuenta.",
    contenido: `## La gastronomía en París: Una experiencia cultural

Comer en un bistró o café en París es mucho más que alimentarse: es un ritual social. Para disfrutarlo al máximo y recibir un servicio amable, hay una serie de fórmulas de cortesía y vocabulario clave que debes conocer.

---

### La palabra mágica que lo cambia todo: "Bonjour"

En Francia, antes de formular cualquier pregunta o pedido, **siempre** debes saludar al camarero:

> *"Bonjour Madame"* o *"Bonjour Monsieur"*.

Si pides una mesa o la carta directamente sin saludar, en la cultura francesa puede percibirse como una falta de educación involuntaria. Un *"Bonjour"* con una sonrisa abre todas las puertas.

---

### Frases indispensables para tu visita

#### Para pedir una mesa:
- **Une table pour deux personnes, s'il vous plaît.** *(Una mesa para dos personas, por favor.)*
- **Est-ce qu'on peut s'asseoir en terrasse ?** *(¿Podemos sentarnos en la terraza?)*

#### Al ordenar comida y bebida:
- **Pour moi, ce sera le plat du jour.** *(Para mí, será el plato del día.)*
- **Je vais prendre une carafe d'eau, s'il vous plaît.** *(Voy a tomar una jarra de agua del grifo - ¡en Francia es gratuita y de excelente calidad!).*
- **Quel vin me conseillez-vous ?** *(¿Qué vino me recomienda?)*

#### Al momento de pagar:
- **L'addition, s'il vous plaît.** *(La cuenta, por favor.)*
- **Est-ce que je peux payer par carte ?** *(¿Puedo pagar con tarjeta?)*`,
    titulo_fr: "Comment commander au restaurant à Paris comme un vrai local",
    extracto_fr:
      "Les phrases indispensables, les codes de politesse parisiens et les astuces pour profiter pleinement des cafés et bistrots.",
    contenido_fr: `## La gastronomie à Paris : Un rituel culturel

Prendre un café ou déjeuner dans un bistrot parisien est un art de vivre. Voici les expressions clés et les formules de politesse indispensables.

---

### Le mot magique : "Bonjour"

Avant de demander une table ou de passer commande, saluez toujours chaleureusement le serveur :

> *"Bonjour Madame"* ou *"Bonjour Monsieur"*.

Un *"Bonjour"* souriant transforme immédiatement l'accueil et la relation avec le serveur.

---

### Expressions utiles au quotidien

- **Une table pour deux, s'il vous plaît.**
- **Pour moi, ce sera le plat du jour.**
- **Une carafe d'eau, s'il vous plaît.** *(L'eau du robinet est excellente et toujours gratuite en France !)*
- **L'addition, s'il vous plaît.**`,
    titulo_en: "How to Order at a Restaurant in Paris Like a True Local",
    extracto_en:
      "Essential phrases, cultural etiquette that Parisians appreciate, and tips on water, tipping, and paying the bill.",
    contenido_en: `## Dining in Paris: A Cultural Ritual

Sitting at a Parisian terrace or bistro is a cherished cultural experience. Here are the polite formulas and essential vocabulary to enjoy it like a Parisian.

---

### The Magic Word: "Bonjour"

Always greet your waiter before asking for anything:

> *"Bonjour Madame"* or *"Bonjour Monsieur"*.

In French culture, greeting first is essential polite etiquette that sets a friendly tone for your entire meal.

---

### Essential Phrases

- **Une table pour deux personnes, s'il vous plaît.** *(A table for two, please.)*
- **Pour moi, ce sera le plat du jour.** *(For me, I will have today's special.)*
- **Une carafe d'eau, s'il vous plaît.** *(A jug of tap water, please - completely free and high quality in France!)*
- **L'addition, s'il vous plaît.** *(The check, please.)*`,
    imagen_portada:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    categoria: "Cultura & Viajes",
    palabras_clave: "frances para viajar, restaurante paris, vocabulario frances comida",
    meta_titulo: "Vocabulario Francés para Restaurantes en París | Florentin",
    meta_descripcion:
      "Aprende las frases esenciales y fórmulas de cortesía para ordenar en cafés y restaurantes parisinos como un local.",
    tiempo_lectura: 3,
    idioma: "es",
    autor: "Florentin",
    visitas: 210,
    creado_en: new Date().toISOString()
  }
];

async function getArticuloBySlug(slug: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      supabase
        .from("articulos")
        .update({ visitas: (data.visitas || 0) + 1 })
        .eq("id", data.id)
        .then(() => {});

      return data;
    }
  } catch (err) {
    console.error("Error al buscar artículo en Supabase:", err);
  }

  const fallback = fallbackArticulos.find((a) => a.slug === slug);
  return fallback || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const art = await getArticuloBySlug(slug);

  if (!art) {
    return {
      title: "Artículo no encontrado | Le Français avec Florentin"
    };
  }

  const title = art.meta_titulo || `${art.titulo} | Le Français avec Florentin`;
  const description = art.meta_descripcion || art.extracto || "Aprende francés con Florentin.";
  const image = art.imagen_portada || "/french_hero.png";

  return {
    title,
    description,
    keywords: art.palabras_clave ? art.palabras_clave.split(",").map((k: string) => k.trim()) : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: art.creado_en,
      authors: [art.autor || "Florentin"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: art.titulo
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function ArticuloIndividualPage({ params }: PageProps) {
  const { slug } = await params;
  const articulo = await getArticuloBySlug(slug);

  if (!articulo) {
    notFound();
  }

  // Schema.org para Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: articulo.titulo,
    description: articulo.meta_descripcion || articulo.extracto,
    image: articulo.imagen_portada,
    datePublished: articulo.creado_en,
    author: {
      "@type": "Person",
      name: articulo.autor || "Florentin",
      jobTitle: "Profesor Nativo de Francés"
    },
    publisher: {
      "@type": "Organization",
      name: "Le Français avec Florentin",
      logo: {
        "@type": "ImageObject",
        url: "https://lefrancaisavecflorentin.com/logo.png"
      }
    }
  };

  const relacionados = fallbackArticulos.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClientView articulo={articulo} relacionados={relacionados} />
    </>
  );
}
