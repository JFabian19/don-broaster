import Papa from 'papaparse';

// Coloca aquí tu ID de Google Sheets (lo encuentras en la URL de tu hoja de cálculo)
export const SHEET_ID = '14ZzsnBJCOctIBkMBmimOoraHGORjwhQYkCYccs_7Wwk';

export interface SheetDish {
  categoría: string;
  'nombre del plato': string;
  descripción: string;
  precio: string;
  'URL de imagen': string;
  disponible?: string;
}

export interface SheetCategory {
  nombre: string;
}

export interface SheetOption {
  tipo: string; // 'Crema' o 'Adicional' / 'Extra'
  nombre: string;
  precio?: string;
  disponible?: string;
}

// Helper para obtener el valor de una columna ignorando mayúsculas/minúsculas, tildes y espacios
export const getSheetValue = (row: Record<string, any>, keyName: string): string => {
  if (!row || typeof row !== 'object') return '';
  const targetKey = keyName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  
  for (const k of Object.keys(row)) {
    const normK = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (normK === targetKey) {
      const val = row[k];
      return val !== undefined && val !== null ? String(val).trim() : '';
    }
  }
  return '';
};

// Helper robusto para determinar si un registro está disponible (SI, Si, si, ON, On, 1 vs NO, No, no, OFF, Off, 0)
export const isAvailable = (row: Record<string, any>): boolean => {
  const raw = getSheetValue(row, 'disponible');
  if (!raw) return true; // Si está vacía la celda, está DISPONIBLE (true) por defecto
  
  const norm = raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  
  if (norm === 'no' || norm === 'off' || norm === 'false' || norm === '0' || norm === 'desactivado' || norm === 'agotado') {
    return false;
  }
  
  return true;
};

export const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as T[]),
        error: (error: any) => reject(error),
      });
    });
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    return [];
  }
};

// Configura aquí la URL de tu Google Apps Script Web App para poder enviar datos
// Instrucciones: Crea un Apps Script, pega el código que te di, impleméntalo como Aplicación Web y pega la URL de ejecución aquí.
export const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyoa7S8kHID93O13t9zW-t_I2z7AB9hb-qGCcA_Ogz-8AZT2kz_QZEsfYMIOVP4hAZw5g/exec';

export const submitSheetData = async (sheetName: string, data: any): Promise<boolean> => {
  if (!WEB_APP_URL) {
    console.warn('Falta configurar WEB_APP_URL. Simulando envío a:', sheetName, data);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  }

  try {
    const payload = JSON.stringify({
      sheetName,
      data,
    });

    await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });
    
    return true;
  } catch (error) {
    console.error(`Error submitting to sheet ${sheetName}:`, error);
    return false;
  }
};
