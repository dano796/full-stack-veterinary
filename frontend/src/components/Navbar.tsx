import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dog, Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ver el estado de autenticación al cargar el componente
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/me`,
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          setIsAuthenticated(true);
          setUserName(response.data.name || "Usuario");
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserName("");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
        {},
        { withCredentials: true }
      );

      setIsAuthenticated(false);
      setUserName("");
      setProfileMenuOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuOpen &&
        event.target instanceof Element &&
        !event.target.closest(".profile-menu-container")
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <nav className="bg-white shadow-lg border-b border-primary-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Dog className="h-8 w-8 text-primary-600" />
              <span className="ml-3 text-xl font-semibold text-primary-800">
                Veterinaria
              </span>
            </Link>
          </div>

          {/* Escritorio */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-[18px] font-semibold"
            >
              Inicio
            </Link>

            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-[18px] font-semibold"
            >
              Contacto
            </Link>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/pets"
                      className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-[18px] font-semibold"
                    >
                      Mis Mascotas
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/appointments")}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-[18px] font-semibold hover:bg-primary-700"
                    >
                      Mis Citas
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/exams")}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-[18px] font-semibold hover:bg-primary-700"
                    >
                      Mis Exámenes
                    </motion.button>
                    <div className="relative profile-menu-container">
                      <button
                        onClick={toggleProfileMenu}
                        className="flex items-center text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-[18px] font-semibold"
                      >
                        <User className="h-5 w-5 mr-2" />
                        <span>{userName}</span>
                        <ChevronDown
                          className={`h-4 w-4 ml-1 transition-transform ${
                            profileMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {profileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Cerrar Sesión
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-[18px] font-semibold"
                    >
                      Iniciar Sesión
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/appointments/add")}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-[18px] font-semibold hover:bg-primary-700"
                    >
                      Agendar cita
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/exams/add")}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-[18px] font-semibold hover:bg-primary-700"
                    >
                      Agendar examen
                    </motion.button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Botón para acceder al menú en móviles */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-600 hover:text-primary-800 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú en móviles */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
            >
              Inicio
            </Link>

            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
            >
              Contacto
            </Link>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/pets"
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
                    >
                      Mis Mascotas
                    </Link>
                    <Link
                      to="/appointments"
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
                    >
                      Mis Citas
                    </Link>
                    <Link
                      to="/exams"
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
                    >
                      Mis Exámenes
                    </Link>
                    <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-2">
                      <div className="flex items-center text-base font-medium text-primary-600 mb-2">
                        <User className="h-5 w-5 mr-2" />
                        <span>{userName}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left py-2 text-base font-medium text-red-600 hover:text-red-800"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/appointments/add"
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
                    >
                      Agendar cita
                    </Link>
                    <Link
                      to="/exams/add"
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-800"
                    >
                      Agendar examen
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
