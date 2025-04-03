import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, AlertCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface Appointment {
  appointment_id: number;
  user_id: number;
  pet_id: number;
  pet_name?: string;
  date: string;
  status: string;
  payment_method?: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointmentDate: string;
  petName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentDate,
  petName,
}) => {
  if (!isOpen) return null;

  const formattedDate = new Date(appointmentDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold">Eliminar cita</h2>
        </div>
        <p className="mb-6">
          ¿Estás seguro que deseas eliminar la cita del{" "}
          <span className="font-bold">{formattedDate}</span>
          {petName && (
            <span>
              {" "}
              para <span className="font-bold">{petName}</span>
            </span>
          )}
          ? Esta acción no se puede deshacer.
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

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("No se encontró el ID del usuario. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Appointment[]>(
          `http://localhost:3000/appointments/user/${userId}`,
          { withCredentials: true }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Error al cargar tus citas. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/appointments/${appointmentToDelete.appointment_id}`,
        {
          withCredentials: true,
        }
      );

      // Actualizar la lista de citas
      setAppointments(
        appointments.filter(
          (apt) => apt.appointment_id !== appointmentToDelete.appointment_id
        )
      );
      setSuccessMessage(
        `La cita del ${new Date(appointmentToDelete.date).toLocaleDateString(
          "es-ES"
        )} ha sido eliminada correctamente`
      );

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Error al eliminar la cita. Por favor, intenta nuevamente.");
    } finally {
      setDeleteModalOpen(false);
      setAppointmentToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    let badgeColor = "";
    let statusText = "";

    switch (status.toLowerCase()) {
      case "scheduled":
        badgeColor = "bg-blue-100 text-blue-800";
        statusText = "Programada";
        break;
      case "completed":
        badgeColor = "bg-green-100 text-green-800";
        statusText = "Completada";
        break;
      case "canceled":
        badgeColor = "bg-red-100 text-red-800";
        statusText = "Cancelada";
        break;
      default:
        badgeColor = "bg-gray-100 text-gray-800";
        statusText = status;
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}
      >
        {statusText}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-[calc(100vh-400px)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-800 ml-2">Mis Citas</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/appointments/add")}
          className="bg-primary-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-700 flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Agendar Cita
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

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg mb-3">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            No tienes citas programadas
          </h2>
          <p className="text-gray-500 mb-6">
            Agenda tu primera cita para tu mascota
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/appointments/add")}
            className="bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 inline-flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Agendar Cita
          </motion.button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mascota
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Forma de pago
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => {
                  const formattedDate = new Date(
                    appointment.date
                  ).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={appointment.appointment_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.pet_name ||
                          `Mascota #${appointment.pet_id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.payment_method
                          ? appointment.payment_method.charAt(0).toUpperCase() +
                            appointment.payment_method.slice(1)
                          : "No especificado"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(appointment)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        appointmentDate={appointmentToDelete?.date || ""}
        petName={appointmentToDelete?.pet_name}
      />
    </div>
  );
};

export default AppointmentsList;
