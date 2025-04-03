import { motion } from "framer-motion";
import { Heart, Clock, Home as HomeIcon, Star } from "lucide-react";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3450&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-primary-900 bg-opacity-60"></div>
        </div>
        <div className="relative mx-auto px-8 sm:px-6 lg:px-16 h-full flex items-center">
          <div className="text-white">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4"
            >
              Veterinaria Profesional
              <br />
              Atención a domicilio
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8"
            >
              Atención de emergencia, vacunación, citas y exámenes.
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/appointments")}
              className="bg-primary-600 text-white px-8 py-3 font-semibold rounded-md text-lg hover:bg-primary-700"
            >
              Agendar una cita
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-16">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-14">
            ¿Por qué escogernos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: HomeIcon,
                title: "Atención a domicilio",
                description: "Cuidado de tus mascotas a unos pasos",
              },
              {
                icon: Heart,
                title: "Cuidado profesional",
                description: "Vererinarios expertos y profesionales",
              },
              {
                icon: Clock,
                title: "Servicio 24/7",
                description: "Cuidado de emergencia a tu disposición",
              },
              {
                icon: Star,
                title: "Servicio de calidad",
                description: "Miles de dueños confían en nosotros",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-primary-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-16">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-12">
            Nuestros servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Chequeo general",
                description: "Examinación general de tu mascota",
                image:
                  "https://plus.unsplash.com/premium_photo-1663013590728-33f48c9f6615?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2850&q=80",
              },
              {
                title: "Vacunación",
                description: "Mantén a tus mascotas protegidas de enfermedades",
                image:
                  "https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
              },
              {
                title: "Exámenes",
                description:
                  "Exames de sangre, orina y otros para diagnosticar",
                image:
                  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index }}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
