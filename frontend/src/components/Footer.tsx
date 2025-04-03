import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contáctanos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center sm:justify-start">
                <Phone className="h-5 w-5 mr-2" />
                <span>+57 (300) 123-4567</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Mail className="h-5 w-5 mr-2" />
                <span>contacto@veterinaria.com</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Laureles, Medellín, Colombia</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>Chequeo general</li>
              <li>Atención de emergencia</li>
              <li>Vacunación</li>
              <li>Exámenes</li>
              <li>Citas</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Horas de trabajo</h3>
            <ul className="space-y-2">
              <li>Lunes - Viernes: 9:00 AM - 7:00 PM</li>
              <li>Sábados: 10:00 AM - 5:00 PM</li>
              <li>Domingos: Solo atención de emergencias</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-10 border-t border-primary-700 text-center">
          <p>
            &copy; {new Date().getFullYear()} Veterinaria. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
