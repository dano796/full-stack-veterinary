import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const PetRegistration = () => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user_id, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const speciesList = [
    { id: "dog", name: "Perro" },
    { id: "cat", name: "Gato" },
    { id: "bird", name: "Ave" },
    { id: "rabbit", name: "Conejo" },
    { id: "hamster", name: "Hámster" },
    { id: "fish", name: "Pez" },
    { id: "turtle", name: "Tortuga" },
    { id: "other", name: "Otro" },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/me`,
          {
            withCredentials: true,
          }
        );

        setUserId(response.data.user_id);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);

        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !species || !breed) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      setIsLoading(true);

      const petData = {
        user_id: user_id,
        name,
        species,
        breed,
        age: age === "" ? null : Number(age),
        weight: weight === "" ? null : Number(weight),
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/pets`, petData, {
        withCredentials: true,
      });

      setIsLoading(false);
      setSuccess(true);

      setName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setWeight("");

      setTimeout(() => {
        navigate("/pets", { replace: true });
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      const axiosError = err as AxiosError<{
        error?: string;
        message?: string;
        errors?: string[];
      }>;
      const errorData = axiosError.response?.data;
      let errorMessage = "Ocurrió un error al registrar la mascota.";

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.join(", ");
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }

      setError(errorMessage);
    }
  };

  const handleNumberChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number | "">>
  ) => {
    if (value === "") {
      setter("");
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setter(num);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-primary-50 py-12 px-4"
    >
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-primary-800 text-center mb-8">
          Registrar Mascota
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Cargando...</p>
          </div>
        ) : success ? (
          <div className="text-center py-8">
            <p className="text-green-600 font-medium">
              ¡Mascota registrada exitosamente!
            </p>
            <p className="text-gray-600 mt-2">Redireccionando...</p>
          </div>
        ) : (
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
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
                Nombre <span className="text-red-500">*</span>
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
                htmlFor="species"
                className="block font-medium text-gray-700 mb-1"
              >
                Especie <span className="text-red-500">*</span>
              </label>
              <select
                id="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
                required
              >
                <option value="">Selecciona una especie</option>
                {speciesList.map((speciesOption) => (
                  <option key={speciesOption.id} value={speciesOption.name}>
                    {speciesOption.name}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="breed"
                className="block font-medium text-gray-700 mb-1"
              >
                Raza <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
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
                htmlFor="age"
                className="block font-medium text-gray-700 mb-1"
              >
                Edad (años)
              </label>
              <input
                type="number"
                id="age"
                min="0"
                step="1"
                value={age}
                onChange={(e) => handleNumberChange(e.target.value, setAge)}
                className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label
                htmlFor="weight"
                className="block font-medium text-gray-700 mb-1"
              >
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => handleNumberChange(e.target.value, setWeight)}
                className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
              />
            </motion.div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-400"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-1/2 bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700"
              >
                Registrar Mascota
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};

export default PetRegistration;
