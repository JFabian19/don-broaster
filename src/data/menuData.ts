export interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
  badge?: string;
  popular?: boolean;
  nota?: string;
}

export interface Category {
  id: string;
  nombre: string;
  icono?: string;
  descripcion?: string;
  items: Dish[];
}

export const DEFAULT_MENU_DATA: Category[] = [
  {
    id: "especialidad",
    nombre: "Especialidad de la Casa",
    icono: "👑",
    descripcion: "Nuestra creación estrella bien cargada y contundente.",
    items: [
      {
        nombre: "Don Mega",
        descripcion: "Combinación especial preparada con una presa de pollo a elección entre encuentro o ala, hot dog, chorizo sabroso y huevo frito.",
        precio: "S/.20.00",
        imagen: "/don-mega.webp",
        badge: "⭐ El Más Vendido",
        popular: true,
        nota: "Encuentro o ala"
      },
      {
        nombre: "Mostrito",
        descripcion: "Combinación potente de arroz chaufa oriental preparado en wok, abundante porción de papas fritas y jugosa presa broaster crocante.",
        precio: "S/.18.00",
        imagen: "/mostrito.webp",
        badge: "🔥 Favorito de Barrio",
        popular: true
      }
    ]
  },
  {
    id: "food",
    nombre: "Food - Broaster & Papas",
    icono: "🍗",
    descripcion: "Presas crocantes de pollo broaster estilo barrio y papas doraditas.",
    items: [
      {
        nombre: "Pecho",
        descripcion: "Jugosa presa de pecho de pollo empanizada y frita al crujiente estilo broaster. ¡Incluye chaufa gratis hasta agotar stock!",
        precio: "S/.16.00",
        imagen: "/pecho.webp",
        badge: "🎁 Chaufa Gratis",
        popular: true,
        nota: "Hasta agotar stock"
      },
      {
        nombre: "Encuentro",
        descripcion: "Presa de encuentro de pollo tradicional, súper jugosa por dentro y extra crocante por fuera. ¡Incluye chaufa gratis hasta agotar stock!",
        precio: "S/.14.00",
        imagen: "/encuentro.webp",
        badge: "🎁 Chaufa Gratis",
        popular: true,
        nota: "Hasta agotar stock"
      },
      {
        nombre: "Alota",
        descripcion: "Pieza de pollo seleccionada «Alota» estilo broaster dorado crocante. ¡Incluye chaufa gratis hasta agotar stock!",
        precio: "S/.13.50",
        imagen: "/alota.webp",
        badge: "🎁 Chaufa Gratis",
        nota: "Hasta agotar stock"
      },
      {
        nombre: "Salchipapa Especial",
        descripcion: "Generosa porción de papas fritas crocantes acompañadas con salchicha dorada, abundante chorizo parrillero y huevo frito montado.",
        precio: "S/.15.00",
        imagen: "/salchipapa-especial.webp",
        badge: "⭐ Súper Cargada",
        popular: true
      },
      {
        nombre: "Salchipapa",
        descripcion: "Combinación icónica de papas fritas amarillas crujientes con abundantes rodajas de salchicha dorada.",
        precio: "S/.11.00",
        imagen: "/salchipapa.webp",
        badge: "🔥 Clásico de Barrio",
        popular: true
      }
    ]
  },
  {
    id: "adicionales",
    nombre: "Adicionales",
    icono: "🍟",
    descripcion: "Añade más sabor a tu plato preferido.",
    items: [
      {
        nombre: "Presa de pollo",
        descripcion: "Presa adicional de pollo frito a elección entre encuentro o ala.",
        precio: "S/.11.00",
        imagen: "/presa-de-pollo.webp",
        nota: "Encuentro o ala"
      },
      {
        nombre: "Huevo",
        descripcion: "Unidad adicional de huevo frito con yema montada.",
        precio: "S/.2.00",
        imagen: "/huevo.webp"
      }
    ]
  }
];
