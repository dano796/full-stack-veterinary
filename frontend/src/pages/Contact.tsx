import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface ContactCardProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  delay: number;
}

const ContactCard: React.FC<ContactCardProps> = ({
  Icon,
  title,
  detail,
  delay,
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    className="text-center"
  >
    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-semibold mb-1 text-primary-800">{title}</h3>
    <p className="text-gray-600">{detail}</p>
  </motion.div>
);

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "textarea";
  placeholder: string;
  rows?: number;
  delay: number;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  rows,
  delay,
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
  >
    <label htmlFor={id} className="block font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        rows={rows}
        className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        id={id}
        className="w-full p-2 border border-primary-500 rounded-lg text-gray-800 focus:outline-0 focus:border-0 focus:ring-2 focus:border-primary-800"
        placeholder={placeholder}
      />
    )}
  </motion.div>
);

const ContactPage: React.FC = () => {
  const contactInfo = [
    { Icon: Mail, title: "Correo", detail: "contacto@veterinaria.com" },
    { Icon: Phone, title: "Teléfono", detail: "+57 (301) 234-5678" },
    { Icon: MapPin, title: "Ubicación", detail: "Medellín, Colombia" },
  ];

  return (
    <div className="container mx-auto px-6 py-16 bg-white text-gray-900">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-8 pb-5 text-center text-primary-800"
        >
          Contáctanos
        </motion.h1>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <ContactCard
              key={index}
              Icon={info.Icon}
              title={info.title}
              detail={info.detail}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-100 rounded-xl p-8 shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-primary-800">
            Envíanos un mensaje
          </h2>

          <motion.form className="space-y-6">
            <FormField
              id="name"
              label="Nombre"
              placeholder="Nombre"
              delay={0.6}
            />
            <FormField
              id="email"
              label="Correo"
              type="email"
              placeholder="Correo"
              delay={0.7}
            />
            <FormField
              id="message"
              label="Mensaje"
              type="textarea"
              rows={4}
              placeholder="¿En qué podemos ayudarte?"
              delay={0.8}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full mt-1 bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700"
              >
                Enviar Mensaje
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
