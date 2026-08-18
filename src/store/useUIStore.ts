import { create } from 'zustand';
import { getIsMuted, toggleAudioMute } from '../utils/audio';

export type ActiveTab = 
  | 'dashboard'
  | 'inventory'
  | 'orders'
  | 'allocation'
  | 'picking'
  | 'exceptions'
  | 'analytics';

interface UIStore {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Modals & Drawers
  isNewOrderModalOpen: boolean;
  setIsNewOrderModalOpen: (open: boolean) => void;
  
  isReplenishModalOpen: boolean;
  replenishTargetSku: string | null;
  openReplenishModal: (sku: string) => void;
  closeReplenishModal: () => void;

  selectedProductFor3D: string | null;
  setSelectedProductFor3D: (sku: string | null) => void;

  // Audio Mute
  isMuted: boolean;
  toggleMute: () => void;

  // Global Search Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isNewOrderModalOpen: false,
  setIsNewOrderModalOpen: (open) => set({ isNewOrderModalOpen: open }),

  isReplenishModalOpen: false,
  replenishTargetSku: null,
  openReplenishModal: (sku) => set({ isReplenishModalOpen: true, replenishTargetSku: sku }),
  closeReplenishModal: () => set({ isReplenishModalOpen: false, replenishTargetSku: null }),

  selectedProductFor3D: null,
  setSelectedProductFor3D: (sku) => set({ selectedProductFor3D: sku }),

  isMuted: getIsMuted(),
  toggleMute: () => set({ isMuted: toggleAudioMute() }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query })
}));
