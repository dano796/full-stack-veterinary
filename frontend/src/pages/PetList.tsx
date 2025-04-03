import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface Pet {
  pet_id: number;
  name: string;
  species: string;
  breed: string;
  age?: number;
  weight?: number;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  petName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  petName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold">Eliminar mascota</h2>
        </div>
        <p className="mb-6">
          ¿Estás seguro que deseas eliminar a{" "}
          <span className="font-bold">{petName}</span>? Esta acción no se puede
          deshacer.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const PetsList = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("No se encontró el ID del usuario. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Pet[]>(
          `http://localhost:3000/pets/user/${userId}`,
          { withCredentials: true }
        );
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError(
          "Error al cargar tus mascotas. Por favor, intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleEdit = (petId: number) => {
    navigate(`/pets/edit/${petId}`);
  };

  const handleDeleteClick = (pet: Pet) => {
    setPetToDelete(pet);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!petToDelete) return;

    try {
      await axios.delete(`http://localhost:3000/pets/${petToDelete.pet_id}`, {
        withCredentials: true,
      });

      setPets(pets.filter((pet) => pet.pet_id !== petToDelete.pet_id));
      setSuccessMessage(`${petToDelete.name} ha sido eliminado correctamente`);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting pet:", error);
      setError("Error al eliminar la mascota. Por favor, intenta nuevamente.");
    } finally {
      setDeleteModalOpen(false);
      setPetToDelete(null);
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
    <div className="container mx-auto px-8 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-800">Mis Mascotas</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/pets/add")}
          className="bg-primary-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-700 flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Agregar Mascota
        </motion.button>
      </div>

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

      {pets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            No tienes mascotas registradas
          </h2>
          <p className="text-gray-500 mb-6">
            Registra tu primera mascota para gestionar su información y citas
            médicas
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/pets/add")}
            className="bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 inline-flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Agregar Mascota
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.pet_id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <h2 className="text-xl font-bold text-primary-800 mb-2">
                {pet.name}
              </h2>
              <div className="text-gray-600 space-y-1 mb-4">
                <p>
                  <span className="font-medium">Especie:</span> {pet.species}
                </p>
                <p>
                  <span className="font-medium">Raza:</span> {pet.breed}
                </p>
                {pet.age && (
                  <p>
                    <span className="font-medium">Edad:</span> {pet.age} años
                  </p>
                )}
                {pet.weight && (
                  <p>
                    <span className="font-medium">Peso:</span> {pet.weight} kg
                  </p>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(pet.pet_id)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center justify-center"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Editar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteClick(pet)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md font-medium hover:bg-red-700 flex items-center justify-center"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Eliminar
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        petName={petToDelete?.name || ""}
      />
    </div>
  );
};

export default PetsList;
