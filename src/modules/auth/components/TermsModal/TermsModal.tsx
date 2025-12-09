import React, { useEffect, useRef } from 'react';
import { Modal } from '@/shared/components/Modal/Modal';
import styles from './TermsModal.module.css';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToSection?: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, scrollToSection }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Efecto para hacer scroll a la sección específica cuando el modal se abre
  useEffect(() => {
    if (isOpen && scrollToSection && contentRef.current) {
      // Esperar un momento para que el contenido se renderice
      setTimeout(() => {
        const section = contentRef.current?.querySelector(
          `[data-section="${scrollToSection}"]`
        ) as HTMLElement;
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Resaltar la sección brevemente
          section.style.backgroundColor = 'var(--ds-blue-50)';
          setTimeout(() => {
            section.style.backgroundColor = '';
          }, 2000);
        }
      }, 100);
    }
  }, [isOpen, scrollToSection]);
  const termsContent = `POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES Y TÉRMINOS Y CONDICIONES
DE COLOMBIAN COMPANY GROUP SAS (AIMEDIC)

Las presentes Políticas de Tratamiento de Datos Personales (en adelante las "Políticas") y los Términos y Condiciones de uso de los servicios de Aimedic, establecidos en el presente documento, serán aplicables a COLOMBIAN COMPANY GROUP SAS, identificada con NIT 901.447.449-0, que opera bajo el nombre comercial Aimedic (en adelante, "Aimedic" o "La Compañía").
Aimedic es una empresa dedicada al desarrollo e implementación de soluciones de inteligencia artificial en el sector salud, con el objetivo de optimizar procesos, apoyar diagnósticos, personalizar tratamientos y mejorar la calidad de vida de los pacientes. El tratamiento de datos personales es fundamental para la prestación de nuestros servicios, y nos comprometemos a hacerlo con la máxima responsabilidad, transparencia y apego a la normativa vigente.
CAPÍTULO I DISPOSICIONES NORMATIVAS
El artículo 15 de la Constitución Política de la República de Colombia (en adelante la "Constitución") establece que cualquier persona tiene derecho a conocer, actualizar y rectificar los datos personales que existan sobre ella en banco de datos o archivos de entidades públicas o privadas (en adelante el derecho al "Habeas Data") y ordena a quienes tengan datos personales de terceros, respetar los derechos y garantías previstos en la Constitución cuando se realice el Tratamiento (según se define este término más adelante) de los datos personales.
Posteriormente, la Ley 1266 de 2008 reglamentó el derecho al habeas data financiero y en el año 2009 la Ley 1273 estableció como delito la "violación de datos personales".
Así mismo, en la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y el Decreto 1074 de 2015, se establecieron las condiciones mínimas para realizar el tratamiento legítimo y adecuado de los datos personales y se obliga a los Responsables del Tratamiento de dichos datos a adoptar políticas internas que permitan garantizar el adecuado cumplimiento de la normatividad vigente en esta materia.
CAPÍTULO II OBJETO Y ALCANCE
Las presentes Políticas tienen como objeto desarrollar el derecho constitucional al Hábeas Data que tienen todas las personas sobre las cuales Aimedic, en el desarrollo de sus actividades empresariales y la prestación de sus servicios de inteligencia artificial en el sector salud, haya recopilado, administrado o tratado sus datos de carácter personal, bien sean clientes, usuarios, pacientes, profesionales de la salud, empleados, proveedores, accionistas, intermediarios, colaboradores o cualquier otra persona natural.
Por otra parte, y como quiera que dentro de las actividades que principalmente desarrolla Aimedic, se encuentra la de prestar servicios de salud y desarrollar soluciones de inteligencia artificial, existe tanto para la Compañía como para sus colaboradores el deber de guardar reserva y discreción sobre los datos de sus pacientes, usuarios o sobre aquellos relacionados con la situación propia de los mismos, que llegaren a conocer en desarrollo de sus actividades. Es pertinente indicar que en el ejercicio de las funciones legales que el Estado ha delegado para garantizar la prestación de servicios de salud, se recaudan datos de salud y así mismo, existe el deber legal de mantener bajo reserva la historia clínica de los pacientes de acuerdo con lo establecido en la Ley 23 de 1981, la Resolución 1995 de 1999 y las bases de datos del sistema general de seguridad social reguladas por la Resolución 1344 de 2012, Resolución 839 de 2017, Decreto reglamentario 3380 de 1981, y demás normas aplicables a la gestión de la información en salud.
Adicionalmente, Aimedic trata datos personales dentro de los que se encuentran (i) datos sensibles y (ii) datos de especial protección como lo son los de los niños, niñas y adolescentes (menores de edad), y en ese sentido está comprometida con el respeto y garantía de los derechos de los Titulares de los datos que recolecta, cumpliendo con la normatividad vigente adoptando las presentes Políticas, las cuales son de obligatoria aplicación en todas las actividades que involucren total o parcialmente la recolección, el almacenamiento, el uso y la circulación de esa información.
Por lo anterior, tanto Aimedic, como todos los terceros que obran en nombre de la misma como Encargados y todos los sujetos involucrados en el tratamiento de datos personales, deben observar y respetar las normas en materia de protección de datos personales; la confidencialidad de los datos tratados y éstas Políticas en el cumplimiento de sus funciones y/o actividades desde antes de su recolección y aún después de terminados los vínculos legales, comerciales, laborales o de cualquier índole con Aimedic.
Las presentes Políticas se encuentran publicadas en la página web https://www.aimedic.com.co/data-privacy  y demás páginas web señaladas en el capítulo XII del presente documento, con el fin de que sean conocidas por los Titulares de los datos y de los terceros encargados de tratar los datos personales.
CAPÍTULO III DEFINICIONES
Para efectos de la interpretación y aplicación de éstas Políticas, se relacionan las siguientes definiciones:
Accionistas: Toda persona que haya tenido o tenga una inversión en acciones de COLOMBIAN COMPANY GROUP SAS.
Autorizacíon: Consentimiento previo, expreso e informado del Titular del dato para llevar a cabo el tratamiento de su información personal.
Base de Datos: Conjunto organizado de datos personales que sea objeto de Tratamiento, tanto por entidades públicas como privadas. Incluye aquellos depósitos de datos que constan en documentos y que tienen la calidad de archivos.
Colaborador: Se entenderá como tal a todas las personas vinculadas a Aimedic, tales como miembros de asamblea general de accionistas, miembros de junta directiva, administradores de la entidad, empleados, contratistas, proveedores, aprendices, encargados, etc.
Compañía: Para efectos de estas Políticas, es COLOMBIAN COMPANY GROUP SAS, que opera bajo el nombre comercial Aimedic, la cual será responsable del tratamiento de datos, conforme a la lista definida en "Responsable del Tratamiento (página 4), del presente documento, según corresponda.
Consulta: Solicitud del Titular o de sus causahabientes, con el fin de conocer o consultar información que del Titular repose en las bases de datos administradas por Aimedic.
Dato personal: Cualquier información que directa o indirectamente se refiere a una persona natural o que permita asociarse a una o varias personas y que permite identificarla. Son algunos ejemplos de datos personales los siguientes: nombre, número de identificación ciudadana, dirección física, dirección de correo electrónico, número telefónico, estado civil, datos de salud, huella dactilar, salario, bienes, estados financieros, etc.
Dato personal privado: Es el dato que por su naturaleza íntima o reservada sólo es relevante para la persona titular del dato. Ejemplos: libros de los comerciantes (contabilidad), información extraída a partir de la inspección del domicilio, número telefónico siempre y cuando no se encuentre en bases públicas o el salario.
Dato personal público: Es el dato calificado como tal por ley o la Constitución Política o el que no sea privado, semiprivado o sensible. Son públicos, entre otros, los datos relativos al estado civil de las personas, a su profesión u oficio y a su calidad de comerciante o de servidor público, los datos contenidos en el RUNT o los datos contenidos en el registro público mercantil de las Cámaras de Comercio. Por su naturaleza, los datos públicos pueden estar contenidos, entre otros, en registros públicos, documentos públicos, gacetas y boletines oficiales y sentencias judiciales debidamente ejecutoriadas que no estén sometidas a reserva.
Dato personal semiprivado: Es semiprivado el dato que no tiene naturaleza íntima, reservada, ni pública y cuyo conocimiento o divulgación puede interesar no sólo a su titular sino a cierto sector o grupo de personas o a la sociedad en general, como, entre otros, el dato referente al cumplimiento o incumplimiento de las obligaciones financieras, o los datos relativos a las relaciones con las entidades de la seguridad social.
Dato personal sensible: Información que afecta la intimidad de la persona o cuyo uso indebido puede generar su discriminación, tales como por ejemplo aquellos que revelen el origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político o que garanticen los derechos y garantías de partidos políticos de oposición, así como los datos relativos a la salud, a la vida sexual y los datos biométricos (datos de salud, huellas dactilares, fotos, videos).
Disposición Final: Decisión resultante de la valoración hecha en cualquier etapa del ciclo vital de los documentos, registrada en las tablas de retención y/o tablas de valoración documental, con miras a su conservación total, eliminación, selección y/o reproducción.
Encargado del tratamiento: Persona natural o jurídica, pública o privada que por sí misma o en asocio con otros, realiza el tratamiento de datos personales por cuenta del Responsable del Tratamiento.
Menores: Hace referencia a los menores de dieciocho (18) años, y corresponde a los niños, niñas y adolescentes.
Reclamo: Solicitud del Titular o sus causahabientes cuando consideren que la información contenida en una base de datos administrada por Aimedic deba ser corregida, actualizada o eliminada, o en el evento en que se advierta un incumplimiento por parte de ésta o de alguno de sus Encargados.

Responsable del tratamiento: Persona natural o jurídica, pública o privada que por sí misma o en asocio con otros, decide sobre la recolección de datos personales y/o el tratamiento de los datos.
En el caso de que se constituyan nuevas compañías o se modifique la estructura de Aimedic, el responsable del tratamiento será la respectiva sociedad, con la especificación del domicilio y dirección que se reporte en el registro mercantil, con el correo: info@aimedic.com.co, y teléfono 573106258884, o a través de la línea de atención al cliente que se defina.
Titular del dato: Es la persona natural cuyos datos personales sean objeto de tratamiento.
Transferencia: Envío de datos personales que realiza el Responsable o el Encargado desde Colombia a un Responsable que se encuentra dentro (transferencia nacional) o fuera del país (transferencia internacional).
Transmisión: Tratamiento de datos personales que implica la comunicación de los mismos dentro (transmisión nacional) o fuera de Colombia (transmisión internacional) y que tiene por objeto la realización de un tratamiento por el Encargado por cuenta del Responsable.
Tratamiento: Cualquier operación o conjunto de operaciones sobre datos personales como, entre otros, la recolección, el almacenamiento, el uso, la circulación o supresión de esa clase de información.
CAPÍTULO IV PRINCIPIOS PARA EL TRATAMIENTO DE DATOS PERSONALES
A continuación, se relacionan los principios contenidos en la normatividad vigente, los cuáles deben tenerse en cuenta para efectos de realizar el tratamiento de datos personales:
Principio de legalidad en materia de Tratamiento de datos: El Tratamiento a que se refiere la Ley 1581 de 2012 es una actividad reglada que debe sujetarse a lo establecido en ella y en las demás disposiciones que la desarrollen.
Principio de finalidad: El Tratamiento de los datos personales debe obedecer a una finalidad legítima de acuerdo con la Constitución y la Ley, la cual debe ser informada al Titular.
Principio de libertad: El Tratamiento sólo puede ejercerse con el consentimiento, previo, expreso e informado del Titular. Los datos personales no podrán ser obtenidos o divulgados sin previa autorización, o en ausencia de mandato legal o judicial que releve el consentimiento.
Principio de acceso y circulación restringida: El Tratamiento se sujeta a los límites que se derivan de la naturaleza de los datos personales, de las disposiciones de la ley y la Constitución. En este sentido, el Tratamiento sólo podrá hacerse por personas autorizadas por el Titular y/o por las personas previstas en la ley.
Principio de veracidad o calidad: La información sujeta a Tratamiento debe ser veraz, completa, exacta, actualizada, comprobable y comprensible. Se prohíbe el Tratamiento de datos parciales, incompletos, fraccionados o que induzcan a error.
Principio de transparencia: En el Tratamiento debe garantizarse el derecho del Titular a obtener del Responsable del Tratamiento o del Encargado del Tratamiento, en cualquier momento y sin restricciones, información acerca de la existencia de datos que le conciernan.
Principio de seguridad: La información sujeta a Tratamiento por el Responsable del Tratamiento o Encargado del Tratamiento a que se refiere la ley, se deberá manejar con las medidas técnicas, humanas y administrativas que sean necesarias para otorgar seguridad a los registros evitando su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
Principio de confidencialidad: Todas las personas que intervengan en el Tratamiento de datos personales que no tengan la naturaleza de públicos, están obligadas a garantizar la reserva de la información, inclusive después de finalizada su relación con alguna de las labores que comprende el Tratamiento, pudiendo sólo realizar suministro o comunicación de datos personales cuando ello corresponda al desarrollo de las actividades autorizadas en la ley y en los términos de la misma.
Necesidad y proporcionalidad: Los datos personales registrados en una base de datos deben ser los estrictamente necesarios para el cumplimiento de las finalidades del Tratamiento, informadas al Titular y por tal razón, deben ser adecuados, pertinentes y acordes con las finalidades para los cuales fueron recolectados.
Temporalidad o caducidad: El período de conservación de los datos personales será el necesario para alcanzar la finalidad para la cual se han recolectado una vez cumplida la finalidad el Responsable y/o Encargado deberán proceder con la supresión de los mismos, salvo que exista una obligación contractual o legal que obligue a Aimedic a mantener dichos datos.
Teniendo en cuenta lo anterior, Aimedic en desarrollo del principio de legalidad velará porque los datos sean recopilados, tratados y manejados de manera lícita. Esto es que en desarrollo de sus actividades recabará los datos necesarios para el desarrollo de las mismas.
Así mismo, y cuando Aimedic actúe como Responsable del Tratamiento, es decir cuando se encuentre frente a un Titular que va a adquirir la calidad de beneficiario, voluntario, empleado, proveedor o en general de cualquier Colaborador o ya la tiene, le informará a éste de manera clara, suficiente y previa acerca de la o las finalidades del tratamiento que se le dará a los datos personales a ser suministrados.
En desarrollo del principio de razonabilidad y proporcionalidad, Aimedic recolectará los datos personales que sean estrictamente necesarios para llevar a cabo las finalidades perseguidas y los conservará por el tiempo necesario para cumplir con tales finalidades, observando en todo momento los términos especiales establecidos por la ley para datos sensibles.
Igualmente, Aimedic respetará la libertad que tiene el Titular para autorizar o no el uso de sus datos personales. Sin embargo, debe tenerse en cuenta que, conforme a lo previsto en la normatividad vigente, en ningún caso el Titular del dato podrá revocar la autorización y solicitar la supresión del dato, cuando exista un deber legal o contractual que le imponga el deber de permanecer en la base de datos o archivo del Responsable o Encargado.
CAPÍTULO V DERECHOS DE LOS TITULARES
Derechos de los Titulares de la información
Aimedic respeta y garantiza los derechos de los Titulares de los datos, los cuáles se relacionan a continuación:
Conocer, actualizar y rectificar sus datos personales.
Solicitar prueba de la autorización otorgada por éstos en calidad de Titulares de los datos a Aimedic, salvo cuando, de acuerdo con la Ley, el Tratamiento que se esté realizando no lo requiera.
Ser informado por Aimedic sobre el uso dado a los datos personales del Titular, previa solicitud efectuada por éste a través de los canales dispuestos para ello.
Presentar consultas y reclamos ante Aimedic, con el fin de salvaguardar su derecho al Habeas Data teniendo en cuenta para ello, las pautas establecidas en la ley y en las presentes Políticas.
Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a la normatividad vigente y solicitar ante dicha entidad la supresión del dato personal, cuando se haya determinado que en el tratamiento por parte de Aimedic se incurrió en conductas contrarias a la normatividad vigente o a la Constitución.
Acceder en forma gratuita a través de los canales dispuestos por Aimedic, a sus datos personales que hayan sido objeto de tratamiento. La información solicitada por el Titular podrá ser suministrada por cualquier medio, incluyendo los electrónicos, según lo requiera el Titular. La información deberá ser de fácil lectura y deberá corresponder en un todo a aquella que repose en las bases de datos o archivos administrados por Aimedic.
Revocar la autorización y/o solicitar la supresión del dato cuando en el Tratamiento no se respeten los principios, derechos y garantías constitucionales y legales. La revocatoria y/o supresión procederá cuando la SIC haya determinado que en el Tratamiento el responsable o encargado han incurrido en conductas contrarias a esta ley y a la Constitución.
Responder, facultativamente, las preguntas que versen sobre Datos Personales Sensibles o de menores de edad. Por tratarse de Datos Personales Sensibles el Titular no está obligado a autorizar su Tratamiento.
CAPÍTULO VI TRATAMIENTO AL CUAL SERÁN SOMETIDOS LOS DATOS Y FINALIDAD
Tratamiento al cual serán sometidos los datos personales:
Aimedic podrá recolectar y usar los datos personales de sus clientes, usuarios, tomadores, asegurados, beneficiarios, afiliados, pacientes, profesionales de la salud, empleados, accionistas, miembros de junta directiva, aprendices, proveedores y demás colaboradores, para los fines autorizados e informados al titular de la información, así como los establecidos en la ley, cuando exista una obligación legal o contractual para ello, y conforme a las presentes Políticas, con el fin de llevar a cabo las actividades que le permitan desarrollar su objeto, respetando los lineamientos de seguridad de la información desde la recolección, almacenamiento, uso, circulación y hasta su disposición final.
La base de datos de clientes, usuarios, tomadores, asegurados, beneficiarios, afiliados y pacientes hace referencia a la información requerida para efectos de prestar los servicios por parte de Aimedic en desarrollo de su objeto.
La base de datos de empleados y demás colaboradores tiene como fin mantener actualizada la información de los empleados y demás colaboradores de Aimedic para el adecuado desarrollo de la relación laboral o contractual establecida.
La base de datos de proveedores busca tener información actualizada y suficiente acerca de las personas naturales que tienen la calidad de proveedores o quisieran tenerla, para la contratación de sus servicios y efectuar los pagos correspondientes.
La base de datos de accionistas tiene como propósito contar con información actualizada acerca de las personas naturales que tengan la calidad de accionista, para llevar a cabo cualquier anotación u operación relacionada con tal calidad, la presentación de informes ante las entidades controlantes o vigilantes del Estado y dar cumplimiento a las obligaciones contraídas con el accionista.
Los datos administrados por Aimedic se conservan de acuerdo con los principios de necesidad y razonabilidad; de caducidad y temporalidad y con lo dispuesto en las normas especiales que regulan la conservación de documentos.
Finalidades del Tratamiento de Datos Personales:
Las finalidades del Tratamiento de Datos Personales tienen por objeto prestar los servicios contratados o a contratar y desarrollar las actividades empresariales de Aimedic, así como:
(i) Efectuar las gestiones pertinentes para el desarrollo de la etapa pre-contractual, contractual (incluida la afiliación, vinculación y ejecución de un contrato o servicio, según corresponda), y post-contractual de Aimedic, respecto de cualquiera de los servicios y/o productos ofrecidos por esta, que haya o no adquirido o respecto de cualquier relación comercial o contractual subyacente que tenga con la Compañía, terceros aliados o cuando así se requiera, así como para dar cumplimiento a la ley y las órdenes de autoridades judiciales o administrativas.
(ii) Realizar el tratamiento de los datos personales relacionados con el estado de salud y biométricos (datos sensibles), para lo cual se podrá responder facultativamente a las preguntas que versen sobre dichos datos, frente a los cuales el Titular no está obligado a autorizar su Tratamiento, para poder prestar los servicios, garantizar la seguridad de los bienes y de las personas que accedan a las instalaciones de Aimedic, realizar actividades propias del Sistema de Seguridad Social en Salud y/o Sistema de Seguridad Social en Riesgos Laborales, establecer condiciones de asegurabilidad, brindar coberturas del seguro, cumplir las normas que lo regulan, así como para realizar actividades propias del objeto social de Aimedic, incluidas pero sin limitarse a actividades corporativas, administrativas, verificación de identidad, autenticación de información, comercialización, petición, recaudo, cobranza y/o red de distribución.
(iii) Desarrollo y mejora de soluciones de Inteligencia Artificial: Utilizar los datos, incluyendo datos sensibles de salud, para el entrenamiento, validación y mejora continua de modelos de inteligencia artificial destinados a:
Apoyar en el análisis de información medica.
Personalizar respuestas de educación y recomendaciones de salud.
Optimizar la gestión de recursos en el sector salud.
Identificar patrones y tendencias para la prevención de enfermedades.
Generar análisis predictivos de riesgos de salud.
Proveer herramientas de soporte a la decisión clínica para profesionales de la salud.
Siempre que sea posible, se priorizará la anonimización o seudonimización de los datos para el desarrollo de estos modelos, garantizando la privacidad del Titular.
(iv) Gestionar trámites (solicitudes, quejas, reclamos, correspondencia), realizar análisis de riesgo (incluyendo el uso de modelos de inteligencia artificial), efectuar encuestas de satisfacción y calidad de servicios respecto de los bienes y servicios de Aimedic, así como a los aliados comerciales de Aimedic.
(v) Dar a conocer, transferir y/o transmitir los datos personales incluyendo datos sensibles, relacionados con el estado de salud y biométricos, dentro y fuera del país, a terceros a consecuencia de un contrato, ley o vínculo lícito que así lo requiera para actividades propias de la prestación del servicio y/o bien a suministrar o para implementar servicios de computación en la nube o servicios especializados de inteligencia artificial.
(vi) Consultar a cualquier prestador de servicios de salud, compañía de seguros, compañía de medicina prepagada o entidad promotoras de salud (EPS), centrales de riesgo, para que Aimedic acceda de ser pertinente y necesario, a la información de salud, asegurabilidad, así como a consultar información contenida en las bases de datos o archivos de alguna entidad para la adecuada prestación de servicios.
(vii) Contactar y enviar a través de medios telefónicos, electrónicos (SMS, chat, correo electrónico y demás medios considerados electrónicos), físicos, virtuales o personales, información relacionada con la prestación del servicio, de algún producto o servicio ofrecido por Aimedic; así como para realizar cambios o mejoras en el esquema de prestación de los servicios, avisos, propaganda, fidelización o publicidad sobre los productos y/o servicios, noticias, extractos, estados de cuenta, facturas con las obligaciones derivadas del contrato celebrado con Aimedic.
(viii) Suministrar información de contacto y documentos pertinentes a la fuerza comercial y/o red de distribución, telemercadeo, investigación de mercados, proveedores y prestadores, a la Compañía o a un tercero aliado en donde sea necesario, con el cual Aimedic tenga un vínculo lícito para poder desarrollar las actividades contratadas.
(ix) Acceder y consultar la información que repose o esté contenida en las bases de datos o archivos de cualquier entidad privada o pública (Ministerios, Departamentos Administrativos, DIAN, Fiscalía, Policía, Registraduría Nacional del Estado Civil, Juzgados, Tribunales, Cortes, listas restrictivas, entre otros), nacional o internacional.
(x) Suministrar a las asociaciones gremiales datos necesarios para la realización de estudios, y en general la administración de sistemas de información del sector salud, asegurador y financiero según aplique.
(xi) Crear y gestionar bases de datos (con datos sensibles, como lo son los datos de salud y biométricos) para fines estadísticos, de investigación, estudio de riesgos, desarrollo de productos o servicios y para las finalidades anteriormente mencionadas, incluyendo el desarrollo de modelos de inteligencia artificial.
(xii) Compartir datos personales propios y/o de terceros que requieran representación (menores de edad, quienes tendrán una protección reforzada), con la Compañía para funciones derivadas del objeto social, para lo cual es facultativo el autorizar su tratamiento y/o responder las preguntas relacionadas con datos sensibles.
(xiii) Ofrecer nuevos productos y/o servicios de Aimedic y/o compartir información con terceros con los cuales se tenga alguna alianza estratégica, atender reclamaciones, realizar encuestas de satisfacción o de calidad del servicio, y en general realizar cualquier gestión administrativa, comercial, así como programas de prevención y promoción de la salud.
(xiv) Realizar gestiones financieras, sin limitarse a registros de cobranza, trámites ante centrales de información o gestiones con intermediarios de seguros, reaseguradores (según aplique), análisis de riesgos y reporte de datos de comportamiento crediticio.
(xv) Realizar gestiones de seguridad, de video vigilancia (SV), de circuitos cerrados de televisión (CCTV), cámaras de seguridad, así como generar bases de datos, para garantizar la seguridad de los bienes y/o de las personas que acceden a las instalaciones de la Compañía, para utilizar dicha información en procesos legales, tales como investigaciones para prevención de actividades ilegales, procedimientos laborales, disciplinarios, civiles y penales, entre otros, así como para suministrar dicha información a la autoridad pública correspondiente.
(xvi) Suministrar información a terceros con los cuales Aimedic tenga relación contractual o comercial, cuando sea necesario o pertinente para cumplir con el objeto contratado, mejorar resultados o efectividad o por el desarrollo de alguna alianza estratégica.
(xvii) Adelantar los procesos de reconocimiento, pago de siniestros, trámites de pólizas de seguros (según aplique), tramitar servicios adicionales, cuando se hubiese pretendido suscribir, o haberse suscrito un contrato comercial o de seguro; y para (xviii) cumplir con las actividades autorizadas por la Constitución y la ley.
CAPÍTULO VII DEBERES EN CALIDAD DE RESPONSABLE Y ENCARGADO DEL TRATAMIENTO
Deberes en calidad de Responsable del Tratamiento.
Teniendo en cuenta que el Responsable de los datos personales es el que define o decide sobre las bases de datos y su tratamiento, Aimedic, según corresponda, actuará como Responsable y deberá cumplir con los siguientes deberes:
Solicitar y conservar, en las condiciones previstas en estas Políticas, copia o grabación de la respectiva autorización otorgada por el Titular.
Informar de manera clara y suficiente a los usuarios sobre la finalidad de la recolección y los derechos que le asisten por virtud de la autorización otorgada.
Garantizar al usuario, a través de los canales de atención establecidos en las presentes Políticas, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data, es decir, conocer, actualizar o rectificar sus datos personales.
Informar a solicitud del usuario sobre el uso dado a sus datos personales.
Tramitar las consultas y reclamos formulados en los términos señalados en las presentes Políticas.
Observar los principios de veracidad, calidad, seguridad y confidencialidad en los términos establecidos en las presentes Políticas.
Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
Actualizar la información objeto de Tratamiento, comunicando de forma oportuna al Encargado y/o demás personas interesadas, todas las novedades de los datos, adoptando las medidas necesarias con la finalidad de que en las bases de datos se almacene información que sea veraz, completa, exacta, actualizada, comprobable y comprensible.
Rectificar los datos personales cuando la información sea incorrecta y comunicar lo pertinente a quienes realicen el Tratamiento de los datos.
Adoptar un manual interno de políticas y procedimientos que permita garantizar la protección de los datos personales objeto de Tratamiento.
Suministrar al Encargado del tratamiento únicamente los datos personales que está autorizado a suministrar a terceros.
Garantizar que la información que se suministre al Encargado del tratamiento sea veraz, completa, exacta, actualizada, comprobable y comprensible.
Comunicar de forma oportuna al Encargado del tratamiento todas las novedades respecto de los datos que previamente le haya suministrado.
Exigir al Encargado del tratamiento, en todo momento, el respeto a las condiciones de seguridad y privacidad de la información del Titular.
Informar al Encargado del tratamiento cuando determinada información se encuentre en discusión por parte del Titular.
Informar que el uso de los datos corresponde al desarrollo de sus actividades.
Designar funcionarios idóneos para el manejo de la información personal, utilizando las medidas de seguridad implementadas para impedir la adulteración, pérdida, consulta o uso no autorizado.
Atender las instrucciones y requerimientos formulados por la Superintendencia de Industria y Comercio y/o cualquier otra autoridad judicial o administrativa en ejercicio de sus funciones legales.
Los demás que se encuentren previstos en las normas generales vigentes que regulan la materia.
Deberes en calidad de los Encargados del Tratamiento.
En los eventos en los que un tercero (persona natural o jurídica), con el cual Aimedic tenga una relación contractual, extracontractual, o cualquier tipo de alianza y en consecuencia realice el tratamiento o reciba datos para ser tratados en nombre de Aimedic, actuará en calidad de Encargado. El tercero y/o Aimedic, cuando esta última actúe como Encargada, deberá cumplir los siguientes deberes, sin perjuicio de las demás disposiciones previstas en la ley:
Establecer mecanismos para que el Responsable del tratamiento cuente con la autorización del Titular de los datos.
Garantizar al Titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data.
Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
Realizar oportunamente la actualización, rectificación o supresión de los datos.
Actualizar la información reportada por los Responsables del tratamiento dentro de los cinco (5) días hábiles contados a partir de su recibo.
Adoptar un manual interno de políticas y procedimientos que permita garantizar la protección de los datos personales objeto de Tratamiento.
Tramitar las consultas y los reclamos formulados por los Titulares en los términos señalados en las presente Políticas.
Registrar en la base de datos la leyenda "reclamo en trámite" en la forma en que se establece en la Ley.
Insertar en la base de datos la leyenda "información en discusión judicial" una vez notificado por parte de la autoridad competente sobre procesos judiciales relacionados con la calidad del dato personal.
Abstenerse de circular información que esté siendo controvertida por el Titular y cuyo bloqueo haya sido ordenado por la Superintendencia de Industria y Comercio.
Permitir el acceso a la información únicamente a las personas autorizadas por el usuario o facultadas por la ley para dicho efecto.
Informar a la Superintendencia de Industria y Comercio cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los usuarios.
Cumplir las instrucciones y requerimientos que imparta la Superintendencia de Industria y Comercio.
Los demás que se encuentren previstos en las normas generales vigentes que regulan la materia.
CAPÍTULO VIII RESPONSABLE DE LA ATENCIÓN A PETICIONES, CONSULTAS Y RECLAMOS
La persona o área responsable de la atención de peticiones, consultas y reclamos ante la cual el titular de la información puede ejercer los derechos a conocer, actualizar, rectificar, suprimir el dato y revocar la autorización, es el Área de Protección de Datos Personales de Aimedic, para lo cual se podrá remitir comunicación escrita a través del correo electrónico: info@aimedic.com.co y/o en la oficina de Aimedic en la dirección: Carrera 5 I # 48 m 11 o a través de la línea de atención al cliente que se defina.
El rol y correo electrónico antes mencionado será el contacto de los titulares de Datos Personales, para todos los efectos previstos en estas Políticas.
CAPÍTULO IX PROCEDIMIENTO PARA QUE LOS TITULARES DE LA INFORMACIÓN PUEDAN EJERCER LOS DERECHOS A CONOCER, ACTUALIZAR, RECTIFICAR, SUPRIMIR LA INFORMACIÓN Y REVOCAR LA AUTORIZACIÓN
Aimedic cuenta con mecanismos tecnológicos, humanos y administrativos que permiten atender de manera adecuada los requerimientos, peticiones, consultas, quejas y reclamos relativos al tratamiento de datos personales, con el fin de garantizar el ejercicio de los derechos contenidos para los Titulares en la Constitución y la ley, especialmente el derecho a conocer, actualizar, rectificar, suprimir información personal, así como el derecho a revocar el consentimiento otorgado para el tratamiento de datos personales, cuando no exista un deber legal o contractual del Titular de permanecer en las bases de datos administrados por Aimedic.
(i) Procedimiento de consultas para ejercer derechos de tratamiento de datos:
Debe tenerse en cuenta que para efectos de dar trámite a cualquier consulta que presenten las personas relacionadas con el Tratamiento de sus datos, se deberá validar la identidad del solicitante con la finalidad de corroborar que cuente con la facultad para presentar dicha solicitud, para lo cual la persona deberá acreditar que:
Es el Titular del dato, o alguno de sus causahabientes o de sus representantes legales.
Es la persona autorizada por el Titular del dato.
Es una autoridad judicial o administrativa con una orden administrativa o judicial.
Los Titulares deberán acreditar su identidad de la siguiente manera:
Tanto para solicitudes presentadas a través de documento escrito como las presentadas por correo electrónico se debe adjuntar copia de la cédula.
Los causahabientes deberán acreditar el parentesco adjuntando copia de la escritura donde se dé apertura a la sucesión y copia de su documento de identidad.
Los apoderados, deberán presentar copia auténtica del poder y de su documento de identidad.
Contenido requerido para realizar la consulta:
La solicitud debe estar dirigida a Aimedic y debe contener los siguientes datos:
Nombres y apellidos del Titular y/o su representante y/o causahabientes.
Número de identificación del Titular y de su representante de ser el caso.
El objeto de la consulta.
Datos de notificación del Titular: dirección física, electrónica y teléfono de contacto del Titular y de sus causahabientes o representantes.
Descripción de los hechos que dan lugar a la consulta (de ser necesarios).
Documentos que considere soportan su consulta (de ser necesarios).
Medio por el cual desea recibir respuesta.
Nombre del peticionario, el cual, si es diferente al Titular, debe adjuntar los documentos que le permitan actuar en su nombre.
Firma del peticionario.
Haber sido presentada por los canales de consulta habilitados por Aimedic a través del correo electrónico: info@aimedic.com.co y/o en la oficina de Aimedic en la dirección: Carrera 5 I # 48 m 11 o a través de la línea de atención al cliente que se defina.
Una vez recibida la solicitud radicada a través de los canales establecidos en el anterior numeral, el Área de Protección de Datos de Aimedic procederá a verificar que la solicitud contenga todas las especificaciones requeridas.
Para el efecto, revisará que la información aportada se encuentre completa y sea veraz y en caso de no cumplir con estos requisitos, se le informará dicha situación al solicitante dentro de los cinco (5) días hábiles siguientes al recibo de la solicitud, con el fin de que la información aportada se aclare o complemente.
Si revisado el documento aportado y el nombre del Titular encuentra que existe conformidad en los mismos, se procederá a dar respuesta a las solicitadas en un término máximo de diez (10) días hábiles (en adelante el "Término inicial") contados a partir de la fecha de su recibo.
En caso de imposibilidad de atender la consulta dentro del término inicial, se informará al Titular de tal situación antes del vencimiento del mismo, expresando los motivos de la demora y señalando la fecha en que se será atendida la consulta, la cual no podrá exceder de cinco (5) días hábiles contados desde la fecha de vencimiento del Término inicial.
(ii) Procedimiento de Reclamos para ejercer derechos de tratamiento de datos:
El Área de Protección de Datos Personales de Aimedic será el responsable de recibir y dar trámite a los reclamos remitidos, en los términos, plazos y condiciones establecidos en la Ley 1581 de 2012 y en las presentes Políticas.
Las reclamaciones presentadas deberán contener como la siguiente información:
Nombres y apellidos del Titular y/o su representante y/o causahabientes.
Número de identificación del Titular y de su representante de ser el caso.
Lo que se pretende reclamar o información a actualizar, rectificar, suprimir o revocar.
Datos de notificación del Titular: dirección física, electrónica y teléfono de contacto del Titular y de sus causahabientes o representantes.
Descripción de los hechos que dan lugar al reclamo.
Medio por el cual desea recibir respuesta.
Nombre del peticionario, el cual, si es diferente al Titular, debe adjuntar los documentos que le permitan actuar en su nombre.
Firma del reclamante.
Haber sido presentada por los canales de consulta habilitados por Aimedic a través del correo electrónico: info@aimedic.com.co 
Una vez recibido el reclamo radicado a través de los canales establecidos en el anterior numeral, el Área de Protección de Datos de Aimedic procederá a verificar que el reclamo contenga todas las especificaciones requeridas.
Cuando el Titular considere que la información contenida en una base de datos administrada por Aimedic debe ser objeto de corrección, actualización, supresión, o revocación, podrá presentar el reclamo ante el Área de Protección de Datos en los canales establecidos en el numeral 9 del procedimiento anterior.
En el evento en que el reclamo se encuentre incompleto lo informará al interesado dentro de los cinco (5) días hábiles siguientes a la recepción del reclamo, con el fin de que el solicitante subsane las fallas y presente la información o documentos faltantes. Transcurridos dos (2) meses desde la fecha del requerimiento sin que el solicitante presente la información requerida, se entenderá que ha desistido del reclamo. Una vez recibido el reclamo completo, se incluirá en la base de datos una leyenda que diga "reclamo en trámite" y el motivo del mismo, en un término no mayor a dos (2) días hábiles. Dicha leyenda deberá mantenerse hasta que el reclamo sea decidido.

Se procederá a dar respuesta en un término máximo de quince (15) días hábiles contados a partir del día siguiente a la fecha de su recibo.
Cuando no fuere posible atender el reclamo dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá su reclamo, la cual en ningún caso podrá superar los ocho (8) días hábiles siguientes al vencimiento del término inicial.
Si la Compañía a la cual se envió el reclamo no es la entidad competente para resolverlo, por corresponder a otra entidad, dará traslado del mismo a quien corresponda en un término máximo de dos (2) días hábiles contados desde la recepción, si el nuevo Responsable es identificable; e informará de la situación al interesado para que pueda hacer seguimiento o identifique claramente la entidad a la cual debe dirigirse.
(iii) Procedimiento de Supresión de Datos Personales:
De resultar procedente la reclamación de supresión de los datos personales del Titular de la base de datos se deberá realizar operativamente la supresión, de tal manera que la eliminación no permita la recuperación de la información. No obstante, el Titular deberá tener en cuenta que, si tiene alguna relación vigente con Aimedic, la información podrá permanecer en registros históricos o por cumplimiento de deberes legales, conforme al periodo de vigencia de la base de datos establecido al final del presente documento, por lo que su supresión versará frente al tratamiento activo de los mismos y de acuerdo a la ley.
(iv) Quejas ante la Superintendencia de Industria y Comercio:
El Titular, causahabiente o apoderado deberá agotar en primer lugar el trámite de consultas o reclamos previsto en las presentes Políticas, antes de dirigirse a la Superintendencia de Industria y Comercio a formular una queja.
(v) Inconformidad con la respuesta de la consulta o reclamo:
Si no hay conformidad con la respuesta emitida, el Titular puede solicitar reconsideración directamente a Aimedic, cumpliendo nuevamente con los pasos definidos en este procedimiento.
(vi) Costos del trámite:
El Titular podrá consultar de forma gratuita sus datos personales al menos una vez cada mes calendario o cada vez que existan modificaciones sustanciales de las Políticas que motiven nuevas consultas.
Para consultas cuya periodicidad sea mayor a una por cada mes calendario, Aimedic podrá cobrar al Titular los gastos de envío, reproducción o certificación de documentos.
CAPÍTULO X SEGURIDAD DE LA INFORMACIÓN.
Aimedic cuenta con políticas y normas de Seguridad de la Información, las cuales podrán ser informadas al Titular por solicitud de este último, que permiten que la información mantenga su disponibilidad, integridad y confidencialidad, buscando protegerla de adulteración, pérdida o acceso no autorizado o fraudulento.
Aimedic podrá conservar los datos personales de los titulares de la información en bases de datos ubicadas en Colombia o en el extranjero, cumpliendo con la finalidad autorizada por el Titular de los datos, y utilizando medidas de seguridad adecuadas que permitan mantener la información de manera segura, salvaguardando su integridad y confidencialidad.
Los datos personales tratados por Aimedic y los datos personales sensibles serán administrados y tratados con adecuadas medidas de seguridad y confidencialidad, conforme a la legislación y reglamentación aplicable, y para el caso de los datos personales contenidos en historias clínicas, se estará a lo dispuesto en la Ley 23 de 1981, Resolución 1995 de 1999 del Ministerio de Salud y demás normas que lo modifiquen, complementen o adicionen. En relación con los demás datos, incluyendo los datos sensibles diferentes a la historia clínica, serán protegidos mediante el uso de mecanismos tecnológicos y físicos adecuados, con especial énfasis en la protección de datos utilizados para el desarrollo y operación de soluciones de inteligencia artificial en el sector salud.
CAPÍTULO XI TRANSMISIÓN Y TRANSFERENCIA DE DATOS PERSONALES
Transmisión de datos personales
Aimedic podrá transmitir, todos o parte de los datos personales de los Titulares de la información a terceros autorizados de acuerdo con la legislación colombiana para la realización de actividades y prestación de servicios médicos, de desarrollo de soluciones de inteligencia artificial, así como a sus empleados, contratistas, prestadores de servicios, proveedores, distribuidores y/o asesores y demás colaboradores, para efectos de la prestación de servicios de salud, para ofrecer nuevos productos o servicios de Aimedic y/o compartir datos con terceros con los cuales se tengan alianzas o vínculos lícitos relacionados con sus actividades comerciales, o para la ejecución del objeto social de la respectiva empresa, quienes estarán obligados a dar tratamiento a esos datos personales conforme a las finalidades y usos previstos en la autorización otorgada por los Titulares y las presentes Políticas. Aimedic también podrá transferir y/o transmitir sus datos personales a cualquier adquirente de la empresa, así como a cualquier subsidiaria y/o división o negocio de Aimedic.
Transferencia internacional de datos personales
Cuando se transfieran datos personales a otro país será imprescindible contar con la autorización del Titular de la información que es objeto de transferencia, salvo que la ley disponga lo contrario. En este sentido, antes de enviar datos personales a otro país, Aimedic verificará que se cuenta con la autorización previa, expresa e inequívoca del Titular que permita transferir sus datos personales. Se precisa que en los casos de urgencia médica o sanitaria no se requiere autorización de acuerdo con lo establecido en el artículo 10 de la Ley 1581 de 2012.
La transferencia de datos personales se podrá realizar únicamente con terceros con quienes Aimedic tenga un vínculo contractual, comercial y/o jurídico, y que ofrezcan niveles de seguridad y protección de datos equivalentes o superiores a los exigidos por la legislación colombiana, especialmente para el tratamiento de datos sensibles en el contexto de la inteligencia artificial.



CAPÍTULO XII MODIFICACIÓN Y/O ACTUALIZACIÓN DE LAS POLÍTICAS DE PROTECCIÓN DE DATOS Y MANEJO DE INFORMACIÓN
Teniendo en cuenta que éstas Políticas se encuentran publicada en la página web de www.aimedic.com.co (o la que se defina para tal fin); cualquier cambio sustancial en éstas será informado a través de este mismo medio. En todo caso en la medida en que se creen nuevas páginas web de Aimedic, allí también serán incluidas estas Políticas y se surtirá la notificación ante cualquier cambio sustancial de las mismas.
Vigencia
Fecha de entrada en vigor de las Políticas de Tratamiento de la Información:
La vigencia de estas Políticas inició a partir del [Fecha de inicio de vigencia, e.g., 01 de mayo de 2024] como cumplimiento a la Ley 1581 de 2012.
Periodo de vigencia de la base de datos:
La Información suministrada por los titulares permanecerá almacenada por el tiempo que sea determinado por el titular o establecido por ley para el cumplimiento de los fines para los cuales fue incorporada, o durante el periodo que subsista la relación con la Compañía y cinco (5) años más.
CAPÍTULO XIII LINEAMIENTOS ESPECÍFICOS PARA EL TRATAMIENTO DE DATOS PERSONALES EN SISTEMAS DE INTELIGENCIA ARTIFICIAL (IA)
Aimedic, en su rol de Responsable del Tratamiento y desarrollador de soluciones de Inteligencia Artificial en el sector salud, se compromete a dar estricto cumplimiento a los lineamientos establecidos por la Superintendencia de Industria y Comercio (SIC) en su Circular Externa No. 002 de 2024, así como a la Ley Estatutaria 1581 de 2012 y demás normatividad aplicable.
El tratamiento de datos personales en los sistemas de IA de Aimedic se realizará bajo los siguientes principios y directrices:
1. Ponderación de Criterios para el Tratamiento en IA:
El tratamiento de Datos personales en los sistemas de IA de Aimedic se fundamenta en una ponderación rigurosa de cuatro criterios esenciales para salvaguardar los principios de protección de datos:
* Idoneidad: El tratamiento de datos es capaz de alcanzar el objetivo propuesto por la solución de IA.
* Necesidad: No existe otra medida menos invasiva o igualmente eficaz para lograr el objetivo de la solución de IA, en cuanto al impacto en la protección de Datos personales.
* Razonabilidad: El tratamiento de datos está orientado a cumplir finalidades constitucionales y legales, siempre en beneficio de la salud y el bienestar de los Titulares.
* Proporcionalidad en sentido estricto: Las ventajas obtenidas por el uso de la IA no superarán las desventajas que puedan afectar el derecho fundamental al Habeas Data de los Titulares.
2. Principio de Precaución y Abstención:
En caso de presentarse falta de certeza frente a los potenciales daños que pueda causar el Tratamiento de Datos personales en un sistema de IA, y con miras a evitar que se cause un daño grave e irreversible, Aimedic se abstendrá de realizar dicho Tratamiento o adoptará medidas precautorias y preventivas robustas para proteger los derechos del Titular del dato, su dignidad y otros derechos humanos.
3. Identificación y Clasificación de Riesgos en IA:
Aimedic implementará sistemas de administración de riesgos asociados al tratamiento de datos personales en IA. Esto incluye la identificación, medición, control y monitoreo de todos los hechos o situaciones que puedan incidir en la debida administración del riesgo, tales como:
* Sesgos algorítmicos.
* Fallas técnicas.
* Vulnerabilidades de seguridad.
* Errores en la implementación de los modelos de IA.
* Estos riesgos serán gestionados de manera proactiva y proporcional a la gravedad de los eventuales daños.
4. Estudio de Impacto de Privacidad (PIA) para IA:
Previo al diseño y desarrollo de soluciones de IA, y en la medida en que sea probable que los productos realizados a través de dichas técnicas entrañen un alto riesgo de afectación a los Titulares de la información, Aimedic efectuará y documentará un Estudio de Impacto de Privacidad. Este estudio, como mínimo, contendrá:
* Una descripción detallada de las operaciones de Tratamiento de Datos personales.
* Una evaluación de los riesgos específicos para los derechos y libertades de los Titulares de los Datos personales, incluyendo su identificación y clasificación.
* Las medidas previstas para evitar la materialización de los riesgos, incluyendo medidas de seguridad, diseño de software, tecnologías y mecanismos que garanticen la protección de Datos personales, considerando los derechos e intereses legítimos de los Titulares y otras personas que puedan resultar afectadas.
5. Calidad de los Datos en Sistemas de IA:
Los Datos personales sujetos a Tratamiento en los sistemas de IA de Aimedic deben ser veraces, completos, exactos, actualizados, comprobables y comprensibles. Se prohíbe el tratamiento de datos personales parciales, incompletos, fraccionados o que induzcan a error, garantizando la integridad de los datos utilizados para el entrenamiento y operación de los modelos de IA.
6. Seguridad de la Información en IA:
Para cumplir con el principio de seguridad en el desarrollo y despliegue de la IA, Aimedic adoptará medidas tecnológicas, humanas, administrativas, físicas y contractuales robustas para evitar:
* El acceso indebido o no autorizado a los Datos personales.
* La manipulación de la información.
* La destrucción de la información.
* El uso indebido o no autorizado de la información.
* La circulación o suministro de la información a personas no autorizadas.
* Todas las medidas de seguridad implementadas serán auditables por las autoridades competentes para su evaluación y mejora continua.
7. Derecho a la Información en IA:
Aimedic garantizará el derecho de los Titulares de la información a obtener, en cualquier momento y sin restricciones, información acerca del Tratamiento de sus Datos personales en los sistemas de IA, de manera clara y comprensible.
8. Datos Accesibles al Público y su Tratamiento en IA:
Aimedic reconoce que la información personal que es "accesible al público" no es, per se, información "de naturaleza pública" para fines de IA. El hecho de que los datos estén disponibles en internet no significa que cualquier persona pueda tratarlos sin autorización previa, expresa e informada del Titular del Dato para el entrenamiento o uso en sistemas de IA. Aimedic no se apropiará ni tratará datos privados, semiprivados o sensibles obtenidos de internet sin la autorización previa, expresa e informada del Titular.
9. Cumplimiento de Derechos en Sistemas de IA:
El Tratamiento de Datos personales que se realice en sistemas de IA preverá estrategias pertinentes, eficientes y demostrables para garantizar el cumplimiento de todos los derechos de los Titulares de la información establecidos en las leyes estatutarias 1266 de 2008 y 1581 de 2012 y sus decretos reglamentarios.



Términos y condiciones de uso

1.	 Aceptación de los Términos: Estos términos junto a la política de privacidad establecen los términos según el cual el paciente puede usar la aplicación "asistente virtual". Al usar este asistente virtual, el paciente acepta haber leído y comprendido estos términos y por lo tanto declara y garantiza que tiene la potestad para aceptarlos y dar cumplimiento a los mismos. 
2.	Licencia: AIMEIC otorga al usuario una licencia limitada, revocable, no exclusiva e intransferible para usar las funciones del asistente virtual. Esta licencia no permite al usuario su comercialización, subarriendo o sublicencia. El uso de dichas funciones está estrictamente sujeto al cumplimiento por parte del paciente de toda la normativa aplicable y de los presentes Término
3.	Acceso y uso:  El asistente virtual utiliza inteligencia artificial (IA) para responder las preguntas frecuentes del usuario y proporcionar orientación sobre la enfermedad del usuario.
	Para este fin, el usuario podrá realizar las consultas necesarias y el asistente proporcionará información educativa sobre la patología, tratamientos disponibles, efectos secundarios y estrategias de autocuidado, entre otros temas relevantes.
	
	El asistente se nutre de un modelo conversacional dinámico desarrollado mediante la ingesta de información validada proveniente de múltiples fuentes. Esto garantiza que las respuestas estén fundamentadas en conocimiento médico actualizado, extraído de guías clínicas, artículos científicos y bases de datos aprobadas por profesionales de la salud.
	
	Se establecerán puntos de control a lo largo del flujo conversacional para identificar y mitigar posibles sesgos que puedan afectar a pacientes con discapacidades o condiciones específicas, conforme a las recomendaciones de la Organización Mundial de la Salud (OMS).
	
El asistente virtual estará disponible de forma ininterrumpida (24 horas al día, 7 días a la semana).
4.	Propiedad Intelectual: 
•	Contenido del Usuario: Usted conserva todos los derechos de propiedad intelectual sobre el contenido (datos, información, imágenes, etc.) que proporciona a los Servicios de IA ("Contenido de Entrada"). Al utilizar los servicios, usted otorga a Aimedic una licencia mundial, no exclusiva, libre de regalías y transferible para usar, procesar y almacenar su Contenido de Entrada con el único fin de prestarle y mejorar los Servicios de IA, de acuerdo con nuestra Política de Tratamiento de Datos Personales.
•	Contenido Generado: Aimedic no reclama la propiedad del contenido original que usted crea y obtiene a través de los Servicios de IA ("Contenido Generado"). Sujeto a estos términos y a nuestra política, usted puede utilizar el Contenido Generado para cualquier fin, incluido el comercial, siempre y cuando cumpla con la legislación aplicable y no incurra en los usos prohibidos. No obstante, Aimedic se reserva el derecho de generar contenido igual o similar para otros usuarios, y el Contenido Generado puede no ser único.
•	Servicios de Aimedic: Usted reconoce que todos los derechos, títulos e intereses sobre los Servicios de IA (incluyendo, pero no limitado a, los modelos, algoritmos, software y marcas) son y seguirán siendo propiedad exclusiva de Aimedic.
5.	Confidencialidad y Uso de Datos para Mejora del Servicio Aimedic se compromete a mantener la confidencialidad de sus datos sensibles, de acuerdo con el CAPÍTULO X: SEGURIDAD DE LA INFORMACIÓN. Para la mejora continua de nuestros algoritmos, podremos utilizar datos derivados del uso del servicio. Este uso se realizará siempre sobre datos anonimizados o seudonimizados, de forma que no sea posible identificar a un Titular específico, en cumplimiento con el CAPÍTULO VI, numeral (iii) de esta política. Usted no debe proporcionar información personal identificable o datos sensibles que no sean estrictamente necesarios para el uso del servicio.
6.	Exclusión de Garantías:  Llos servicios de IA se proporcionan "tal cual" y "según disponibilidad", sin garantías de ningún tipo, ya sean expresas o implícitas.  AIMEDIC no garantiza que los servicios de IA: (a) sean precisos, completos, confiables o libres de errores; (b) estén siempre disponibles o funcionen sin interrupciones; o (c) satisfagan sus necesidades específicas. el uso que usted haga de los servicios de IA es bajo su propio riesgo y responsabilidad. 
	Limitación de Responsabilidad:  Een la máxima medida permitida por la ley aplicable, AIMEDIC, sus directores, empleados o afiliados no serán responsables en ningún caso por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, sin limitación, pérdida de beneficios, datos, o cualquier daño derivado de: (i) su acceso o uso o la imposibilidad de acceder o utilizar los servicios de IA; (ii) cualquier contenido generado obtenido a través de los servicios; (iii) cualquier decisión clínica, diagnóstico, tratamiento o falta de este, basado en el contenido generado. 
7.	Lla responsabilidad total de AIMEDIC ante usted por todas las reclamaciones relacionadas con los servicios de IA no excederá, en ningún caso, el importe que usted haya pagado a AIMEDIC por el uso de los servicios durante los tres (3) meses anteriores al evento que dio lugar a la reclamación. 
La Institución de Salud aliada (en caso de que aplique) no asume ninguna responsabilidad en virtud de esta cláusula.
8.	Indemnización: El usuario  Usted se compromete a defender, indemnizar y mantener indemne a AIMEDIC, a la institución de salud aliada (en caso de que aplique),  y a sus licenciatarios y licenciantes, y a sus empleados, contratistas, agentes, directivos y directores, de y contra cualquier reclamación, daño, obligación, pérdida, responsabilidad, costo o deuda y gastos (incluidos, entre otros, los honorarios de abogados) que se deriven de: a) su uso y acceso a los Servicios de IA, incluido cualquier dato o contenido transmitido o recibido por usted; b) su incumplimiento violación de cualquier término de esta Política; c) su violación de cualquier derecho de terceros, incluido, entre otros, los cualquier derechos dea la privacidad o a la propiedad intelectual.
9.	Contacto: Para cualquier consulta, queja, petición frente al asistente viritual o a los términos y condiciones aquí descritos o frente a la política de privacidad por favor contactarse al correo : 
10.	Modificación a los términos y condiciones: AIMEDIC podrá modificar estos términos y condiciones en cualquier momento y los mismos serán publicados en la aplicación del asistente virtual. `;

  // Función para formatear el texto
  const formatText = (text: string) => {
    const lines = text.split('\n');
    const formatted: React.ReactElement[] = [];
    let currentParagraph: string[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Detectar capítulos
      if (trimmedLine.startsWith('CAPÍTULO')) {
        if (currentParagraph.length > 0) {
          formatted.push(
            <p key={`p-${index}`} className={styles.paragraph}>
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        // Extraer el número y nombre del capítulo para el data-section
        const chapterMatch = trimmedLine.match(/CAPÍTULO\s+([IVX]+)\s+(.+)/);
        const chapterId = chapterMatch ? `CAPITULO-${chapterMatch[1]}` : `chapter-${index}`;
        formatted.push(
          <h2
            key={`h2-${index}`}
            className={styles.chapter}
            data-section={chapterId}
            id={chapterId}
          >
            {trimmedLine}
          </h2>
        );
        return;
      }

      // Detectar títulos principales
      if (trimmedLine && !trimmedLine.startsWith('(') && trimmedLine.length > 0 && trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length < 100) {
        if (currentParagraph.length > 0) {
          formatted.push(
            <p key={`p-${index}`} className={styles.paragraph}>
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        formatted.push(
          <h3 key={`h3-${index}`} className={styles.sectionTitle}>
            {trimmedLine}
          </h3>
        );
        return;
      }

      // Detectar listas numeradas
      if (/^\d+\./.test(trimmedLine) || /^\([ivx]+\)/.test(trimmedLine)) {
        if (currentParagraph.length > 0) {
          formatted.push(
            <p key={`p-${index}`} className={styles.paragraph}>
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        formatted.push(
          <p key={`list-${index}`} className={styles.listItem}>
            {trimmedLine}
          </p>
        );
        return;
      }

      // Detectar viñetas
      if (trimmedLine.startsWith('*') || trimmedLine.startsWith('•')) {
        if (currentParagraph.length > 0) {
          formatted.push(
            <p key={`p-${index}`} className={styles.paragraph}>
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        formatted.push(
          <p key={`bullet-${index}`} className={styles.bulletItem}>
            {trimmedLine}
          </p>
        );
        return;
      }

      // Párrafos normales
      if (trimmedLine.length > 0) {
        currentParagraph.push(trimmedLine);
      } else if (currentParagraph.length > 0) {
        formatted.push(
          <p key={`p-${index}`} className={styles.paragraph}>
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    });

    // Agregar el último párrafo si existe
    if (currentParagraph.length > 0) {
      formatted.push(
        <p key="p-final" className={styles.paragraph}>
          {currentParagraph.join(' ')}
        </p>
      );
    }

    return formatted;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={scrollToSection ? "Autorización de Datos Personales" : "Términos y Condiciones"}
      size="xl"
    >
      <div ref={contentRef} className={styles.content}>
        {formatText(termsContent)}
      </div>
    </Modal>
  );
};

