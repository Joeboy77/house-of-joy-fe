import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function MainLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <Header />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
} 