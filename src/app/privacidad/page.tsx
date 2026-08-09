"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0c1b33] selection:bg-[#3b82f6]/20 selection:text-[#0c1b33] font-sans pb-20">
      {/* Header simple */}
      <header className="py-6 border-b border-slate-200 bg-white">
        <div className="container max-w-5xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-[#0c1b33] transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <Link href="/">
            <div className="relative w-36 h-11">
              <Image 
                src="/logo.png" 
                alt="Logo Florentin" 
                fill
                sizes="144px"
                className="object-contain"
              />
            </div>
          </Link>
        </div>
      </header>

      {/* Contenido Legal */}
      <article className="max-w-3xl mx-auto px-4 mt-12 sm:mt-16 leading-relaxed">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#3b82f6]/8 text-[#3b82f6] rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-[#0c1b33]">
            Política de Privacidad
          </h1>
        </div>

        <p className="text-slate-400 text-xs mb-8">
          Última actualización: Julio de 2026
        </p>

        <section className="space-y-8 text-slate-600 font-medium text-base">
          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">1. Declaración de Propiedad y Relación de Servicio</h2>
            <p className="mb-4">
              Esta aplicación web, incluyendo su portal de alumnos, base de datos e infraestructura tecnológica (en adelante, la "Plataforma"), es propiedad intelectual exclusiva y es operada técnicamente por <strong>Introspectiva Studio</strong> (en adelante, el "Propietario").
            </p>
            <p>
              El Propietario otorga una licencia de uso limitada de la Plataforma bajo la modalidad de Software como Servicio (SaaS) a la entidad o profesor autónomo <strong>Florentin</strong> (en adelante, el "Licenciatario"), quien es el responsable directo de la explotación comercial de la marca, las tutorías de francés y la relación docente con los alumnos.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">2. Información que Recopilamos</h2>
            <p className="mb-4">
              Para el correcto funcionamiento del sistema de reservas de clases y el portal del alumno, la Plataforma almacena y procesa los siguientes datos:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Datos de Identificación del Alumno:</strong> Nombre completo, correo electrónico y número de teléfono (para reservas de WhatsApp).</li>
              <li><strong>Datos de Reserva y Asistencia:</strong> Fechas, horas, notas de progreso de las clases impartidas y enlaces de las grabaciones de Zoom/Meet asociadas a tu plan de estudio.</li>
              <li><strong>Datos de Pago:</strong> Las transacciones monetarias y facturaciones se realizan a través de la pasarela segura de Stripe. El Propietario ni el Licenciatario almacenan datos confidenciales de tarjetas de crédito o débito directamente en sus servidores.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">3. Finalidad del Tratamiento de Datos</h2>
            <p className="mb-3">
              Los datos recabados se utilizan estrictamente para las siguientes finalidades:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Facilitar la programación, reprogramación y cancelación de clases particulares.</li>
              <li>Permitir el acceso al portal privado del alumno para revisar grabaciones, notas de estudio y descargar material didáctico.</li>
              <li>Enviar notificaciones y recordatorios automáticos sobre tus clases agendadas mediante correo electrónico y/o WhatsApp.</li>
              <li>Procesar cobros y suscripciones mensuales de forma segura.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">4. Encargado del Tratamiento y Destinatarios</h2>
            <p className="mb-4">
              El Licenciatario (Florentin) actúa como Responsable del Tratamiento frente al alumno para la prestación educativa. El Propietario (Introspectiva Studio) actúa como Encargado del Tratamiento, proveyendo la infraestructura de base de datos segura y el software necesario para el servicio.
            </p>
            <p>
              Tus datos no serán vendidos, cedidos, ni compartidos con terceras partes ajenas a la prestación técnica del servicio, con la única excepción de los proveedores de infraestructura crítica e indispensables para el cobro y autenticación (Stripe y Supabase).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">5. Derechos del Usuario (ARCO)</h2>
            <p className="mb-3">
              Como titular de los datos personales, tienes derecho a acceder, rectificar, cancelar o limitar el tratamiento de tu información almacenada en el portal. Para ejercer estos derechos, puedes solicitar la eliminación o modificación de tu perfil de alumno:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Escribiendo al correo de soporte oficial: <strong>lefrancaisavecflorentin@outlook.com</strong></li>
              <li>O comunicándote directamente a través del canal oficial de WhatsApp integrado en la Plataforma.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">6. Cambios en esta Política</h2>
            <p>
              Esta política de privacidad puede ser actualizada de forma periódica para reflejar mejoras en la plataforma o cambios legislativos. Te recomendamos revisar esta página regularmente para estar al tanto de cualquier novedad.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
