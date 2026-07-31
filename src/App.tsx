import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  ChevronRight, 
  X, 
  Utensils, 
  MapPin, 
  Loader2, 
  Gift, 
  Star, 
  Clock, 
  Phone, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Check,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, submitSheetData, SheetDish, SheetCategory, SheetOption, getSheetValue, isAvailable, SHEET_ID } from './services/googleSheets';
import { DEFAULT_MENU_DATA, Category, Dish } from './data/menuData';

// ==========================================
// ==========================================
// 📋 CONFIGURACIÓN DE DON BROASTER
// ==========================================
const RESTAURANTE_NAME = "Don Broaster";
const RESTAURANTE_SLOGAN = "Desde 1999 • Se prepara con cariño";
const WHATSAPP_NUMBER = "51970590336"; 
const YAPE_NUMBER = "970590336";
const YAPE_HOLDER = "Jhonatan jesus andres navarro"; 
const TIKTOK_URL = "https://www.tiktok.com/@don.broaster";
const FACEBOOK_URL = "https://www.facebook.com/donbroaster";
const MAPS_LOCATION = "Pl. de la Composición 102, Surquillo";
const MAPS_URL = "https://www.google.com/maps/place/Pl.+de+la+Composici%C3%B3n+102,+Surquillo+15047/@-12.1071,-77.0249,17z/data=!4m6!3m5!1s0x9105c86d2f2e6ccb:0x76723896f31be44!8m2!3d-12.1070296!4d-77.0243948!16s%2Fg%2F11rzcvq3yp!5m1!1e1?hl=es&entry=ttu&g_ep=EgoyMDI2MDcyNi4wIKXMDSoASAFQAw%3D%3D";
const MARQUEE_TEXT = "🍗 DESDE 1999 SIRVIENDO SABOR • POLLO BROASTER, SALCHIPAPAS Y COMBOS CONTUNDENTES • ¡PIDE TU FAVORITO EN DON BROASTER! 🔥🍟 ";
const BIRTHDAY_COPY = "🎉 ¡Registra tu cumpleaños y recibe una sorpresa bien crocante de Don Broaster! 🍗🍟🎁";

// Iconos SVG para redes sociales

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Helper robusto para parsear precios (evita errores con S/.16.00 o S/. 20.00)
const parsePrice = (priceStr?: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/^[^0-9]+/, '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// Opciones de cremas y adicionales
const CREMAS_OPCIONES = [
  "Ají",
  "Mayonesa",
  "Mostaza",
  "Tártara",
  "Ketchup"
];

const ADICIONALES_OPCIONES = [
  { nombre: "Hot dog", precio: 2.00 },
  { nombre: "Chorizo", precio: 3.00 },
  { nombre: "Huevo", precio: 2.00 },
  { nombre: "Tocino", precio: 4.00 }
];

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 2.44 6.34 6.34 0 0 0-1.396 3.993 6.345 6.345 0 0 0 6.344 6.345 6.345 6.345 0 0 0 6.345-6.345V9.083a8.21 8.21 0 0 0 4.761 1.503V7.14a4.814 4.814 0 0 1-1.427-.454z"/>
  </svg>
);

const YapeIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`rounded-xl shadow-md shrink-0 border border-white/20 ${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#742284"/>
    <g transform="translate(95, 25)">
      <path d="M35 0C54.33 0 70 15.67 70 35C70 54.33 54.33 70 35 70C27.5 70 20.5 67.6 14.8 63.5L5 72L9 53.8C2.8 48.2 0 41.5 0 35C0 15.67 15.67 0 35 0Z" fill="#00D3B6"/>
      <text x="35" y="44" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="26" fill="#742284" textAnchor="middle">S/</text>
    </g>
    <text x="100" y="155" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="62" fill="#FFFFFF" textAnchor="middle" letterSpacing="-2">yape</text>
  </svg>
);

// ==========================================

interface CartItem {
  id: string;
  nombre: string;
  precioBaseStr: string;
  precioBaseNum: number;
  precioUnitarioTotal: number;
  cantidad: number;
  crema: string;
  piezaPollo?: string;
  adicionales: string[];
  incluyeChaufaGratis?: boolean;
  observaciones: string;
  imagen?: string;
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_MENU_DATA);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("especialidad");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Modal options state for selected dish
  const [selectedCream, setSelectedCream] = useState<string>("Ají");
  const [selectedChickenPiece, setSelectedChickenPiece] = useState<'Encuentro' | 'Ala'>('Encuentro');
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]);
  const [includeChaufaGratis, setIncludeChaufaGratis] = useState<boolean>(false);
  const [dishObservation, setDishObservation] = useState<string>("");
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  // Dynamic options for Cremas & Adicionales from Google Sheets
  const [cremasOpciones, setCremasOpciones] = useState<string[]>(CREMAS_OPCIONES);
  const [adicionalesOpciones, setAdicionalesOpciones] = useState<{ nombre: string; precio: number; precioStr?: string }[]>(ADICIONALES_OPCIONES);

  // States for Checkout Modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    nombre: '',
    direccion: '',
    metodoPago: 'Yape' as 'Yape' | 'Efectivo',
    montoEfectivo: '',
    gpsLink: ''
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // States for Birthday Form
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [isSubmittingBirthday, setIsSubmittingBirthday] = useState(false);
  const [birthdaySuccess, setBirthdaySuccess] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    distrito: 'Surquillo',
    correo: ''
  });

  // States for Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({
    estrellasMozo: 5,
    estrellasComida: 5,
    comentario: ''
  });

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyYapeNumber = () => {
    navigator.clipboard.writeText(YAPE_NUMBER);
    showToast("¡Número Yape 970590336 copiado! 📱");
  };

  useEffect(() => {
    const loadData = async () => {
      if (!SHEET_ID) return;
      setLoading(true);
      try {
        const [cats, dishes] = await Promise.all([
          fetchSheetData<SheetCategory>('Categorías'),
          fetchSheetData<SheetDish>('Platos')
        ]);

        if (cats.length > 0 || dishes.length > 0) {
          const formattedCategories: Category[] = cats
            .filter(c => {
              const catName = getSheetValue(c, 'nombre') || getSheetValue(c, 'categoría') || getSheetValue(c, 'categoria');
              const lower = catName.toLowerCase();
              return lower !== 'información del negocio' && lower !== 'informacion' && lower !== 'promociones';
            })
            .map(c => {
              const catName = getSheetValue(c, 'nombre') || getSheetValue(c, 'categoría') || getSheetValue(c, 'categoria');
              return {
                id: catName.toLowerCase().replace(/\s+/g, '-'),
                nombre: catName,
                items: dishes
                  .filter(d => {
                    const dishCat = getSheetValue(d, 'categoría') || getSheetValue(d, 'categoria');
                    const dishName = getSheetValue(d, 'nombre del plato') || getSheetValue(d, 'nombre');
                    
                    if (dishCat.toLowerCase() !== catName.toLowerCase()) return false;
                    if (dishName.toLowerCase().includes('chaufa gratis')) return false;
                    
                    // Filtro inteligente de disponibilidad (Si, SI, si, ON, On, 1 vs No, NO, no, OFF, Off, 0)
                    return isAvailable(d);
                  })
                  .map(d => ({
                    nombre: getSheetValue(d, 'nombre del plato') || getSheetValue(d, 'nombre'),
                    descripcion: getSheetValue(d, 'descripción') || getSheetValue(d, 'descripcion'),
                    precio: getSheetValue(d, 'precio'),
                    imagen: getSheetValue(d, 'url de imagen') || getSheetValue(d, 'imagen') || getSheetValue(d, 'url') || undefined
                  }))
              };
            })
            .filter(c => c.items.length > 0);
          setCategories(formattedCategories);
          if (formattedCategories.length > 0) {
            setActiveCategory(formattedCategories[0].id);
          }
        }

        // Cargar Cremas y Adicionales dinámicos desde la hoja 'Opciones' o 'Cremas y Adicionales'
        try {
          let opcionesSheet = await fetchSheetData<SheetOption>('Opciones');
          if (!opcionesSheet || opcionesSheet.length === 0) {
            opcionesSheet = await fetchSheetData<SheetOption>('Cremas y Adicionales');
          }

          if (opcionesSheet && opcionesSheet.length > 0) {
            const activeOpts = opcionesSheet.filter(o => {
              const name = getSheetValue(o, 'nombre') || getSheetValue(o, 'opción') || getSheetValue(o, 'opcion');
              if (!name) return false;
              return isAvailable(o);
            });

            const fetchedCremas = activeOpts
              .filter(o => {
                const tipo = getSheetValue(o, 'tipo').toLowerCase();
                return tipo.includes('crema');
              })
              .map(o => (getSheetValue(o, 'nombre') || getSheetValue(o, 'opción') || getSheetValue(o, 'opcion')).trim());

            const fetchedAdicionales = activeOpts
              .filter(o => {
                const tipo = getSheetValue(o, 'tipo').toLowerCase();
                return tipo.includes('adic') || tipo.includes('extra');
              })
              .map(o => {
                const name = (getSheetValue(o, 'nombre') || getSheetValue(o, 'opción') || getSheetValue(o, 'opcion')).trim();
                const priceStr = getSheetValue(o, 'precio');
                const priceNum = priceStr ? parsePrice(priceStr) : 0;
                return {
                  nombre: name,
                  precio: priceNum,
                  precioStr: priceStr
                };
              });

            if (fetchedCremas.length > 0) setCremasOpciones(fetchedCremas);
            if (fetchedAdicionales.length > 0) setAdicionalesOpciones(fetchedAdicionales);
          }
        } catch (err) {
          console.warn("Hoja de opciones no encontrada o vacía:", err);
        }
      } catch (error) {
        console.error("Error loading data from sheets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const isBroasterDish = useMemo(() => {
    if (!selectedDish) return false;
    const name = selectedDish.nombre.toLowerCase();
    const catId = activeCategory.toLowerCase();
    return (
      name.includes("pecho") ||
      name.includes("encuentro") ||
      name.includes("alota") ||
      name.includes("don mega") ||
      name.includes("mostrito") ||
      name.includes("broaster") ||
      name.includes("presa") ||
      catId.includes("broaster") ||
      catId.includes("especialidad")
    );
  }, [selectedDish, activeCategory]);

  const isChickenPieceDish = useMemo(() => {
    if (!selectedDish) return false;
    const name = selectedDish.nombre.toLowerCase();
    const desc = (selectedDish.descripcion || '').toLowerCase();
    const nota = (selectedDish.nota || '').toLowerCase();
    return (
      name.includes("don mega") ||
      name.includes("presa de pollo") ||
      desc.includes("encuentro o ala") ||
      nota.includes("encuentro o ala")
    );
  }, [selectedDish]);

  const openDishModal = (dish: Dish, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedDish(dish);
    setSelectedCream(cremasOpciones[0] || "Ají");
    setSelectedChickenPiece('Encuentro');
    setSelectedAdditionals([]);
    setIncludeChaufaGratis(false);
    setDishObservation("");
    setModalQuantity(1);
  };

  const toggleAdditional = (addName: string) => {
    setSelectedAdditionals(prev =>
      prev.includes(addName)
        ? prev.filter(name => name !== addName)
        : [...prev, addName]
    );
  };

  const calculateDishModalUnitPrice = (dish: Dish) => {
    const baseNum = parsePrice(dish.precio);
    const additionalsCost = selectedAdditionals.reduce((sum, addName) => {
      const found = adicionalesOpciones.find(a => a.nombre === addName);
      return sum + (found ? found.precio : 0);
    }, 0);
    return baseNum + additionalsCost;
  };

  const handleAddToCartFromModal = () => {
    if (!selectedDish) return;

    const baseNum = parsePrice(selectedDish.precio);

    const additionalsCost = selectedAdditionals.reduce((sum, addName) => {
      const found = adicionalesOpciones.find(a => a.nombre === addName);
      return sum + (found ? found.precio : 0);
    }, 0);

    const hasChaufa = isBroasterDish ? includeChaufaGratis : false;
    const piece = isChickenPieceDish ? selectedChickenPiece : undefined;
    const unitTotal = baseNum + additionalsCost;
    const sortedAdds = [...selectedAdditionals].sort().join(',');
    const itemId = `${selectedDish.nombre}|${piece || ''}|${selectedCream}|${sortedAdds}|${hasChaufa ? 'chaufa' : ''}|${dishObservation.trim()}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].cantidad += modalQuantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: itemId,
          nombre: selectedDish.nombre,
          precioBaseStr: selectedDish.precio,
          precioBaseNum: baseNum,
          precioUnitarioTotal: unitTotal,
          cantidad: modalQuantity,
          crema: selectedCream,
          piezaPollo: piece,
          adicionales: [...selectedAdditionals],
          incluyeChaufaGratis: hasChaufa,
          observaciones: dishObservation.trim(),
          imagen: selectedDish.imagen
        }
      ];
    });

    showToast(`¡${selectedDish.nombre} agregado al pedido! 🍗`);
    setSelectedDish(null);
  };

  const updateCartItemQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const newQty = i.cantidad + delta;
            return newQty > 0 ? { ...i, cantidad: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.cantidad, 0), [cart]);

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.precioUnitarioTotal * item.cantidad), 0);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast("Tu navegador no soporta geolocalización");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        setCheckoutData(prev => ({ ...prev, gpsLink: mapUrl }));
        setIsGettingLocation(false);
        showToast("¡Ubicación GPS obtenida! 📍");
      },
      (error) => {
        console.error(error);
        setIsGettingLocation(false);
        showToast("No se pudo obtener la ubicación automáticamente");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirmCheckoutAndSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!checkoutData.nombre.trim()) {
      showToast("Por favor ingresa tu nombre");
      return;
    }
    if (!checkoutData.direccion.trim() && !checkoutData.gpsLink) {
      showToast("Por favor ingresa tu dirección o usa el botón de ubicación GPS");
      return;
    }

    const orderId = `#DB-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString('es-PE');
    const total = calculateTotal();

    const orderSummary = cart.map(item => {
      let desc = `${item.cantidad}x ${item.nombre}`;
      if (item.piezaPollo) desc += ` (Presa: ${item.piezaPollo})`;
      if (item.crema) desc += ` (Crema: ${item.crema})`;
      if (item.incluyeChaufaGratis) desc += ` [Con Chaufa Gratis]`;
      if (item.adicionales.length > 0) desc += ` (Adic: ${item.adicionales.join(', ')})`;
      if (item.observaciones) desc += ` [Obs: ${item.observaciones}]`;
      return desc;
    }).join(' | ');

    // Registrar pedido en Google Sheets con estado PENDIENTE
    submitSheetData('Pedidos', {
      orderId: orderId,
      timestamp: timestamp,
      cliente: checkoutData.nombre.trim(),
      direccion: checkoutData.direccion.trim() || checkoutData.gpsLink,
      metodoPago: 'Yape',
      detalle: orderSummary,
      total: `S/.${total.toFixed(2)}`,
      estado: 'PENDIENTE'
    });

    let message = `*¡NUEVO PEDIDO ${orderId} - DON BROASTER! 🍗*\n\n`;
    message += `🆔 *Código de Pedido:* ${orderId}\n`;
    message += `👤 *Cliente:* ${checkoutData.nombre.trim()}\n`;
    
    if (checkoutData.direccion.trim()) {
      message += `📍 *Dirección/Ref:* ${checkoutData.direccion.trim()}\n`;
    }
    if (checkoutData.gpsLink) {
      message += `🌐 *Ubicación GPS:* ${checkoutData.gpsLink}\n`;
    }
    
    message += `💳 *Método de Pago:* Yape\n\n`;
    message += `*--- DETALLE DEL PEDIDO ---*\n`;

    cart.forEach((item, idx) => {
      const subtotalItem = item.precioUnitarioTotal * item.cantidad;
      message += `*${idx + 1}. ${item.cantidad}x ${item.nombre}* — S/.${subtotalItem.toFixed(2)}\n`;
      if (item.piezaPollo) {
        message += `   🍗 *Presa:* ${item.piezaPollo}\n`;
      }
      message += `   🥣 *Crema:* ${item.crema}\n`;
      if (item.incluyeChaufaGratis) {
        message += `   🎁 *Chaufa Gratis:* Sí (¡Regalo de la casa!)\n`;
      }

      if (item.adicionales.length > 0) {
        const addsFormatted = item.adicionales.map(addName => {
          const found = ADICIONALES_OPCIONES.find(a => a.nombre === addName);
          return `${addName} (+S/.${found ? found.precio.toFixed(2) : '0.00'})`;
        }).join(', ');
        message += `   🥓 *Adicionales:* ${addsFormatted}\n`;
      } else {
        message += `   🥓 *Adicionales:* Sin adicionales\n`;
      }

      if (item.observaciones) {
        message += `   📝 *Obs:* ${item.observaciones}\n`;
      }
      message += `\n`;
    });

    message += `💰 *TOTAL A PAGAR: S/.${total.toFixed(2)}*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    setShowCheckoutModal(false);
    setShowSummary(false);
    setCart([]);
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleBirthdaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBirthday(true);
    const success = await submitSheetData('Cumpleaños', {
      timestamp: new Date().toLocaleString('es-PE'),
      nombre: birthdayData.nombre,
      telefono: birthdayData.telefono,
      fechaNacimiento: birthdayData.fechaNacimiento,
      distrito: birthdayData.distrito,
      correo: birthdayData.correo || 'No indicado'
    });
    
    setIsSubmittingBirthday(false);
    if (success) {
      setBirthdaySuccess(true);
      setTimeout(() => {
        setShowBirthdayForm(false);
        setBirthdaySuccess(false);
        setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: 'Surquillo', correo: '' });
      }, 3000);
    } else {
      setBirthdaySuccess(true);
      setTimeout(() => {
        setShowBirthdayForm(false);
        setBirthdaySuccess(false);
        setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: 'Surquillo', correo: '' });
      }, 2500);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    await submitSheetData('Reseñas', {
      timestamp: new Date().toLocaleString('es-PE'),
      estrellasMozo: reviewData.estrellasMozo,
      estrellasComida: reviewData.estrellasComida,
      comentario: reviewData.comentario || 'Sin comentarios'
    });
    
    setIsSubmittingReview(false);
    setReviewSuccess(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSuccess(false);
      setReviewData({ estrellasMozo: 5, estrellasComida: 5, comentario: '' });
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFDF8]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#F2B33D] border-t-[#D6282F] rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl">🍗</span>
        </div>
        <p className="font-anton text-[#D6282F] tracking-wider uppercase text-lg mt-4">Don Broaster</p>
        <p className="font-poppins text-xs text-[#271B1C]/70">Cargando el sabor crocante desde 1999...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#271B1C] font-poppins selection:bg-[#D6282F] selection:text-white pb-28">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#271B1C] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-[#F2B33D]/50 text-xs sm:text-sm font-semibold max-w-sm text-center"
          >
            <Sparkles className="w-4 h-4 text-[#F2B33D] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MARQUEE BANNER TOP */}
      <div className="bg-[#D6282F] text-[#FFFDF8] overflow-hidden py-2 text-xs md:text-sm font-anton tracking-wider uppercase shadow-inner border-b border-[#271B1C]/10">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-4">
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#D6282F]/15 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1 shadow-md border-2 border-[#F2B33D] transform -rotate-3 hover:rotate-0 transition-transform overflow-hidden">
              <img 
                src="/logo.svg" 
                alt="Don Broaster Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-anton text-2xl md:text-3xl text-[#D6282F] leading-none tracking-wide drop-shadow-sm">
                  DON BROASTER
                </h1>
                <span className="bg-[#F2B33D] text-[#271B1C] text-[10px] font-anton px-1.5 py-0.5 rounded shadow-sm">
                  1999
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-[#271B1C]/80 font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#D6282F] fill-[#D6282F]" />
                {RESTAURANTE_SLOGAN}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBirthdayForm(true)}
              className="hidden sm:flex items-center gap-1.5 bg-[#F2B33D] hover:bg-[#d99a26] text-[#271B1C] px-3 py-1.5 rounded-full font-semibold text-xs transition shadow-sm border border-[#271B1C]/10"
              title="Registra tu cumpleaños"
            >
              <Gift className="w-3.5 h-3.5 text-[#D6282F]" />
              <span>Cumpleaños</span>
            </button>

            <button
              onClick={() => setShowReviewForm(true)}
              className="p-2 rounded-full text-[#D6282F] hover:bg-[#D6282F]/10 transition"
              title="Dejar opinión"
            >
              <Star className="w-5 h-5 fill-[#F2B33D] text-[#F2B33D]" />
            </button>

            {/* Redes Sociales (TikTok & Facebook) */}
            <div className="flex items-center gap-1.5">
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-black text-white rounded-full hover:scale-110 transition shadow flex items-center justify-center border border-white/20"
                title="TikTok Don Broaster"
              >
                <TikTokIcon className="w-4 h-4 fill-white" />
              </a>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-[#1877F2] text-white rounded-full hover:scale-110 transition shadow flex items-center justify-center"
                title="Facebook Don Broaster"
              >
                <FacebookIcon className="w-4 h-4 fill-white" />
              </a>
            </div>
          </div>
        </div>

        {/* CATEGORY NAV TABS */}
        <div className="max-w-4xl mx-auto px-4 py-2 border-t border-[#271B1C]/5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#D6282F] text-white shadow-md shadow-[#D6282F]/30 scale-105'
                      : 'bg-white text-[#271B1C] border border-[#271B1C]/15 hover:border-[#D6282F] hover:text-[#D6282F]'
                  }`}
                >
                  <span>{cat.icono || '🍗'}</span>
                  <span>{cat.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* HERO BANNER SECTION */}
      <section className="relative max-w-4xl mx-auto px-4 pt-4 pb-2">
        <div className="bg-gradient-to-r from-[#D6282F] via-[#c42127] to-[#271B1C] rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden relative border-2 border-[#F2B33D]/40">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#F2B33D]/20 rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full"></div>

          <div className="relative z-10 max-w-xl">
            <h2 className="font-anton text-3xl sm:text-5xl leading-tight text-[#FFFDF8] tracking-wide mb-3 drop-shadow-md">
              🔥 ¡CHAUFA GRATIS HASTA AGOTAR STOCK!
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-normal">
              Pollo Broaster con sabor criollo de barrio, salchipapas cargadas y adicionales a tu gusto. ¡Pide directo por WhatsApp!
            </p>
          </div>
        </div>

        {/* BIRTHDAY PROMO BANNER BUTTON */}
        <div 
          onClick={() => setShowBirthdayForm(true)}
          className="mt-3 bg-gradient-to-r from-[#F2B33D] to-[#e5a228] text-[#271B1C] rounded-2xl p-3 px-4 shadow-md flex items-center justify-between cursor-pointer hover:opacity-95 transition border border-[#271B1C]/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🎁</span>
            <div>
              <p className="font-bold text-xs sm:text-sm leading-snug">
                ¿Estás de Cumpleaños?
              </p>
              <p className="text-[11px] text-[#271B1C]/80 font-medium">
                Regístrate y recibe una sorpresa bien crocante de Don Broaster
              </p>
            </div>
          </div>
          <span className="bg-[#D6282F] text-white font-anton text-xs px-3 py-1.5 rounded-xl shadow-sm whitespace-nowrap">
            ¡Registrarme!
          </span>
        </div>
      </section>

      {/* MAIN MENU DISHES */}
      <main className="max-w-4xl mx-auto px-4 py-4 space-y-8">
        {categories.map((category) => (
          <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-36">
            
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-[#D6282F]/20">
              <span className="text-2xl p-2 bg-[#D6282F]/10 rounded-2xl">{category.icono || '🍗'}</span>
              <div>
                <h3 className="font-anton text-2xl sm:text-3xl text-[#D6282F] uppercase tracking-wide">
                  {category.nombre}
                </h3>
                {category.descripcion && (
                  <p className="text-xs text-[#271B1C]/70 font-medium">{category.descripcion}</p>
                )}
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.items.map((dish, idx) => (
                <motion.div
                  key={`${dish.nombre}-${idx}`}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => openDishModal(dish, e)}
                  className="bg-white rounded-2xl border border-[#271B1C]/10 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between group relative"
                >
                  {/* Dish Image / Header (1x1 Square Aspect Ratio) */}
                  <div className="relative aspect-square w-full bg-[#271B1C]/5 overflow-hidden">
                    {dish.imagen ? (
                      <img
                        src={dish.imagen}
                        alt={dish.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "true";
                            target.src = "/don-mega.webp";
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#D6282F]/5 to-[#F2B33D]/10">
                        <Utensils className="w-10 h-10 text-[#D6282F]/40 mb-1" />
                        <span className="font-anton text-xs text-[#D6282F]/60">Don Broaster</span>
                      </div>
                    )}

                    {/* Badge if present */}
                    {dish.badge && (
                      <span className="absolute top-2 left-2 bg-[#D6282F] text-white text-[10px] font-anton px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider shimmer-badge">
                        {dish.badge}
                      </span>
                    )}

                    {/* Nota small tag */}
                    {dish.nota && (
                      <span className="absolute bottom-2 right-2 bg-[#271B1C]/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {dish.nota}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-poppins font-bold text-base sm:text-lg text-[#271B1C] group-hover:text-[#D6282F] transition-colors leading-snug">
                          {dish.nombre}
                        </h4>
                        <span className="font-anton text-lg sm:text-xl text-[#D6282F] whitespace-nowrap bg-[#D6282F]/5 px-2 py-0.5 rounded-lg border border-[#D6282F]/10">
                          {dish.precio}
                        </span>
                      </div>
                      {dish.descripcion && (
                        <p className="text-xs text-[#271B1C]/75 font-normal leading-relaxed line-clamp-2 mb-3">
                          {dish.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-[#271B1C]/5 flex items-center justify-between">
                      <span className="text-[11px] text-[#271B1C]/50 font-medium">Ver detalle / Opciones</span>
                      <button
                        onClick={(e) => openDishModal(dish, e)}
                        className="bg-[#D6282F] hover:bg-[#b81e24] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* DISH DETAIL & CUSTOMIZATION MODAL */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border-2 border-[#F2B33D]/50 my-auto max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dish Header Image */}
              <div className="h-52 sm:h-60 bg-[#271B1C]/5 relative shrink-0">
                {selectedDish.imagen ? (
                  <img
                    src={selectedDish.imagen}
                    alt={selectedDish.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "true";
                        target.src = "/don-mega.webp";
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#D6282F]/10">
                    <Utensils className="w-16 h-16 text-[#D6282F]" />
                  </div>
                )}
                {selectedDish.badge && (
                  <span className="absolute bottom-3 left-3 bg-[#D6282F] text-white font-anton text-xs px-3 py-1 rounded-full shadow-md">
                    {selectedDish.badge}
                  </span>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h3 className="font-poppins font-extrabold text-2xl text-[#271B1C]">
                      {selectedDish.nombre}
                    </h3>
                    <span className="font-anton text-2xl text-[#D6282F]">
                      {selectedDish.precio}
                    </span>
                  </div>

                  {selectedDish.nota && (
                    <span className="inline-block bg-[#F2B33D]/20 text-[#271B1C] font-semibold text-xs px-2.5 py-0.5 rounded-md mb-2">
                      📌 {selectedDish.nota}
                    </span>
                  )}

                  {selectedDish.descripcion && (
                    <p className="text-xs sm:text-sm text-[#271B1C]/80 leading-relaxed font-normal">
                      {selectedDish.descripcion}
                    </p>
                  )}
                </div>

                {/* ELECCIÓN DE PRESA DE POLLO (ENCUENTRO O ALA) */}
                {isChickenPieceDish && (
                  <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#F2B33D]/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-xs sm:text-sm text-[#271B1C] flex items-center gap-1.5">
                        <span>🍗 Elige tu Presa de Pollo</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] bg-[#D6282F]/10 text-[#D6282F] font-bold px-2 py-0.5 rounded-full uppercase">
                        Obligatorio
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {(['Encuentro', 'Ala'] as const).map((pieza) => {
                        const isSelected = selectedChickenPiece === pieza;
                        return (
                          <button
                            key={pieza}
                            type="button"
                            onClick={() => setSelectedChickenPiece(pieza)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-[#D6282F] text-white border-[#D6282F] shadow-md scale-105'
                                : 'bg-white text-[#271B1C] border-gray-300 hover:border-[#D6282F]'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${
                              isSelected ? 'bg-white text-[#D6282F] border-white' : 'border-gray-400 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-[#D6282F] stroke-[3]" />}
                            </div>
                            <span className="font-bold">{pieza}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CREMAS SELECTION (1 OBLIGATORIA) */}
                <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#F2B33D]/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-xs sm:text-sm text-[#271B1C] flex items-center gap-1.5">
                      <span>🥣 Selecciona 1 Crema por plato</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] bg-[#D6282F]/10 text-[#D6282F] font-bold px-2 py-0.5 rounded-full uppercase">
                      Obligatorio
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {cremasOpciones.map((crema) => {
                      const isSelected = selectedCream === crema;
                      return (
                        <button
                          key={crema}
                          type="button"
                          onClick={() => setSelectedCream(crema)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#D6282F] text-white shadow-md scale-105'
                              : 'bg-white text-[#271B1C] border border-gray-300 hover:border-[#D6282F]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{crema}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* INCLUIR CHAUFA GRATIS (SI ES PLATO BROASTER) */}
                {isBroasterDish && (
                  <div className="bg-[#FFFDF8] p-4 rounded-2xl border-2 border-[#F2B33D] space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-xs sm:text-sm text-[#271B1C] flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeChaufaGratis}
                          onChange={(e) => setIncludeChaufaGratis(e.target.checked)}
                          className="w-4 h-4 accent-[#D6282F] rounded cursor-pointer"
                        />
                        <span>🔥 Incluir Chaufa Gratis</span>
                      </label>
                      <span className="text-[10px] bg-[#D6282F] text-white font-anton px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ¡GRATIS!
                      </span>
                    </div>
                    <p className="text-[11px] text-[#271B1C]/75 font-medium pl-6">
                      Arroz chaufa oriental preparado en wok (Promoción válida hasta agotar stock).
                    </p>
                  </div>
                )}

                {/* ADICIONALES (OPCIONALES) */}
                <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#271B1C]/10 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-xs sm:text-sm text-[#271B1C]">
                      🥓 ¿Deseas añadir adicionales?
                    </label>
                    <span className="text-[10px] text-gray-500 font-medium">Opcional</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {adicionalesOpciones.map((add) => {
                      const isChecked = selectedAdditionals.includes(add.nombre);
                      const hasPrice = add.precio > 0 || (add.precioStr !== undefined && add.precioStr.trim() !== '');
                      return (
                        <button
                          key={add.nombre}
                          type="button"
                          onClick={() => toggleAdditional(add.nombre)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                            isChecked
                              ? 'bg-[#F2B33D]/20 border-[#F2B33D] text-[#271B1C]'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                              isChecked ? 'bg-[#D6282F] border-[#D6282F] text-white' : 'border-gray-400 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <span>{add.nombre}</span>
                          </div>
                          {hasPrice && (
                            <span className="text-[#D6282F] font-anton text-[11px]">+S/.{add.precio.toFixed(2)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* OBSERVACIONES */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">
                    📝 Observaciones (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Sin cebolla en las cremas, ají aparte, papas bien crocantes..."
                    value={dishObservation}
                    onChange={(e) => setDishObservation(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#D6282F] bg-white"
                  />
                </div>

                {/* CANTIDAD SELECTOR & TOTAL BUTTON */}
                <div className="pt-2 flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-gray-300 rounded-2xl p-1 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-anton text-base w-8 text-center">{modalQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setModalQuantity(q => q + 1)}
                      className="w-8 h-8 rounded-xl bg-[#D6282F] text-white flex items-center justify-center hover:bg-[#b81e24] transition shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={handleAddToCartFromModal}
                    className="flex-1 bg-[#D6282F] hover:bg-[#b81e24] text-white font-bold py-3 px-4 rounded-2xl transition shadow-lg shadow-[#D6282F]/30 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <span className="flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>Agregar al Pedido</span>
                    </span>
                    <span className="font-anton text-base bg-white/20 px-2.5 py-0.5 rounded-lg">
                      S/.{(calculateDishModalUnitPrice(selectedDish) * modalQuantity).toFixed(2)}
                    </span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING CART BAR */}
      {cartCount > 0 && !showSummary && !showCheckoutModal && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40"
        >
          <button
            onClick={() => setShowSummary(true)}
            className="w-full bg-[#D6282F] hover:bg-[#b81e24] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-[#F2B33D] transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#F2B33D] text-[#271B1C] w-9 h-9 rounded-xl flex items-center justify-center font-anton text-lg shadow-sm">
                {cartCount}
              </div>
              <div className="text-left">
                <p className="font-anton text-sm tracking-wider uppercase text-white/90">Tu Pedido</p>
                <p className="text-xs text-white/80 font-medium">Click para ver detalle</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-anton text-2xl text-[#F2B33D]">
                S/.{calculateTotal().toFixed(2)}
              </span>
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>
        </motion.div>
      )}

      {/* CART OVERLAY / SUMMARY MODAL */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-t-4 border-[#D6282F]"
            >
              {/* Header */}
              <div className="p-4 bg-[#FFFDF8] border-b border-[#271B1C]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#D6282F]" />
                  <h3 className="font-anton text-xl text-[#271B1C] uppercase tracking-wide">
                    Resumen de Pedido
                  </h3>
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 py-8">Tu carrito está vacío.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col bg-[#FFFDF8] p-3 rounded-2xl border border-[#271B1C]/10 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm text-[#271B1C]">{item.nombre}</p>
                          <p className="text-xs text-[#D6282F] font-semibold">
                            S/.{item.precioUnitarioTotal.toFixed(2)} c/u
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-anton text-sm w-5 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#D6282F] text-white flex items-center justify-center hover:bg-[#b81e24]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customization Details Badges */}
                      <div className="bg-white p-2 rounded-xl border border-gray-100 text-[11px] space-y-1">
                        {item.piezaPollo && (
                          <div className="flex items-center gap-1 text-[#271B1C]">
                            <span className="font-bold">🍗 Presa:</span>
                            <span className="bg-[#D6282F]/10 text-[#D6282F] px-2 py-0.5 rounded-md font-semibold">{item.piezaPollo}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-[#271B1C]">
                          <span className="font-bold">🥣 Crema:</span>
                          <span className="bg-[#D6282F]/10 text-[#D6282F] px-2 py-0.5 rounded-md font-semibold">{item.crema}</span>
                        </div>

                        {item.incluyeChaufaGratis && (
                          <div className="flex items-center gap-1 text-[#271B1C]">
                            <span className="font-bold">🎁 Chaufa Gratis:</span>
                            <span className="bg-[#F2B33D]/30 text-[#271B1C] px-2 py-0.5 rounded-md font-bold text-[10px]">
                              ¡Incluido Gratis! 🍗
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-[#271B1C]">
                          <span className="font-bold">🥓 Adicionales:</span>
                          <span>
                            {item.adicionales.length > 0 ? item.adicionales.join(', ') : 'Sin adicionales'}
                          </span>
                        </div>

                        {item.observaciones && (
                          <div className="flex items-center gap-1 text-gray-600 italic">
                            <span className="font-bold not-italic">📝 Obs:</span>
                            <span>{item.observaciones}</span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* Footer Checkout */}
              {cart.length > 0 && (
                <div className="p-4 bg-[#FFFDF8] border-t border-[#271B1C]/10 space-y-3">
                  <div className="flex justify-between items-center text-base font-bold text-[#271B1C]">
                    <span>Total Estimado:</span>
                    <span className="font-anton text-2xl text-[#D6282F]">
                      S/.{calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowSummary(false);
                      setShowCheckoutModal(true);
                    }}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 text-sm transition"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                    <span>Realizar Pedido por WhatsApp</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT FORM MODAL */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-4 border-[#25D366] my-auto max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <span className="text-4xl inline-block mb-1">🛵</span>
                <h3 className="font-anton text-2xl text-[#271B1C]">DATOS DE ENTREGA Y PAGO</h3>
                <p className="text-xs text-gray-600 font-medium">Completa la información para enviar tu pedido por WhatsApp</p>
              </div>

              <form onSubmit={handleConfirmCheckoutAndSendWhatsApp} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                {/* Nombre */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={checkoutData.nombre}
                    onChange={e => setCheckoutData({ ...checkoutData, nombre: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#25D366] bg-white text-xs"
                  />
                </div>

                {/* Ubicación / Referencia */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Dirección o Referencia de Delivery <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required={!checkoutData.gpsLink}
                    placeholder="Ej. Pl. de la Composición 102, dpto 301, frente al parque..."
                    value={checkoutData.direccion}
                    onChange={e => setCheckoutData({ ...checkoutData, direccion: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#25D366] bg-white text-xs"
                  />
                </div>

                {/* Botón GPS Google Maps Mejorado */}
                <div className="bg-blue-50/90 p-3.5 rounded-2xl border border-blue-200 space-y-2.5 shadow-sm">
                  <div className="flex items-start gap-2 text-blue-950 text-xs">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#271B1C]">📍 Enviar mi Ubicación Exacta por GPS</p>
                      <p className="text-[11px] text-gray-600 leading-snug mt-0.5">
                        Al dar clic abajo, se capturará tu ubicación exacta por Google Maps para que el repartidor llegue directo a tu puerta sin perderse.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className={`w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition text-xs shadow ${
                      checkoutData.gpsLink 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-[#1877F2] hover:bg-[#1565c0] text-white active:scale-[0.98]'
                    }`}
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Obteniendo coordenadas GPS exactas...</span>
                      </>
                    ) : checkoutData.gpsLink ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>¡UBICACIÓN GPS CAPTURADA! (Clic para actualizar)</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 text-white animate-bounce" />
                        <span>🎯 Clic aquí para compartir mi ubicación GPS exacta</span>
                      </>
                    )}
                  </button>

                  {checkoutData.gpsLink && (
                    <div className="bg-emerald-100/90 border border-emerald-300 text-emerald-900 rounded-xl p-2.5 text-[11px] font-medium flex items-center justify-between gap-2 shadow-sm">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Ubicación GPS adjunta al pedido
                      </span>
                      <a 
                        href={checkoutData.gpsLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-700 underline font-bold hover:text-blue-900 shrink-0"
                      >
                        Ver enlace GPS ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Método de Pago (Único: Yape) */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 flex items-center justify-between">
                    <span>💳 Método de Pago</span>
                    <span className="text-[10px] bg-[#742284]/10 text-[#742284] font-bold px-2 py-0.5 rounded-full uppercase">
                      Exclusivo Yape
                    </span>
                  </label>

                  <div className="bg-gradient-to-br from-[#742284] to-[#4a1254] text-white p-4 rounded-2xl shadow-md border-2 border-[#00D3B6]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <YapeIcon className="w-10 h-10" />
                        <div>
                          <p className="font-anton text-lg leading-tight tracking-wide text-white">YAPE</p>
                          <p className="text-[11px] text-white/80 font-medium">Transferencia directa</p>
                        </div>
                      </div>
                      <span className="bg-[#00D3B6] text-[#742284] text-[10px] font-anton px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        ✔ SELECCIONADO
                      </span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15 space-y-2">
                      <div className="flex items-start justify-between text-xs gap-2">
                        <span className="text-white/70 font-medium shrink-0">Nombre:</span>
                        <span className="font-bold text-white text-right break-words">{YAPE_HOLDER}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <div>
                          <span className="text-[10px] text-white/70 block uppercase font-bold tracking-wider">Número a Yapear</span>
                          <span className="font-anton text-xl tracking-wider text-[#00D3B6]">{YAPE_NUMBER}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyYapeNumber}
                          className="bg-[#00D3B6] hover:bg-[#00bda3] text-[#742284] font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow active:scale-95 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total display & Submit */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl border">
                    <span className="font-bold text-gray-700">Total a pagar:</span>
                    <span className="font-anton text-2xl text-[#D6282F]">S/.{calculateTotal().toFixed(2)}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-anton text-base py-3.5 rounded-xl shadow-lg shadow-[#25D366]/30 transition flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5 fill-white" />
                    <span>CONFIRMAR Y ENVIAR A WHATSAPP</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BIRTHDAY FORM MODAL */}
      <AnimatePresence>
        {showBirthdayForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-4 border-[#F2B33D]"
            >
              <button
                onClick={() => setShowBirthdayForm(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <span className="text-4xl inline-block mb-1">🎉</span>
                <h3 className="font-anton text-2xl text-[#D6282F]">REGISTRA TU CUMPLEAÑOS</h3>
                <p className="text-xs text-gray-600 font-medium mt-1">
                  {BIRTHDAY_COPY}
                </p>
              </div>

              {birthdaySuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                  <p className="font-anton text-xl text-[#271B1C]">¡REGISTRO EXITOSO!</p>
                  <p className="text-xs text-gray-600">
                    ¡Gracias por registrarte! Te avisaremos para tu cumpleaños con una gran sorpresa crocante 🍗🍟
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBirthdaySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={birthdayData.nombre}
                      onChange={e => setBirthdayData({ ...birthdayData, nombre: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#D6282F]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 987654321"
                      value={birthdayData.telefono}
                      onChange={e => setBirthdayData({ ...birthdayData, telefono: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#D6282F]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      required
                      value={birthdayData.fechaNacimiento}
                      onChange={e => setBirthdayData({ ...birthdayData, fechaNacimiento: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#D6282F]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Distrito</label>
                    <input
                      type="text"
                      placeholder="Ej. Surquillo, Miraflores..."
                      value={birthdayData.distrito}
                      onChange={e => setBirthdayData({ ...birthdayData, distrito: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#D6282F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBirthday}
                    className="w-full bg-[#D6282F] hover:bg-[#b81e24] text-white font-anton text-base py-3 rounded-xl shadow-md transition mt-2 flex items-center justify-center gap-2"
                  >
                    {isSubmittingBirthday ? <Loader2 className="w-4 h-4 animate-spin" /> : '¡REGISTRAR CUMPLEAÑOS! 🎁'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVIEW FORM MODAL */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-2 border-[#D6282F]"
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <span className="text-4xl inline-block mb-1">⭐</span>
                <h3 className="font-anton text-2xl text-[#D6282F]">TU OPINIÓN ES IMPORTANTE</h3>
                <p className="text-xs text-gray-600 font-medium">Ayúdanos a seguir mejorando para ti</p>
              </div>

              {reviewSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                  <p className="font-anton text-xl text-[#271B1C]">¡MUCHAS GRACIAS!</p>
                  <p className="text-xs text-gray-600">Tu opinión nos ayuda a mantener el auténtico sabor crocante de Don Broaster.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Atención y Servicio</label>
                    <div className="flex gap-2 justify-center py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, estrellasMozo: star })}
                          className="p-1"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= reviewData.estrellasMozo
                                ? 'fill-[#F2B33D] text-[#F2B33D]'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Sabor y Calidad de Comida</label>
                    <div className="flex gap-2 justify-center py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, estrellasComida: star })}
                          className="p-1"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= reviewData.estrellasComida
                                ? 'fill-[#F2B33D] text-[#F2B33D]'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Comentario (opcional)</label>
                    <textarea
                      rows={3}
                      placeholder="¡Escribe tu comentario sobre tu experiencia!"
                      value={reviewData.comentario}
                      onChange={e => setReviewData({ ...reviewData, comentario: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:border-[#D6282F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-[#D6282F] hover:bg-[#b81e24] text-white font-anton text-base py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ENVIAR OPINIÓN ⭐'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="mt-16 bg-[#271B1C] text-white pt-10 pb-16 px-4 border-t-4 border-[#D6282F]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow border border-[#F2B33D] overflow-hidden">
                <img 
                  src="/logo.svg" 
                  alt="Don Broaster Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="font-anton text-2xl text-[#F2B33D]">DON BROASTER</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Pollo broaster crocante estilo barrio, salchipapas contundentes y combinaciones abundantes desde 1999.
            </p>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] text-white text-xs font-bold px-3 py-2 rounded-xl shadow hover:bg-[#1565c0] transition"
            >
              <FacebookIcon className="w-4 h-4 fill-white" />
              <span>Síguenos en Facebook</span>
            </a>
          </div>

          <div>
            <h5 className="font-anton text-lg text-[#F2B33D] mb-2 uppercase">Horario de Atención</h5>
            <p className="text-xs text-gray-300">Lunes a Sábado: 6:00 p. m. - 11:00 p. m.</p>
            <p className="text-xs text-gray-400 mt-1">Surquillo, Lima - Perú</p>
          </div>

          <div>
            <h5 className="font-anton text-lg text-[#F2B33D] mb-2 uppercase">Ubicación & Contacto</h5>
            <p className="text-xs text-gray-300 mb-2">📍 {MAPS_LOCATION}</p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-3 py-2 rounded-xl shadow hover:bg-[#20bd5a] transition w-fit"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>WhatsApp: 970 590 336</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Don Broaster. Todos los derechos reservados.</span>
          <span className="font-semibold text-[#F2B33D]">Hecho por Tyma Solutions</span>
        </div>
      </footer>

    </div>
  );
}
