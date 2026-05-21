import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import RootApp from './RootApp';
import './styles/index.css';
import { useAuthStore } from './stores/auth.store';
import { useCartStore } from './stores/cart.store';
import { supabase } from './lib/supabase';

const client = new QueryClient();

void useAuthStore.getState().init();
useCartStore.getState().hydrate();

supabase.auth.onAuthStateChange(async () => {
  await useAuthStore.getState().fetchProfile();
  const user = useAuthStore.getState().user;
  if (user) {
    await useCartStore.getState().mergeOnLogin();
    await useCartStore.getState().syncFromDb();
  } else {
    useCartStore.getState().hydrate();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <RootApp />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
