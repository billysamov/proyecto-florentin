/**
 * Módulo para interactuar con la API Oficial de WhatsApp Cloud (Meta).
 */

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const DEFAULT_TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || "bienvenida_alumno";

interface SendTemplateParams {
  to: string; // Número del alumno (en formato internacional, sin el signo '+', ej: '51987654321')
  nombreAlumno: string;
  planNombre: string;
}

/**
 * Envía una plantilla de mensaje de bienvenida aprobada por Meta a través de WhatsApp Cloud API.
 */
export async function enviarWhatsAppBienvenida(params: SendTemplateParams): Promise<boolean> {
  const { to, nombreAlumno, planNombre } = params;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn("[WhatsApp API] Las credenciales WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID no están configuradas. Omisión del envío.");
    return false;
  }

  // Sanitizar el número de teléfono (debe tener solo dígitos)
  const cleanPhone = to.replace(/\D/g, "");

  if (!cleanPhone) {
    console.error("[WhatsApp API] Número de teléfono de destino no válido.");
    return false;
  }

  const url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: cleanPhone,
    type: "template",
    template: {
      name: DEFAULT_TEMPLATE_NAME,
      language: {
        code: "es" // Código de idioma de la plantilla
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: nombreAlumno // Parámetro {{1}}
            },
            {
              type: "text",
              text: planNombre // Parámetro {{2}}
            }
          ]
        }
      ]
    }
  };

  try {
    console.log(`[WhatsApp API] Intentando enviar plantilla '${DEFAULT_TEMPLATE_NAME}' a ${cleanPhone}...`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("[WhatsApp API] Error de Meta API:", resData);
      return false;
    }

    console.log("[WhatsApp API] Mensaje enviado con éxito a través de Meta Cloud API. ID:", resData.messages?.[0]?.id);
    return true;
  } catch (error) {
    console.error("[WhatsApp API] Fallo de conexión de red al enviar WhatsApp:", error);
    return false;
  }
}
