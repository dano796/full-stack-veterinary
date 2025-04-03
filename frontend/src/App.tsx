import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/LogIn";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Appointment from "./pages/AppointmentScheduler";
import Exam from "./pages/ExamScheduler";
import Pet from "./pages/PetRegistration";
import PetList from "./pages/PetList";
import UpdatePet from "./pages/PetEdit";
import ExamsList from "./pages/ExamList";
import AppointmentsList from "./pages/AppointmentList";

function App() {
  return (
    <Router>
      <div className="h-screen bg-primary-50">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointments/add" element={<Appointment />} />
            <Route path="/exams/add" element={<Exam />} />
            <Route path="/pets/add" element={<Pet />} />
            <Route path="/pets" element={<PetList />} />
            <Route path="/pets/edit/:petId" element={<UpdatePet />} />
            <Route path="/exams" element={<ExamsList />} />
            <Route path="/appointments" element={<AppointmentsList />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
