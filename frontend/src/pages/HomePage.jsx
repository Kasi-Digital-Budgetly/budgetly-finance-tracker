import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './HomePage.css'; // Dedicated styling

function HomePage() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    document.title = 'Budgetly - Home';

    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 3600000); // hourly update
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* SVG Background Pattern */}
      <div className="hero-pattern">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#3b82f6"
            fillOpacity="0.06"
            d="M0,224L80,213.3C160,203,320,181,480,165.3C640,149,800,139,960,144C1120,149,1280,171,1360,181.3L1440,192V0H0Z"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="home-page-container relative z-10">
        <h2 className="text-3xl font-semibold mb-3 text-gray-700 dark:text-gray-300 animate-fadeInUp delay-100">
          <span className="animated-greeting">{greeting},</span>{' '}
          <span className="animated-greeting delay-200">
            {isAuthenticated ? user?.username : 'there'}!
          </span>
        </h2>

        <h1 className="hero-title animate-fadeInUp delay-200">
          Your Finances,<br />
          <span className="text-blue-600 dark:text-blue-400">Perfectly Managed.</span>
        </h1>

        <p className="hero-subtext animate-fadeInUp delay-300">
          What do you want to do today?
        </p>

        <div
          className="animate-fadeInUp delay-400"
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {isAuthenticated ? (
            <>
              <Link to="/transactions" className="btn-primary">View Transactions</Link>
              <Link to="/budget" className="btn-primary">Manage Budget</Link>
              <Link to="/analytics" className="btn-primary">See Analytics</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="hero-button">
                Get Started <span role="img" aria-label="Rocket">🚀</span>
              </Link>
              <Link to="/login" className="btn-secondary">Login</Link>
            </>
          )}
        </div>

        <div className="animate-fadeIn delay-500" style={{ marginTop: '3rem' }}>
          <img
            src="/images/finance-illustration.svg"
            alt="Financial Management Illustration"
            className="feature-card"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
