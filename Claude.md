# Mars Base Cargo Control - Frontend Development Guide

## 🚀 Descripción del Proyecto

Sistema de control de carga para base en Marte con monitoreo en tiempo real de recursos críticos (oxígeno, agua, repuestos, comida). Interfaz de vanguardia para operadores de base con alertas instantáneas y solicitudes de reabastecimiento urgente.

**Branding:** PERFICIENT

---

## 📋 Stack Tecnológico

- **Framework:** React 18+ con Vite
- **Lenguaje:** TypeScript
- **UI Components:** ShadcnUI
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Zustand
- **Real-time:** Socket.io Client
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Iconos:** Lucide React
- **Charts:** Recharts (para visualización de datos)

---

## 🏗️ Estructura del Proyecto

```
mars-cargo-frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # ShadcnUI components
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── ResourceCard.tsx
│   │   │   ├── ResourceChart.tsx
│   │   │   ├── AlertPanel.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── inventory/       # Inventory components
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── InventoryFilters.tsx
│   │   │   └── ResourceDetails.tsx
│   │   ├── resupply/        # Resupply components
│   │   │   ├── ResupplyForm.tsx
│   │   │   ├── UrgentRequestButton.tsx
│   │   │   └── RequestHistory.tsx
│   │   └── common/          # Shared components
│   │       ├── StatusBadge.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── ResupplyRequests.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useRealTime.ts
│   │   ├── useResources.ts
│   │   ├── useAlerts.ts
│   │   └── useResupply.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── socket.ts
│   │   └── notifications.ts
│   ├── types/
│   │   ├── resource.types.ts
│   │   ├── alert.types.ts
│   │   └── resupply.types.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── contexts/
│   │   ├── ResourceContext.tsx
│   │   └── AlertContext.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── perficient-logo.svg
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎨 Diseño UI/UX

### Paleta de Colores (Tema Mars)
```css
/* Colores principales */
--mars-red: #C1440E
--mars-orange: #E86A33
--mars-dark: #1A0B0B
--mars-sand: #D4A574

/* Colores de estado */
--critical: #EF4444
--warning: #F59E0B
--success: #10B981
--info: #3B82F6

/* UI Base */
--background: #0A0A0A
--foreground: #FAFAFA
--card: #171717
--border: #262626
```

### Componentes Clave

1. **Dashboard Principal**
   - Grid de 4 tarjetas de recursos principales
   - Gráficos en tiempo real
   - Panel de alertas críticas
   - Botón de acción rápida para reabastecimiento urgente

2. **Resource Cards**
   - Nombre del recurso con icono
   - Nivel actual vs capacidad máxima
   - Barra de progreso con código de colores
   - Indicador de tendencia (subiendo/bajando)
   - Tiempo estimado hasta agotamiento

3. **Alert System**
   - Notificaciones toast para alertas urgentes
   - Panel de alertas activas
   - Sistema de sonido para alertas críticas
   - Historial de alertas

---

## 🔧 Configuración Inicial

### 1. Crear Proyecto
```bash
npm create vite@latest mars-cargo-frontend -- --template react-ts
cd mars-cargo-frontend
npm install
```

### 2. Instalar Dependencias
```bash
# ShadcnUI (requiere configuración inicial)
npx shadcn-ui@latest init

# Dependencias principales
npm install react-router-dom axios socket.io-client
npm install recharts date-fns clsx tailwind-merge
npm install zustand # o usar Context API

# Dependencias de desarrollo
npm install -D @types/node
```

### 3. Configurar ShadcnUI
Agregar componentes necesarios:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add select
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add tabs
```

---

## 📡 Integración en Tiempo Real

### Socket.io Client Setup
```typescript
// src/services/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
```

### Custom Hook para Real-Time
```typescript
// src/hooks/useRealTime.ts
import { useEffect, useState } from 'react';
import { socket } from '@/services/socket';

export const useRealTime = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return { isConnected, socket };
};
```

---

## 📊 Tipos TypeScript

### Tipos de Recursos
```typescript
// src/types/resource.types.ts
export type ResourceType = 'oxygen' | 'water' | 'spare_parts' | 'food';

export interface Resource {
  _id: string;
  type: ResourceType;
  name: string;
  currentLevel: number;
  maxCapacity: number;
  unit: string;
  criticalThreshold: number;
  warningThreshold: number;
  lastUpdated: Date;
  trend?: 'increasing' | 'decreasing' | 'stable';
  estimatedDaysRemaining?: number;
}

export interface ResourceUpdate {
  resourceId: string;
  newLevel: number;
  timestamp: Date;
}
```

