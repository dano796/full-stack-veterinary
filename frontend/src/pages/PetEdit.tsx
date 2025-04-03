import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";

interface Pet {
  pet_id: number;
  user_id: number;
  name: string;
  species: string;
  breed: string;
  age?: number | null;
  weight?: number | null;
}

const PetEdit = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Pet, "pet_id">>({
    user_id: 0,
    name: "",
    species: "",
    breed: "",
    age: null,
    weight: null,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    const fetchPet = async () => {
      if (!petId) return;

      try {
        setLoading(true);
        const response = await axios.get<Pet>(
          `${import.meta.env.VITE_BACKEND_URL}/pets/${petId}`,
          { withCredentials: true }
        );

        setFormData({
          user_id: response.data.user_id,
          name: response.data.name,
          species: response.data.species,
          breed: response.data.breed,
          age: response.data.age === undefined ? null : response.data.age,
          weight:
            response.data.weight === undefined ? null : response.data.weight,
        });
      } catch (error) {
        console.error("Error fetching pet details:", error);
        setError(
          "Error al cargar los datos de la mascota. Por favor, intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (value: string, field: "age" | "weight") => {
    if (value === "") {
      setFormData({
        ...formData,
        [field]: null,
      });
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setFormData({
          ...formData,
          [field]: field === "age" ? Math.floor(num) : num,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petId) return;

    if (!formData.name || !formData.species || !formData.breed) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const petData = {
        user_id: formData.user_id,
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age === null ? null : formData.age,
        weight: formData.weight == null ? null : formData.weight,
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/pets/${petId}`,
        petData,
        { withCredentials: true }
      );

      setSuccessMessage("Mascota actualizada correctamente");

      setTimeout(() => {
        navigate("/pets");
      }, 1500);
    } catch (err) {
      console.error("Error updating pet:", err);
      const axiosError = err as AxiosError<{
        error?: string;
        message?: string;
        errors?: string[];
      }>;
      const errorData = axiosError.response?.data;
      let errorMessage =
        "Error al actualizar la mascota. Por favor, verifica los datos e intenta nuevamente.";

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.join(", ");
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-primary-50 py-12 px-4"
    >
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-primary-800 text-center mb-6">
          Editar Mascota
        </h2>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/pets")}
          className="flex items-center text-primary-700 mb-6 font-medium hover:text-primary-900"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Volver a mis mascotas
        </motion.button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            {successMessage}
          </div>
        )}

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
              name="name"
              value={formData.name}
              onChange={handleTextChange}
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
              name="species"
              value={formData.species}
              onChange={handleTextChange}
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
              name="breed"
              value={formData.breed}
              onChange={handleTextChange}
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
              name="age"
              min="0"
              step="1"
              value={formData.age === null ? "" : formData.age}
              onChange={(e) => handleNumberChange(e.target.value, "age")}
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
              name="weight"
              min="0"
              step="0.1"
              value={formData.weight === null ? "" : formData.weight}
              onChange={(e) => handleNumberChange(e.target.value, "weight")}
              className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex space-x-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate("/pets")}
              className="w-1/2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-400"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting}
              className={`w-1/2 bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                "Guardar Cambios"
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default PetEdit;
