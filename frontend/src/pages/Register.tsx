import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/me`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.user_id) {
          localStorage.setItem("userId", response.data.user_id);
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.warn("Usuario no autenticado");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!name || !email || !password || !phoneNumber || !address) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      console.log(
        "Registering at:",
        `${import.meta.env.VITE_BACKEND_URL}/users/register`
      );
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/register`,
        {
          name,
          email,
          password,
          phoneNumber,
          address,
        }
      );

      alert(response.data.message || "Registro exitoso.");
      setName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setAddress("");
      navigate("/login", { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const errorMessage =
        axiosError.response?.data?.error || "Ocurrió un error al registrarse.";
      setError(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 bg-primary-50"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-primary-800 text-center mt-2 mb-8"
        >
          Crear Cuenta
        </motion.h2>
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleRegister}
          className="space-y-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
              required
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-1"
            >
              Correo
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
              required
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
              required
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label
              htmlFor="phoneNumber"
              className="block font-medium text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
              required
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label
              htmlFor="address"
              className="block font-medium text-gray-700 mb-1"
            >
              Dirección
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
              required
            />
          </motion.div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.4 }}
              type="submit"
              className="w-full mt-1 bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700"
            >
              Crear Cuenta
            </motion.button>
          </motion.div>
        </motion.form>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