### Tipos de Alertas
```typescript
// src/types/alert.types.ts
export type AlertLevel = 'critical' | 'warning' | 'info';

export interface Alert {
  _id: string;
  resourceId: string;
  resourceName: string;
  level: AlertLevel;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}
```

### Tipos de Reabastecimiento
```typescript
// src/types/resupply.types.ts
export interface ResupplyRequest {
  _id: string;
  resourceType: ResourceType;
  quantity: number;
  priority: 'urgent' | 'high' | 'normal';
  status: 'pending' | 'approved' | 'in_transit' | 'delivered' | 'cancelled';
  requestedBy: string;
  requestedAt: Date;
  notes?: string;
  estimatedDelivery?: Date;
}
```

---

## 🎯 Funcionalidades Principales

### 1. Dashboard de Recursos
- Visualización en tiempo real de 4 recursos principales
- Gráficos de tendencias (últimas 24h, 7 días, 30 días)
- Indicadores visuales de estado (crítico, advertencia, normal)
- Actualización automática vía WebSocket

### 2. Sistema de Alertas
- Notificaciones push cuando recursos llegan a niveles críticos
- Panel de alertas activas
- Confirmación de alertas por operador
- Historial de alertas con filtros

### 3. Solicitudes de Reabastecimiento
- Botón de "Reabastecimiento Urgente" con un solo clic
- Formulario completo para solicitudes planificadas
- Seguimiento de estado de solicitudes
- Historial de reabastecimientos

### 4. Monitoreo de Inventario
- Tabla completa de todos los recursos
- Filtros por tipo, estado, nivel
- Detalles expandibles por recurso
- Exportación de datos

---

## 🔔 Sistema de Notificaciones

```typescript
// src/services/notifications.ts
export const showNotification = (
  title: string,
  message: string,
  type: 'success' | 'error' | 'warning' | 'info'
) => {
  // Usar toast de ShadcnUI
  toast({
    title,
    description: message,
    variant: type === 'error' ? 'destructive' : 'default',
  });
};

export const showCriticalAlert = (resourceName: string, level: number) => {
  // Alerta visual + sonido
  const audio = new Audio('/alert-sound.mp3');
  audio.play();
  
  showNotification(
    '🚨 ALERTA CRÍTICA',
    `${resourceName} en nivel crítico: ${level}%`,
    'error'
  );
};
```

---

## 🚀 Ejecución del Proyecto

### Variables de Entorno
```env
# .env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

### Comandos
```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run preview  # Preview de build
```

---

## ✅ Checklist de Implementación

### Fase 1: Setup Base
- [ ] Crear proyecto Vite + React + TypeScript
- [ ] Configurar ShadcnUI y Tailwind
- [ ] Instalar dependencias principales
- [ ] Configurar estructura de carpetas
- [ ] Crear tipos TypeScript básicos

### Fase 2: UI Components
- [ ] Header con logo PERFICIENT
- [ ] Sidebar de navegación
- [ ] Resource Cards con diseño Mars
- [ ] Alert Panel
- [ ] Botón de reabastecimiento urgente
- [ ] Gráficos con Recharts

### Fase 3: Lógica de Negocio
- [ ] Servicio API (axios)
- [ ] Configuración Socket.io
- [ ] Hooks personalizados (useResources, useAlerts)
- [ ] Context/Store para estado global
- [ ] Sistema de notificaciones

### Fase 4: Páginas
- [ ] Dashboard principal
- [ ] Página de inventario
- [ ] Página de solicitudes de reabastecimiento
- [ ] Página de historial
- [ ] Configuración

### Fase 5: Tiempo Real
- [ ] Conexión WebSocket
- [ ] Listeners de eventos de recursos
- [ ] Listeners de alertas
- [ ] Reconexión automática
- [ ] Indicador de estado de conexión

### Fase 6: Pulido
- [ ] Responsive design
- [ ] Animaciones y transiciones
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Optimización de rendimiento

---

## 🎨 Consideraciones de Diseño

1. **Tema Espacial/Mars:**
   - Colores rojos/naranjas para elementos principales
   - Fondo oscuro simulando espacio
   - Iconos de cohetes, planetas, recursos
   - Tipografía moderna y legible

2. **UX Crítico:**
   - Botones grandes para acciones urgentes
   - Alto contraste para alertas críticas
   - Feedback visual inmediato
   - Confirmaciones para acciones importantes

3. **Accesibilidad:**
   - Soporte de teclado
   - Contraste WCAG AA
   - Textos alternativos
   - Focus indicators claros

---

## 📚 Recursos Adicionales

- [ShadcnUI Documentation](https://ui.shadcn.com/)
- [React Router v6](https://reactrouter.com/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
