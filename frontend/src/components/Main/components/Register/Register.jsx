import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../../blocks/register.css";

export default function Register({ onRegister, infoToolTip, setInfoToolTip }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setInfoToolTip({
        open: true,
        success: false,
        message: "Por favor, completa todos los campos.",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      await onRegister(formData.email, formData.password);
    } catch (err) {
      setInfoToolTip({
        open: true,
        success: false,
        message: err.message || "Error al registrarse. Intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register">
      <form
        className="register__form"
        name="register-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <h2 className="register__title">Regístrate</h2>
        <input
          className="register__input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          className="register__input"
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button
          type="submit"
          className="register__submit-button"
          disabled={!formData.email || !formData.password || isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Regístrate"}
        </button>
      </form>
      <div className="register__redirect-container">
        <p className="register__redirect">
          ¿Ya eres miembro?{" "}
          <Link to="/signin" className="register__link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
