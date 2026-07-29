import React from 'react';

export const metadata = {
  title: 'Declaración de Accesibilidad | Getxo Bela Eskola',
  description: 'Declaración de accesibilidad del sitio web de Getxo Bela Eskola.',
};

export default function DeclaracionAccesibilidadPage() {
  return (
    <main className="min-h-screen bg-white text-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200 shadow-xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-black mb-10 pb-4 border-b border-gray-300">
          Declaración de Accesibilidad
        </h1>
        
        <div className="space-y-6 text-base md:text-lg leading-relaxed text-black">
          <p>
            La entidad <strong className="text-red-600 font-bold">Club Deportivo Pakea Munduari Itzulia</strong> se ha comprometido a hacer accesible su sitio web de conformidad con el Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público.
          </p>

          <p>
            La presente declaración de accesibilidad se aplica al sitio web{' '}
            <a href="https://getxobelaeskola.cloud/" className="text-red-600 hover:text-red-800 font-bold underline transition-colors">
              https://getxobelaeskola.cloud/
            </a>
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">Situación de cumplimiento</h2>
          <p>
            Este sitio web es <strong className="text-black font-bold">parcialmente conforme</strong> con el RD 1112/2018 debido a las excepciones y a la falta de conformidad de los aspectos que se indican a continuación.
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">Contenido no accesible</h2>
          <p>El contenido que se recoge a continuación no es accesible por lo siguiente:</p>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-red-600 mb-4">1. Falta de conformidad con el RD 1112/2018</h3>
            <ul className="list-disc pl-5 space-y-3 text-black">
              <li>Existen logotipos e imágenes con texto alternativo incorrecto o confuso e imágenes complejas sin descripción textual <span className="text-gray-600 text-sm font-medium">[requisito número 9.1.1.1 Contenido no textual, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen listas creadas de forma incorrecta (sin etiqueta de lista), tablas con celdas etiquetadas incorrectamente y etiquetas invisibles en elementos de formularios <span className="text-gray-600 text-sm font-medium">[requisito número 9.1.3.1 Información y relaciones, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen tablas no adaptadas a tamaños de pantalla pequeños y campos de formulario que no se visualizan correctamente en tamaños de pantalla pequeños <span className="text-gray-600 text-sm font-medium">[requisito número 9.1.4.10 Reajuste de texto, de UNE-EN 301549:2022]</span>.</li>
              <li>Existe texto que al cambiar los espacios y alturas de línea no se visualiza correctamente <span className="text-gray-600 text-sm font-medium">[requisito número 9.1.4.12 Espaciado de texto, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen elementos que no son accesibles por teclado, como por ejemplo enlaces a redes sociales, el editor de textos para comentarios, elementos para ordenar resultados de búsqueda, la paginación de los resultados de búsqueda o las flechas de calendario <span className="text-gray-600 text-sm font-medium">[requisito número 9.2.1.1 Teclado, de UNE-EN 301549:2022]</span>.</li>
              <li>Hay elementos que no reciben el foco y por tanto no se puede interactuar con ellos mediante el teclado <span className="text-gray-600 text-sm font-medium">[requisito número 9.2.4.3 Orden del foco, de UNE-EN 301549:2022]</span>.</li>
              <li>Hay enlaces en los que no se identifica correctamente su función (tienen una descripción inadecuada, un texto demasiado genérico, un title inadecuado…) <span className="text-gray-600 text-sm font-medium">[requisito número 9.2.4.4 Propósito de los enlaces, de UNE-EN 301549:2022]</span>.</li>
              <li>Hay encabezados con texto repetido y/o poco descriptivo <span className="text-gray-600 text-sm font-medium">[requisito número 9.2.4.6 Encabezados y etiquetas, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen imágenes, infografías, textos de enlaces o botones, texto de titulares y contenido que no están traducidos a otros idiomas <span className="text-gray-600 text-sm font-medium">[requisito número 9.3.1.2 Idioma de las partes, de UNE-EN 301549:2022]</span>.</li>
              <li>En alguna página se está usando el mismo icono para diferentes propósitos, lo cual genera confusión <span className="text-gray-600 text-sm font-medium">[requisito número 9.3.2.4 Identificación coherente, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen mensajes de error poco descriptivos, o mensajes de error que no están agrupados en un único mensaje así como falta de sugerencias en formulario para rellenar los campos correctamente <span className="text-gray-600 text-sm font-medium">[requisito número 9.3.3.1 Identificación de errores, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen formularios con campos obligatorios donde no se informa al usuario de ello, así como campos donde falta un ejemplo textual del formato del campo <span className="text-gray-600 text-sm font-medium">[requisito número 9.3.3.2 Etiquetas e instrucciones, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen campos de formularios donde se informa del error cuando se introduce un valor incorrecto pero no se informa de una sugerencia para su corrección <span className="text-gray-600 text-sm font-medium">[requisito número 9.3.3.3 Sugerencias ante errores, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen páginas con errores de sintaxis y por tanto algún producto de apoyo puede no interpretar correctamente el contenido (IDs de página duplicados, etiquetas sin cerrar, construcción incorrecta de etiquetas…) <span className="text-gray-600 text-sm font-medium">[requisito número 9.4.1.1 Procesamiento, de UNE-EN 301549:2022]</span>.</li>
              <li>Existen páginas en las que los productos de apoyo no van a poder obtener información, interactuar y estar al corriente del estado de los controles de interfaz de usuario que no podrán ser leídos por lectores de pantalla en el momento en el que aparecen <span className="text-gray-600 text-sm font-medium">[requisito número 9.4.1.2 Nombre, función, valor de UNE-EN 301549:2022]</span>.</li>
              <li>Podrían existir fallos puntuales de edición en alguna página web.</li>
            </ul>

            <h3 className="text-xl font-bold text-red-600 mt-8 mb-4">2. Carga desproporcionada</h3>
            <ul className="list-disc pl-5 space-y-2 text-black">
              <li>No aplica.</li>
            </ul>

            <h3 className="text-xl font-bold text-red-600 mt-8 mb-4">3. El contenido no entra dentro del ámbito de la legislación aplicable</h3>
            <ul className="list-disc pl-5 space-y-2 text-black">
              <li>Podrían existir archivos ofimáticos en PDF u otros formatos publicados antes del 20 de septiembre de 2018 que no cumplan en su totalidad todos los requisitos de accesibilidad. Aunque se ha procurado que la mayoría de ellos sí lo cumplan.</li>
            </ul>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">Preparación de la presente declaración de accesibilidad</h2>
          <p>La presente declaración fue preparada el <strong className="text-black">29/07/2026</strong>.</p>
          <p>El método empleado para preparar la declaración ha sido una autoevaluación llevada a cabo por la propia entidad.</p>
          <p>Última revisión de la declaración: <strong className="text-black">29/07/2026</strong>.</p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">Observaciones y datos de contacto</h2>
          <p>Puede realizar comunicaciones sobre requisitos de accesibilidad (artículo 10.2.a) del RD 1112/2018) como por ejemplo:</p>
          <ul className="list-disc pl-5 space-y-2 text-black">
            <li>Informar sobre cualquier posible incumplimiento por parte de este sitio web.</li>
            <li>Transmitir otras dificultades de acceso al contenido.</li>
            <li>Formular cualquier otra consulta o sugerencia de mejora relativa a la accesibilidad del sitio web.</li>
          </ul>
          <p>
            Puede hacerlo a través de nuestra página de{' '}
            <a href="/contacto" className="text-red-600 hover:text-red-800 font-bold underline transition-colors">
              contacto
            </a>.
          </p>

          <p className="mt-6">
            Puede presentar una queja relativa al cumplimiento de los requisitos del RD 1112/2018 o una Solicitud de Información accesible relativa a:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-black">
            <li>Contenidos que están excluidos del ámbito de aplicación del RD 1112/2018 según lo establecido por el artículo 3, apartado 4.</li>
            <li>Contenidos que están exentos del cumplimiento de los requisitos de accesibilidad por imponer una carga desproporcionada.</li>
          </ul>
          <p>
            En la Solicitud de información accesible, se debe concretar, con toda claridad, los hechos, razones y petición que permitan constatar que se trata de una solicitud razonable y legítima.
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">Contenido opcional</h2>
          <p>Este sitio web aplica los requisitos de la Norma UNE-EN 301549:2022 considerando las excepciones del RD 1112/2018.</p>
          <p>La última revisión de la accesibilidad se ha realizado el <strong className="text-black">29/07/2026</strong>.</p>
          <p>
            El sitio web está optimizado para los navegadores actuales (las últimas versiones vigentes de FireFox, Safari, Opera, Edge y Google Chrome). La resolución web mínima recomendada es de 1280×1024.
          </p>
          <p>
            El sitio web está diseñado para su visualización <em className="text-black font-semibold">Responsive</em>, con lo que se visualiza de forma óptima en dispositivos tablet y móviles. En estos dispositivos está optimizado para su visualización en las últimas versiones vigentes de Chrome for mobile, Firefox for mobile, Safari mobile, y navegadores nativos.
          </p>
        </div>
      </div>
    </main>
  );
}
