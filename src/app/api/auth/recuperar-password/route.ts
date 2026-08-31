import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { enviarCorreoRecuperacionPassword } from '@/lib/emails';

/**
 * POST /api/auth/recuperar-password
 * 
 * Endpoint para solicitar el restablecimiento seguro de contraseña.
 * Genera un enlace de recuperación oficial de Supabase Auth y lo envía
 * mediante el diseño de correo personalizado de Florentin.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, idioma = 'es' } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Por favor, proporciona un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Verificar si el usuario realmente existe en la base de datos
    const { data: usuario } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!usuario) {
      const errorMsg = idioma === 'fr' 
        ? "Cet e-mail n'est pas enregistré sur la plateforme. Veuillez vérifier l'orthographe ou créer un compte."
        : idioma === 'en'
          ? "This email is not registered on the platform. Please check your spelling or create an account."
          : "Este correo electrónico no se encuentra registrado en la plataforma. Por favor, verifica que esté bien escrito o regístrate.";
      
      return NextResponse.json({ error: errorMsg }, { status: 404 });
    }

    const nombreAlumno = usuario.nombre || 'Estudiante';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lefrancaisavecflorentin.com';

    // 2. Generar el enlace de recuperación seguro con Supabase Auth Admin
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: cleanEmail,
      options: {
        redirectTo: `${baseUrl}/alumno`
      }
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('Error generando recovery link:', linkError);
      const errorMsg = idioma === 'fr'
        ? "Impossible de générer le lien de récupération. Veuillez vérifier vos identifiants."
        : idioma === 'en'
          ? "Unable to generate recovery link. Please verify your credentials."
          : "No se pudo generar el enlace de recuperación. Verifica que la cuenta esté activa.";

      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const recoveryActionLink = linkData.properties.action_link;

    // 3. Enviar el correo con la plantilla institucional de Florentin
    const emailRes = await enviarCorreoRecuperacionPassword(
      cleanEmail,
      nombreAlumno,
      recoveryActionLink,
      idioma
    );

    if (!emailRes.success) {
      console.error('Fallo al enviar correo de recuperación:', emailRes.error);
      return NextResponse.json(
        { error: 'Hubo un problema al enviar el correo. Por favor, inténtalo nuevamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '¡Correo enviado con éxito! Revisa tu bandeja de entrada.'
    });

  } catch (error: any) {
    console.error('Error en /api/auth/recuperar-password:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar la solicitud' },
      { status: 500 }
    );
  }
}
