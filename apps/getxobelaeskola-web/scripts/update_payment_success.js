const fs = require('fs');
const path = require('path');

const translations = {
  es: {
    payment_success_page: {
      loading_confirm: "Cargando confirmación...",
      title_warning: "Pago Recibido",
      title_membership: "Bienvenido a Bordo",
      title_rental: "Reserva Confirmada",
      title_course: "Inscripción Lista",
      desc_warning: "El banco ha confirmado el pago, pero la activación automática en nuestro sistema está tardando un poco más. No te preocupes: tu reserva/inscripción está a salvo. Recibirás un correo de confirmación pronto. Si no aparece en tu panel en unos minutos, escríbenos a info@getxobelaeskola.com.",
      desc_membership: "Tu suscripción de socio ha sido activada correctamente. Ahora tienes acceso a tarifas exclusivas y ventajas en toda nuestra flota.",
      desc_rental: "Hemos registrado tu reserva de material. Recibirás un correo con los detalles y el código de acceso si es necesario.",
      desc_course: "Tu plaza en el curso ha sido reservada con éxito. Ya puedes acceder al material teórico desde tu panel de alumno.",
      label_verifying: "Verificando...",
      label_transaction: "Transacción",
      label_status: "Estado",
      status_checking: "Verificando con el banco...",
      status_completed: "Completado y Verificado",
      status_syncing: "Sincronizando...",
      label_service: "Servicio",
      label_course: "Curso",
      label_starts: "Empieza:",
      label_reference: "Referencia",
      btn_home: "Ir al Inicio",
      btn_dashboard: "Mi Panel Personal →",
      admin_supabase: "Ver en Supabase (Admin)",
      quote: "\"No hay viento favorable para quien no sabe a qué puerto se dirige.\" — Séneca"
    }
  },
  en: {
    payment_success_page: {
      loading_confirm: "Loading confirmation...",
      title_warning: "Payment Received",
      title_membership: "Welcome Aboard",
      title_rental: "Booking Confirmed",
      title_course: "Registration Ready",
      desc_warning: "The bank has confirmed the payment, but the automatic activation in our system is taking slightly longer. Don't worry: your booking/registration is safe. You will receive a confirmation email shortly. If it does not appear in your dashboard within a few minutes, please contact us at info@getxobelaeskola.com.",
      desc_membership: "Your membership subscription has been successfully activated. You now have access to exclusive rates and benefits across our entire fleet.",
      desc_rental: "We have recorded your equipment rental booking. You will receive an email with the details and access code if necessary.",
      desc_course: "Your spot in the course has been successfully reserved. You can now access the theoretical material from your student dashboard.",
      label_verifying: "Verifying...",
      label_transaction: "Transaction",
      label_status: "Status",
      status_checking: "Verifying with bank...",
      status_completed: "Completed and Verified",
      status_syncing: "Syncing...",
      label_service: "Service",
      label_course: "Course",
      label_starts: "Starts:",
      label_reference: "Reference",
      btn_home: "Go to Home",
      btn_dashboard: "My Personal Dashboard →",
      admin_supabase: "View in Supabase (Admin)",
      quote: "\"There is no favorable wind for those who do not know which port they are heading for.\" — Seneca"
    }
  },
  eu: {
    payment_success_page: {
      loading_confirm: "Berrespena kargatzen...",
      title_warning: "Ordainketa jaso da",
      title_membership: "Ongi etorri ontzira",
      title_rental: "Erreserba berretsia",
      title_course: "Izen-ematea prest",
      desc_warning: "Bankuak ordainketa berretsi du, baina gure sistemako aktibazio automatikoa pixka bat gehiago kostatzen ari da. Ez kezkatu: zure erreserba/izen-ematea ziur dago. Laster berrespen-mezu bat jasoko duzu. Minutu gutxi barru zure panelean agertzen ez bada, idatz iezaguzu info@getxobelaeskola.com helbidera.",
      desc_membership: "Zure bazkide-harpidetza zuzen aktibatu da. Orain tarifa esklusiboak eta abantailak dituzu gure ontziteri osoan.",
      desc_rental: "Materialaren erreserba erregistratu dugu. Xehetasunekin eta, behar izanez gero, sartzeko kodearekin mezu bat jasoko duzu.",
      desc_course: "Ikastaroko lekua arrakastaz erreserbatu da. Dagoeneko zure ikasle-paneletik eduki teorikoak eskura ditzakezu.",
      label_verifying: "Egiaztatzen...",
      label_transaction: "Transakzioa",
      label_status: "Egoera",
      status_checking: "Bankuarekin egiaztatzen...",
      status_completed: "Osatua eta egiaztatua",
      status_syncing: "Sinkronizatzen...",
      label_service: "Zerbitzua",
      label_course: "Ikastaroa",
      label_starts: "Hasten da:",
      label_reference: "Erreferentzia",
      btn_home: "Joan hasierara",
      btn_dashboard: "Nire panel pertsonala →",
      admin_supabase: "Ikusi Supabasen (Admin)",
      quote: "\"Ez dago haize mesedegarririk nora doan ez dakienarentzat.\" — Seneka"
    }
  },
  fr: {
    payment_success_page: {
      loading_confirm: "Chargement de la confirmation...",
      title_warning: "Paiement Reçu",
      title_membership: "Bienvenue à Bord",
      title_rental: "Réservation Confirmée",
      title_course: "Inscription Prête",
      desc_warning: "La banque a confirmé le paiement, mais l'activation automatique dans notre système prend un peu plus de temps. Ne vous inquiétez pas : votre réservation/inscription est sécurisée. Vous recevrez bientôt un e-mail de confirmation. S'il n'avait pas d'impact dans votre tableau de bord dans quelques minutes, écrivez-nous à info@getxobelaeskola.com.",
      desc_membership: "Votre abonnement de membre a été activé avec succès. Vous avez désormais accès à des tarifs exclusifs et à des avantages sur toute notre flotte.",
      desc_rental: "Nous avons enregistré votre réservation de matériel. Vous recevrez un e-mail avec les détails et le code d'accès si nécessaire.",
      desc_course: "Votre place dans le cours a été réservée avec succès. Vous pouvez désormais accéder au matériel théorique depuis votre tableau de bord étudiant.",
      label_verifying: "Vérification...",
      label_transaction: "Transaction",
      label_status: "Statut",
      status_checking: "Vérification auprès de la banque...",
      status_completed: "Complété et Vérifié",
      status_syncing: "Synchronisation...",
      label_service: "Service",
      label_course: "Cours",
      label_starts: "Commence le :",
      label_reference: "Référence",
      btn_home: "Aller à l'Accueil",
      btn_dashboard: "Mon Tableau de Bord →",
      admin_supabase: "Voir sur Supabase (Admin)",
      quote: "\"Il n'y a pas de vent favorable pour celui qui ne sait pas vers quel port il navigue.\" — Sénèque"
    }
  }
};

const paths = [
  'C:\\Users\\User\\Desktop\\agenc-ia\\apps\\getxobelaeskola-web\\messages',
  'C:\\Users\\User\\Desktop\\agenc-ia\\messages'
];

paths.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  
  Object.keys(translations).forEach(lang => {
    const filePath = path.join(dir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(fileContent);
        
        // Merge translations
        json.payment_success_page = translations[lang].payment_success_page;
        
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
        console.log(`Updated ${filePath}`);
      } catch (err) {
        console.error(`Error updating ${filePath}:`, err);
      }
    }
  });
});
