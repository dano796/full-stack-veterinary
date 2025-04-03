import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Trash2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface Exam {
  exam_id: number;
  pet_id: number;
  pet_name?: string;
  exam_type: string;
  date: string;
  result?: string;
  status: string;
  payment_method?: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  examType: string;
  examDate: string;
  petName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  examType,
  examDate,
  petName,
}) => {
  if (!isOpen) return null;

  const formattedDate = new Date(examDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold">Eliminar examen</h2>
        </div>
        <p className="mb-6">
          ¿Estás seguro que deseas eliminar el examen de{" "}
          <span className="font-bold">{examType}</span> programado para el{" "}
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

const ExamsList = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("No se encontró el ID del usuario. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Exam[]>(
          `http://localhost:3000/exams/user/${userId}`,
          { withCredentials: true }
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError(
          "Error al cargar tus exámenes. Por favor, intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/exams/${examToDelete.exam_id}`,
        {
          withCredentials: true,
        }
      );

      setExams(exams.filter((ex) => ex.exam_id !== examToDelete.exam_id));
      setSuccessMessage(
        `El examen de ${examToDelete.exam_type} ha sido eliminado correctamente`
      );

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting exam:", error);
      setError("Error al eliminar el examen. Por favor, intenta nuevamente.");
    } finally {
      setDeleteModalOpen(false);
      setExamToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    let badgeColor = "";
    let statusText = "";

    switch (status.toLowerCase()) {
      case "scheduled":
        badgeColor = "bg-blue-100 text-blue-800";
        statusText = "Programado";
        break;
      case "completed":
        badgeColor = "bg-green-100 text-green-800";
        statusText = "Completado";
        break;
      case "canceled":
        badgeColor = "bg-red-100 text-red-800";
        statusText = "Cancelado";
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

  const getResultBadge = (result?: string) => {
    if (!result) return <span className="text-gray-500">Pendiente</span>;

    let badgeColor = "";

    switch (result.toLowerCase()) {
      case "normal":
        badgeColor = "bg-green-100 text-green-800";
        break;
      case "abnormal":
        badgeColor = "bg-yellow-100 text-yellow-800";
        break;
      case "critical":
        badgeColor = "bg-red-100 text-red-800";
        break;
      default:
        badgeColor = "bg-gray-100 text-gray-800";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}
      >
        {result}
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8 flex flex-col min-h-[calc(100vh-400px)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold ml-2 text-primary-800">
          Mis Exámenes
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/exams/add")}
          className="bg-primary-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-700 flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Agendar Examen
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

      {exams.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg mb-3">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            No tienes exámenes programados
          </h2>
          <p className="text-gray-500 mb-6">
            Agenda tu primer examen para tu mascota
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/exams/add")}
            className="bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 inline-flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Agendar Examen
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
                    Tipo
                  </th>
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
                    Resultado
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
                {exams.map((exam) => {
                  const formattedDate = new Date(exam.date).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  );

                  return (
                    <tr key={exam.exam_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-primary-600 mr-2" />
                          <span>{exam.exam_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {exam.pet_name || `Mascota #${exam.pet_id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(exam.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getResultBadge(exam.result)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {exam.payment_method
                          ? exam.payment_method.charAt(0).toUpperCase() +
                            exam.payment_method.slice(1)
                          : "No especificado"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(exam)}
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
        examType={examToDelete?.exam_type || ""}
        examDate={examToDelete?.date || ""}
        petName={examToDelete?.pet_name}
      />
    </div>
  );
};

export default ExamsList;
