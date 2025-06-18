import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../features/auth/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';
import { FiHome, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { HiOutlineClipboardList, HiOutlineLogin, HiOutlineUserAdd } from 'react-icons/hi';
import { MdAnalytics } from 'react-icons/md';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const logout = () => dispatch(logoutAction());

  const handleLogout = (e, closeFn = () => {}) => {
    const icon = e.currentTarget.querySelector('.icon');
    if (icon) {
      icon.classList.add('spin');
      setTimeout(() => {
        icon.classList.remove('spin');
        logout();
        closeFn();
      }, 600);
    } else {
      logout();
      closeFn();
    }
  };

  return (
    <>
      <button
        className="navbar__burger-fixed"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? (
          <HiX className="icon" size={26} />
        ) : (
          <HiMenu className="icon" size={26} />
        )}
      </button>

        
      <nav className="navbar">
        <div className="navbar__container">
          <NavLink to="/" className="navbar__logo">Budgetly</NavLink>
          <ul className="navbar__links desktop-only">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/">
                    <FiHome className="icon" /> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/transactions">
                    <HiOutlineClipboardList className="icon" /> Transactions
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/budget">
                    <FiDollarSign className="icon" /> Budget
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/analytics">
                    <MdAnalytics className="icon" /> Analytics
                  </NavLink>
                </li>
                <li><span className="navbar__welcome">Hi, {user?.user?.username}</span></li>

                <li>
                  <button
                    className="navbar__btn"
                    onClick={(e) => handleLogout(e)}
                  >
                    <FiLogOut className="icon" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login">
                    <HiOutlineLogin className="icon" /> Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register">
                    <HiOutlineUserAdd className="icon" /> Register
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <button
                className="navbar__btn theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <BsFillMoonFill className="icon" />
                ) : (
                  <BsFillSunFill className="icon" />
                )}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar__close" onClick={closeSidebar}>×</button>
        <ul className="sidebar__links">
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/" onClick={closeSidebar}>
                  <FiHome className="icon" /> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/transactions" onClick={closeSidebar}>
                  <HiOutlineClipboardList className="icon" /> Transactions
                </NavLink>
              </li>
              <li>
                <NavLink to="/budget" onClick={closeSidebar}>
                  <FiDollarSign className="icon" /> Budget
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" onClick={closeSidebar}>
                  <MdAnalytics className="icon" /> Analytics
                </NavLink>
              </li>
              <li className="sidebar__welcome">Hi, {user?.user?.username}</li>git push heroku main

              <li>
                <button
                  className="navbar__btn"
                  onClick={(e) => handleLogout(e, closeSidebar)}
                >
                  <FiLogOut className="icon" /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={closeSidebar}>
                  <HiOutlineLogin className="icon" /> Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={closeSidebar}>
                  <HiOutlineUserAdd className="icon" /> Register
                </NavLink>
              </li>
            </>
          )}
          <li>
            <button
              className="navbar__btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <BsFillMoonFill className="icon" />
              ) : (
                <BsFillSunFill className="icon" />
              )}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Navbar;
