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
        imagen: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
        badge: "⭐ El Más Vendido",
        popular: true,
        nota: "Encuentro o ala"
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
        imagen: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
        badge: "🎁 Chaufa Gratis",
        popular: true,
        nota: "Hasta agotar stock"
      },
      {
        nombre: "Encuentro",
        descripcion: "Presa de encuentro de pollo tradicional, súper jugosa por dentro y extra crocante por fuera. ¡Incluye chaufa gratis hasta agotar stock!",
        precio: "S/.14.00",
        imagen: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
        badge: "🎁 Chaufa Gratis",
        popular: true,
        nota: "Hasta agotar stock"
      },
      {
        nombre: "Alota",
        descripcion: "Pieza de pollo seleccionada «Alota» estilo broaster dorado crocante. ¡Incluye chaufa gratis hasta agotar stock!",
        precio: "S/.13.50",
        imagen: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80",
        badge: "🎁 Chaufa Gratis",
        nota: "Hasta agotar stock"
      },
      {
        nombre: "Salchipapa",
        descripcion: "Combinación icónica de papas fritas amarillas crujientes con abundantes rodajas de salchicha dorada.",
        precio: "S/.11.00",
        imagen: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
        badge: "🔥 Clásico de Barrio",
        popular: true
      },
      {
        nombre: "Porción de papa",
        descripcion: "Porción generosa de papas fritas crujientes doradas al momento.",
        precio: "S/.9.00",
        imagen: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80"
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
        imagen: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80",
        nota: "Encuentro o ala"
      },
      {
        nombre: "Tocino",
        descripcion: "Porción de tocino crocante frito al momento.",
        precio: "S/.4.00",
        imagen: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=800&q=80"
      },
      {
        nombre: "Chorizo",
        descripcion: "Porción adicional de chorizo parrillero dorado.",
        precio: "S/.3.00",
        imagen: "https://images.unsplash.com/photo-1597393353415-b3730f3719fe?auto=format&fit=crop&w=800&q=80"
      },
      {
        nombre: "Plátano",
        descripcion: "Porción adicional de plátano frito doradito.",
        precio: "S/.3.00",
        imagen: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80"
      },
      {
        nombre: "Hot dog",
        descripcion: "Porción adicional de frankfurter frito.",
        precio: "S/.2.00",
        imagen: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80"
      },
      {
        nombre: "Huevo",
        descripcion: "Unidad adicional de huevo frito con yema montada.",
        precio: "S/.2.00",
        imagen: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "promociones",
    nombre: "Promociones",
    icono: "🔥",
    descripcion: "Promociones especiales y regalos de la casa.",
    items: [
      {
        nombre: "Chaufa gratis",
        descripcion: "Arroz chaufa oriental preparado en wok gratis con tu pedido de plato broaster. Válido hasta agotar stock del día.",
        precio: "¡Gratis!",
        imagen: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
        badge: "🎉 Regalo de la casa",
        popular: true,
        nota: "Hasta agotar stock"
      }
    ]
  },
  {
    id: "informacion",
    nombre: "Información del Negocio",
    icono: "📍",
    descripcion: "Visítanos o contáctanos para tus pedidos.",
    items: [
      {
        nombre: "Horario de atención",
        descripcion: "Atendemos de Lunes a Sábado desde las 6:00 p. m. hasta las 11:00 p. m.",
        precio: "Lun - Sáb",
        imagen: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        badge: "⏰ 6:00 PM - 11:00 PM"
      },
      {
        nombre: "Ubicación",
        descripcion: "Encuéntranos en Dammert Muelle, Surquillo. ¡Sabor contundente cerca a ti!",
        precio: "Surquillo",
        imagen: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
        badge: "📍 Dammert Muelle"
      }
    ]
  }
];

