"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText } from "lucide-react";

export default function TerminosPage() {
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
            <FileText size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-[#0c1b33]">
            Términos y Condiciones de Uso
          </h1>
        </div>

        <p className="text-slate-400 text-xs mb-8">
          Última actualización: Julio de 2026
        </p>

        <section className="space-y-8 text-slate-600 font-medium text-base">
          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">1. Propiedad Intelectual y Licenciamiento del Software</h2>
            <p className="mb-4">
              Esta aplicación web, su código fuente, diseño de interfaces, base de datos privada y el portal del alumno son propiedad intelectual exclusiva de <strong>Introspectiva Studio</strong> (en adelante, la "Compañía").
            </p>
            <p className="mb-4">
              La Compañía provee el uso de esta plataforma tecnológica en calidad de Software como Servicio (SaaS) a la marca <strong>Florentin</strong> (en adelante, el "Profesor"), otorgando una licencia de acceso para la administración de alumnos y reserva de tutorías de francés.
            </p>
            <p>
              El uso de la plataforma por parte de los alumnos está sujeto a una licencia de acceso personal, limitada, no exclusiva e intransferible. Queda prohibida la reproducción, distribución, ingeniería inversa o cualquier intento de copia del código fuente de este sistema, los cuales son derechos reservados de la Compañía.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">2. Condiciones de Reserva y Uso de Clases</h2>
            <p className="mb-3">
              Al contratar un plan de estudios o agendar la clase de prueba gratuita con el Profesor, el alumno acepta las siguientes reglas de servicio:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Reserva de Clases:</strong> Las clases deben agendarse a través del portal de alumnos seleccionando los horarios disponibles proporcionados por el sistema de reservas.</li>
              <li><strong>Políticas de Reprogramación:</strong> El alumno puede reprogramar una clase con un mínimo de <strong>24 horas de antelación</strong> antes del inicio programado de la sesión de manera gratuita desde su portal. Pasado este plazo de aviso, la clase se considerará impartida y se cobrará en su totalidad sin derecho a reembolso o reprogramación.</li>
              <li><strong>Caducidad de los Planes:</strong> Cada paquete de clases adquirido posee un periodo de validez específico detallado en la descripción de los planes. Al expirar la validez del plan, las clases no agendadas caducarán automáticamente.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">3. Pasarela de Pagos y Suscripciones</h2>
            <p className="mb-3">
              Todos los pagos de los planes de estudio y mensualidades se procesan a través de la infraestructura segura de Stripe:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Procesamiento Seguro:</strong> Stripe recopila y procesa tus credenciales de pago conforme a sus estándares de cumplimiento PCI-DSS.</li>
              <li><strong>Cancelaciones de Suscripción:</strong> Los planes con cobros recurrentes pueden cancelarse en cualquier momento desde el portal del alumno, impidiendo la renovación del cargo para el siguiente periodo.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">4. Limitación de Responsabilidad</h2>
            <p className="mb-4">
              <strong>Introspectiva Studio</strong>, en su calidad de proveedor de tecnología de la plataforma SaaS, no es responsable directo de la calidad, contenidos de aprendizaje, asistencia del Profesor ni de los resultados académicos de las clases de francés contratadas. Dicha relación contractual y pedagógica recae exclusivamente sobre la marca <strong>Florentin</strong>.
            </p>
            <p>
              La Compañía se compromete a realizar sus mejores esfuerzos técnicos para garantizar la disponibilidad continua de la Plataforma, pero no se responsabiliza por interrupciones de acceso debidas a causas de fuerza mayor o fallos en redes de comunicación externas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] font-serif mb-3">5. Jurisdicción y Resolución de Conflictos</h2>
            <p>
              Para cualquier controversia que surja de la relación pedagógica, cobros de clases y/o reservas, las partes acuerdan someterse a la jurisdicción y leyes aplicables de la localidad de residencia del Profesor de francés (Florentin). Para conflictos derivados de la titularidad del software y el licenciamiento de la Plataforma, aplicarán las leyes de la jurisdicción de constitución de Introspectiva Studio.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
