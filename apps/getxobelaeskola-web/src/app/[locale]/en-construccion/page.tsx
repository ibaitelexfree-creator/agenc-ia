import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { EnConstruccionContent } from './EnConstruccionContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEu = locale === 'eu';
  const isEn = locale === 'en';
  const isFr = locale === 'fr';

  let title = 'Página en Construcción | Getxo Bela Eskola';
  let description = 'Estamos preparando este programa. Disculpe las molestias.';

  if (isEu) {
    title = 'Orria Eraikitzen | Getxo Bela Eskola';
    description = 'Programa hau prestatzen ari gara. Barkatu eragozpenak.';
  } else if (isEn) {
    title = 'Under Construction | Getxo Bela Eskola';
    description = 'We are preparing this program. Sorry for the inconvenience.';
  } else if (isFr) {
    title = 'Page en Construction | Getxo Bela Eskola';
    description = 'Nous préparons ce programme. Veuillez nous excuser pour la gêne occasionnée.';
  }

  return {
    title,
    description,
  };
}

export default async function EnConstruccionPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'en_construccion' });

  return (
    <EnConstruccionContent
      locale={locale}
      badge={t('badge')}
      title={t('title')}
      apology={t('apology')}
      question={t('question')}
      prompt={t('prompt')}
      emailBtn={t('email_btn')}
      whatsappBtn={t('whatsapp_btn')}
      contactBtn={t('contact_btn')}
      backHome={t('back_home')}
    />
  );
}
