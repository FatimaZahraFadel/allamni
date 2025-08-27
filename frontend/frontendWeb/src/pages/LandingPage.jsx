import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Remove automatic redirect - let users navigate manually
  // useEffect(() => {
  //   // Redirect authenticated users to their dashboard
  //   if (isAuthenticated && user && !isLoading) {
  //     if (user.role === 'student') {
  //       window.location.href = '/student';
  //     } else if (user.role === 'teacher') {
  //       window.location.href = '/teacher';
  //     }
  //   }
  // }, [isAuthenticated, user, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
