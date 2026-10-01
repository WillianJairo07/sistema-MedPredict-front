import AppRouter from './routes/AppRouter';
import { PacientesProvider } from './context/PacientesContext';

export default function App() {
  return (
    <PacientesProvider>
      <AppRouter />
    </PacientesProvider>
  );
}