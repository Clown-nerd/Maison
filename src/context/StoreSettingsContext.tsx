import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  catalogueRepository,
  DEFAULT_STORE_SETTINGS,
} from '../services/catalogueRepository';
import type { Category, StoreSettings } from '../types/furniture';

interface StoreSettingsContextValue {
  settings: StoreSettings;
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  source: 'sample-demo' | 'supabase';
  reload: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue>({
  settings: DEFAULT_STORE_SETTINGS,
  categories: [],
  isLoading: false,
  error: null,
  source: catalogueRepository.source,
  reload: () => {},
});

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const reload = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    Promise.all([
      catalogueRepository.getStoreSettings(),
      catalogueRepository.getCategories(),
    ])
      .then(([loadedSettings, loadedCategories]) => {
        if (!active) return;
        setSettings(loadedSettings);
        setCategories(loadedCategories);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to connect to the showroom database.';
        setError(message);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadTick]);

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        categories,
        isLoading,
        error,
        source: catalogueRepository.source,
        reload,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings(): StoreSettingsContextValue {
  return useContext(StoreSettingsContext);
}
