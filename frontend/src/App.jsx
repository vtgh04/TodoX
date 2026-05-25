import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';


function App() {

  return (
    <>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path='/' 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/login' 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
