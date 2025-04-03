import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ExamScheduler = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [examType, setExamType] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const examTypes = [
    { id: "blood", name: "Análisis de sangre", price: 75.0 },
    { id: "urine", name: "Análisis de orina", price: 60.0 },
    { id: "xray", name: "Radiografía", price: 120.0 },
    { id: "ultrasound", name: "Ecografía", price: 150.0 },
    { id: "dental", name: "Examen dental", price: 90.0 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/me`,
          {
            withCredentials: true,
          }
        );

        setUserId(userResponse.data.user_id);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/pets/user/${
            userResponse.data.user_id
          }`,
          {
            withCredentials: true,
          }
        );

        setPets(response.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (examType) {
      const selectedExam = examTypes.find((exam) => exam.id === examType);
      if (selectedExam) {
        setAmount(selectedExam.price);
      }
    } else {
      setAmount(0);
    }
  }, [examType]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedPet || !examType || !date) {
        setError("Por favor, completa todos los campos obligatorios.");
        return;
      }
      setError(null);
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
    setError(null);
  };

  const handleScheduleExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!paymentMethod) {
      setError("Por favor, selecciona un método de pago.");
      return;
    }

    try {
      setIsLoading(true);

      const examName =
        examTypes.find((exam) => exam.id === examType)?.name || examType;

      // Crear el examen
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/exams/`,
        {
          pet_id: parseInt(selectedPet),
          exam_type: examName,
          date,
          status,
          payment_method: paymentMethod,
        },
        {
          withCredentials: true,
        }
      );

      // Simular el pago
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payments/`,
        {
          user_id: userId,
          amount,
        },
        {
          withCredentials: true,
        }
      );

      setIsLoading(false);
      alert("Examen agendado y pago procesado exitosamente.");
      navigate("/exams", { replace: true });
    } catch (err) {
      setIsLoading(false);
      const axiosError = err as AxiosError<{
        error?: string;
        message?: string;
      }>;
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        "Ocurrió un error al agendar el examen.";
      setError(errorMessage);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-primary-50 py-12 px-4"
    >
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-primary-800 text-center mb-8">
          {step === 1 ? "Agendar Examen" : "Proceso de Pago"}
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Cargando...</p>
          </div>
        ) : (
          <>
            {step === 1 ? (
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    htmlFor="pet"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Mascota
                  </label>
                  <select
                    id="pet"
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
                    required
                  >
                    <option value="">Selecciona una mascota</option>
                    {pets.map((pet) => (
                      <option key={pet.pet_id} value={pet.pet_id}>
                        {pet.name} ({pet.species} - {pet.breed})
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="examType"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Tipo de examen
                  </label>
                  <select
                    id="examType"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
                    required
                  >
                    <option value="">Selecciona un tipo de examen</option>
                    {examTypes.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.name} (${exam.price.toFixed(2)})
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
                    htmlFor="date"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Fecha
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
                    required
                  />
                </motion.div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleNextStep}
                    className="w-full mt-1 bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700"
                  >
                    Continuar al pago
                  </motion.button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleScheduleExam}
                className="space-y-6"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Resumen del examen
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-2">
                      <span className="font-medium">Mascota:</span>{" "}
                      {
                        pets.find(
                          (pet) => pet.pet_id.toString() === selectedPet
                        )?.name
                      }
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Tipo de examen:</span>{" "}
                      {examTypes.find((exam) => exam.id === examType)?.name}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Fecha:</span>{" "}
                      {new Date(date).toLocaleDateString()}
                    </p>
                    <p className="mb-4">
                      <span className="font-medium">Costo:</span> $
                      {amount.toFixed(2)}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="paymentMethod"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Método de pago
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
                    required
                  >
                    <option value="">Selecciona un método de pago</option>
                    <option value="credit">Tarjeta de crédito</option>
                    <option value="debit">Tarjeta de débito</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </motion.div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handlePreviousStep}
                    className="w-1/2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-400"
                  >
                    Volver
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-1/2 bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700"
                  >
                    Confirmar y pagar
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ExamScheduler;
