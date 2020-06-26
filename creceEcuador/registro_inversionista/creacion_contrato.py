
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.rl_config import defaultPageSize
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, Spacer, TableStyle


DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Domingo"]
SECCIONES = ['ANTECEDENTES','OBJETO DEL PRESENTE ACUERDO', 'SISTEMA DE ADJUDICACIÓN DEL FINANCIAMIENTO', 'ROL DE CRECE ECUADOR', 'PROCEDIMIENTO DE INVERSIÓN', 'CÁLCULO, COBRO Y PAGO DE CUOTAS', 
            'REGLAS DE LA MORA EN EL PAGO DE LAS CUOTAS', 'OBLIGACIONES Y PROHIBICIONES DEL INVERSIONISTA', 'MANDATO Y OTRAS AUTORIZACIONES', 'MODIFICACIÓN DEL CONTRATO', 'DURACIÓN DEL CONTRATO', 
            'TERMINACIÓN ANTICIPADA DEL CONTRATO', 'DE LAS COMISIONES Y OTROS RECARGOS POR USO DE PLATAFORMA', 'LEY APLICABLE Y TRIBUNAL COMPETENTE',
            'COMUNICACIONES', 'DECLARACIÓN Y ACEPTACIÓN']
SECCIONES_IX = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI']
TITULO_CONTRATO = 'ACUERDOS ESPECÍFICOS DE USO DEL SITIO WEB  USUARIO INVERSIONISTA'
SUBTITULO_CONTRATO = 'www.creceecuador.com'
PRE_ANTECEDENTE = '''De acuerdo con la cláusula quinta de los Términos y Condiciones Generales del Uso de la plataforma de CRECE ECUADOR,
 el usuario INVERSIONISTA ACEPTA los siguientes ACUERDOS ESPECÍFICOS:'''
ANTECEDENTES = [
'1. PROSPERAECU S.A. administra una plataforma de financiamiento colaborativa, en adelante el “Sitio”, cuyo objetivo es facilitar el encuentro online entre personas o empresas que desean invertir, los “Inversionistas”, y personas o empresas que necesitan financiamiento para desarrollar sus emprendimientos, los “Solicitantes”. El Inversionista puede elegir una o más Solicitudes de Financiamiento disponibles en la Plataforma, pudiendo invertir en conjunto con otros inversionistas.',
'2. Las condiciones y términos comerciales de los financiamientos publicados varían según el tipo de financiamiento y en cada caso, según lo que acuerden – exclusivamente - los Inversionistas del financiamiento respectivo y los Solicitantes. Las condiciones y términos de cada solicitud de financiamiento serán informadas al Inversionista mediante mail al  correo electrónico designado por el usuario al momento de registrarse en la plataforma y  a través de publicaciones en la Plataforma, las que se mantendrán vigentes una vez publicadas respecto de cada financiamiento en particular.',
'3. Todos los términos que no sean definidos en el Contrato, tendrán el significado que aparece en el documento denominado TÉRMINOS LEGALES Y CONDICIONES GENERALES DE USO DEL SITIO WEB WWW.CRECEECUADOR.COM'
]

REGLAS_GENERALES = [
'a.\t El método de inversión será vía transferencia electrónica o depósito bancario a una Institución del sistema financiero de acuerdo a las condiciones que CRECE ECUADOR defina. Quedará a potestad de PROSPERAECU S.A. autorizar inversiones que se realicen por otros medios.',
'b \t La adjudicación del financiamiento será realizada por orden de llegada de los fondos de  inversionistas a la cuenta Escrow del Solicitante. Para ello, el inversionista deberá informar a CRECE del depósito realizado enviando comprobante de transacción a info@creceecuador.com o según se indique en la plataforma al momento de realizar el compromiso de inversión.',
'c.\t Una vez adjudicada la participación en una operación, el inversionista no podrá realizar el retiro de sus fondos bajo ninguna circunstancia. Solo se permitirá el retiro de fondos transferidos a la cuenta Escrow del Solicitante en casos analizados y aprobados por PROSPERAECU S.A. a los cuales se aplicará un cargo por rescate del 10% del valor depositado por el incumplimiento del compromiso de Inversión.',
'd.\t En caso de  que un inversionista transfiera fondos a una cuenta Escrow de Solicitante en una operación que ya ha sido financiada al 100%  por otros Inversionistas, dichos fondos excedentes se devolverán al Inversionista descontando los cargos aplicados por la entidad bancaria por la devolución de los fondos al Inversionista.',
'e.\t Las solicitudes de financiamiento serán financiadas por un mínimo de dos inversionistas. Ninguna solicitud de financiamiento podrá ser inferior a USD 2000 (dos mil dólares de  los Estados Unidos de Norteamérica).',
'f.\t Un inversionista podrá financiar un proyecto hasta el 90% del valor de la solicitud de financiamiento publicada en la plataforma.',
'g \t La Solicitud de Financiamiento podrá cerrarse antes de completar el 100% del monto publicado a financiar. Nunca por menos del 70% del monto publicado a financiar.', 
'h.\t El Inversionista será notificado una vez cursado la operación de financiamiento.',
'i.\t Cobro por uso de Plataforma: Crece Ecuador cobrará un honorario al Inversionista a un porcentaje del capital pagado al Inversionista, que se calculará dependiendo del tipo de financiamiento en el que se ha invertido, todo de acuerdo a lo publicado en la Plataforma respecto de cada Solicitud de Financiamiento y conforme se encuentra establecido en la cláusula décimo noveno del Contrato de Términos Legales y Condiciones Generales de Uso del Sitio  Web. Este cobro se descontará al momento del pago de cada cuota del financiamiento respectivo a la cuenta bancaria asignada para cada operación. Todos los cobros por este concepto serán facturados al Inversionista de forma mensual y única el último día del mes.',
'j.\t Cada Solicitud de Financiamiento tendrá sus propias condiciones, tales como monto, plazo, tasa de interés, respaldos exigidos, dependiendo del tipo de financiamiento, todas las cuales serán publicadas en la Plataforma, junto con los cobros asociados a favor de Crece Ecuador.',
'k.\t Para dar por iniciada la participación del inversionista en una operación deberá aceptar el presente acuerdo  directamente de la plataforma de Crece Ecuador y haber realizado la transferencia o depósito bancario del valor a invertir en la cuenta Escrow del Solicitante en la institución bancaria designada por Prosperaecu S.A. / Crece Ecuador para la operación. Prosperaecu S.A. / Crece Ecuador verificará el cumplimiento de estas condiciones previo a continuar con el proceso correspondiente.',
'l.\t Si una operación no se completa dentro del plazo de 60 días contados a partir de la transferencia de fondos a la cuenta bancaria designada para la operación, se devolverá a los inversionistas la totalidad de los fondos menos el cargo por la transferencia que realiza la entidad bancaria.',
'm.\t Todo usuario Inversionista deberá tener una cuenta bancaria a su nombre para recibir los pagos de los solicitantes, por lo que, sin perjuicio de luego solicitar a Crece Ecuador una modificación de la cuenta bancaria donde deben realizarse estos pagos, deberá elegir una de las siguientes opciones:'
]
OPCIONES = [
'1. \t \t Abrir una cuenta Escrow en el banco designado por Crece Ecuador para el correcto funcionamiento de la operación de financiamiento colaborativo. El propietario de la cuenta será el inversionista y Prosperaecu S.A. / Crece  Ecuador será  gestor de la cuenta que se apertura y contará con firma autorizada. Dicha cuenta se usará para recibir los pagos de las operaciones vigentes desde la cuenta Escrow del Solicitante y de ser requerido por el Inversionista, para futuras operaciones de financiamiento colaborativo. Si el Inversionista elige esta opción el banco no aplicará ningún recargo por transferencia al momento de recibir los dividendos pagados por el solicitante.', 
'2. \t \t Usar una cuenta bancaria ya existente a nombre del Inversionista en un banco diferente al designado por Crece Ecuador. Si el inversionista elige esta opción el banco deducirá del valor del dividendo correspondiente el recargo o comisión aplicable por transferencia interbancaria que se encuentre vigente al momento.'
]


DECLARACION_ACEPTACION = """
Por este acto el Inversionista declara expresamente haber leído y aceptado los Acuerdos Específicos de Uso de la Web de usuario Inversionista que constan en el presente contrato y de sus anexos, aceptando expresa, inequívoca e irrevocablemente el presente Contrato y sus anexos, el que será digitalizado, quedando respaldado en la base de datos de Crece Ecuador y será accesible al Usuario en su Perfil de Usuario.\n
Al aceptar la opción “He leído y aceptado los Acuerdos Específicos de uso de la Web Usuario Inversionista”, ubicado al final del Contrato, el Inversionista otorga su expreso consentimiento a este Contrato.\n
A su vez, el Inversionista, en este acto, declara haber leído, comprendido y aceptado todas las políticas de Crece Ecuador publicadas en la Plataforma, las cuales podrán ser modificadas por Crece Ecuador las veces que éste lo estime conveniente y a su sola discreción, previa comunicación de las mismas a los Usuarios.\n
Este Acuerdo Específico y mandato ha sido firmado electrónicamente por {nombre}, cédula de identidad - {cedula}, 
el día {dia}, {fecha} a las {hora}:{minutos}:{segundos}
"""









def current_date_format(date):
    months = ("Enero", "Febrero", "Marzo", "Abri", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
    day = date.day
    month = months[date.month - 1]
    year = date.year
    messsage = "{} de {} del {}".format(day, month, year)

    return messsage

def hacer_contrato_uso_sitio(doc, usuario, fecha, date):
   
    
    styles=getSampleStyleSheet()
    #Titulo
    Story=[Paragraph(TITULO_CONTRATO, styles['Title'])]
    Story.append(Spacer(1, 0.2*inch))
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
    styles.add(ParagraphStyle(name='center', alignment=TA_CENTER))
    # Story=[Paragraph(SUBTITULO_CONTRATO, styles['Justify'])]
    ptext = '<b><u>'+SUBTITULO_CONTRATO+'</u></b>'
    Story.append(Paragraph(ptext, styles['center']))
    Story.append(Spacer(1, 0.2*inch))
    

    ptext = PRE_ANTECEDENTE
    agregar_parrafo(Story, ptext, styles)

    # I
    SECCION = 0
    agregar_SECCION(Story, SECCION, styles)


    for i in range(len(ANTECEDENTES)):
        ptext = ANTECEDENTES[i]
        Story.append(Paragraph(ptext, styles["Justify"]))
        Story.append(Spacer(1, 0.2*inch))

    #II
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    
    ptext = 'Por el presente  contrato, se regulan y definen los acuerdos específicos de términos y condiciones de uso de la plataforma virtual de Crece Ecuador en calidad de Inversionista.'
    agregar_parrafo(Story, ptext, styles)

    #III
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)

    ptext = '1. De las reglas generales:'
    agregar_subtitulo(Story, ptext, styles)

    for i in range(len(REGLAS_GENERALES)):
        ptext = REGLAS_GENERALES[i]
        Story.append(Paragraph(ptext, styles["Justify"]))
        Story.append(Spacer(1, 0.2*inch))
    for i in range(len(OPCIONES)):
        ptext = OPCIONES[i]
        Story.append(Paragraph(ptext, styles["Justify"]))
        Story.append(Spacer(1, 0.2*inch))

    ptext = '2. De las reglas del financiamiento colaborativo:'
    agregar_subtitulo(Story, ptext, styles)
    ptext= """
a. Las condiciones de las Solicitudes de Financiamiento publicadas en la Plataforma serán convenidas exclusivamente entre el Inversionista y el Solicitante. Conforme a lo anterior, el Inversionista declara conocer y aceptar que Prosperaecu SA. / Crece Ecuador no es ni será considerada como parte en el contrato de crowdfunding, cesión de créditos u otro contrato que celebre usando la plataforma de Crece Ecuador.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
b. El Solicitante definirá previamente la tasa de interés del crédito, expresada como tasa nominal anual, cuyo límite superior será la tasa de interés máxima convencional a la fecha de la solicitud.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
c. Las solicitudes de crédito publicados en la Plataforma y adjudicadas a los Inversionistas serán documentados en uno o más pagarés, cuando el tipo de financiamiento así lo requiera, a nombre de cada uno de los Inversionistas respectivos (el “Pagaré”). Todo Pagaré y contrato de operación de crédito deberá ser suscrito por el Solicitante y sus garantes solidarios. Finalizado el proceso de cierre de la Solicitud de Financiamiento, el Solicitante firmará un Pagaré a nombre de cada uno de los inversionistas que participan en el crédito respectivo, para aquellas operaciones cuyo financiamiento así lo requiera, dentro de los 5 días hábiles bancarios siguientes a la confirmación de la operación.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
d. Toda garantía que el solicitante ofrezca para la operación será analizada y se informará al Inversionista quien decidirá exclusivamente sobre aquello.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
e. Los fondos podrán ser entregados al Solicitante durante el proceso de cierre de la Solicitud de Financiamiento si éste ya ha suscrito la documentación respectiva.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
f. Todos los gastos asociados al crédito (gastos notariales, seguros, impuestos, tasas, entre otros) serán de cargo del Solicitante.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
g. Si el Inversionista no se adjudica el crédito o, si por cualquier razón ajena al Inversionista, el crédito no se cursa, los fondos invertidos y retenidos inicialmente a título de derechos por adjudicación del crédito serán liberados en la cuenta Escrow del Solicitante y transferidos a la cuenta Escrow del Inversionista para futuras operaciones de financiamiento colaborativo o el Inversionista podrá requerir el reembolso de los mismos menos el cargo por transferencia en la cuenta bancaria que el Inversionista designe para el efecto.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
h. El crédito documentado en el Pagaré devengará intereses desde la fecha de su suscripción a menos que los participantes  de mutuo acuerdo decidan lo contrario.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
i. Cada Pagaré establecerá los intereses moratorios correspondientes.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
j. Durante el plazo de vigencia del crédito, el Solicitante se obliga a que el Pagaré respectivo sea válido, vinculante y ejecutable.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
k. El calendario de pago del crédito será publicado en la Plataforma una vez firmado el Pagaré, será reflejado en el Pagaré y en el contrato de la operación.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
l. El Solicitante no podrá cambiar la fecha de vencimiento de las cuotas, salvo con el acuerdo expreso y por escrito de todos los Inversionistas del crédito. El Solicitante podrá realizar pagos anticipados de cuotas, según se indica en el siguiente literal, debiendo ser pagados por el Solicitante directamente a la cuenta Escrow del Solicitante establecida para la operación según las condiciones que determine a Prosperaecu S.A. / Crece Ecuador como mandatario para el cobro de los Inversionistas.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
m. El Solicitante tendrá derecho a prepagar sus créditos conforme a la normativa legal vigente y, en todo caso, conforme a las demás disposiciones que sean publicadas en la Plataforma para cada crédito en particular. 
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
n. En caso de mora o simple retardo en el pago de todo o parte del capital e intereses se cobrará al Solicitante el interés máximo convencional que la ley permite estipular para operaciones de crédito de dinero no reajustables contados desde el día que se generó el incumplimiento de la obligación. 

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
o. En caso de que el Solicitante no pague el monto adeudado al vencimiento de la cuota, se podrá ejecutar el correspondiente Pagaré suscrito por el Solicitante. A su vez, la falta de pago íntegro y oportuno, de todo o parte de lo adeudado, facultará a Prosperaecu S.A., como mandatario para el cobro del Inversionista, para hacer exigible al Solicitante moroso el pago total de las cuotas adeudadas, en capital e intereses, las que para el evento se considerarán de plazo vencido para todos los efectos legales.

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
p. Solicitante e Inversionista deben suscribir el contrato de la operación de financiamiento colaborativo conforme las condiciones establecidas en los Acuerdos Específicos de Inversionista y Solicitante.  

            """ 
    agregar_parrafo(Story, ptext, styles)

    ptext = '3. De las Reglas particulares para Solicitudes de Financiamiento vía adquisición de operaciones de financiamiento contenidas en facturas:'
    agregar_subtitulo(Story, ptext, styles)
    ptext= """
a) El Solicitante definirá previamente el precio de cesión de cada factura.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
b) La cesión de la factura se hace a Prosperaecu S.A. en representación de todos los Inversionistas que participen en la Solicitud de Financiamiento, actuando de manera conjunta representados por Prosperaecu S.A./ Crece Ecuador, conforme al mandato que dichos inversionistas otorgan a Prosperaecu S.A. /Crece Ecuador.

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
c) Finalizado el plazo para transferir los fondos por parte de los Inversionistas a la cuenta Escrow del Solicitante asignada por Crece Ecuador según las condiciones que determine. Una vez recibido la totalidad de los montos involucrados en la Solicitud de Financiamiento, se entregarán los fondos al Solicitante
            """ 
    agregar_parrafo(Story, ptext, styles)


    #IV
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
1. El Inversionista declara expresamente y deja constancia que las Solicitudes de Financiamiento publicados en www.Creceecuador.com corresponden a transacciones generadas exclusivamente entre un Solicitante y dos o más Inversionistas, EN LAS QUE LA OBLIGACIÓN AL PAGO DE LA DEUDA DE LOS CRÉDITOS ES ASUMIDA EXCLUSIVAMENTE POR EL SOLICITANTE RESPECTIVO O POR EL DEUDOR DE CADA OPERACIÓN EN SU CASO.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
2. El Inversionista acepta y deja expresa constancia que al participar en la Plataforma, SERÁ ÉL QUIEN TOMARÁ SUS PROPIAS DECISIONES DE INVERSIÓN, de acuerdo a su propio análisis de riesgo y bajo su única y exclusiva responsabilidad.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
3. Al invertir en una Solicitud de Financiamiento, el Inversionista tiene la obligación de hacer su propio análisis de riesgo, previo a su participación en la transacción.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
4. EL INVERSIONISTA COMPRENDE Y ACEPTA QUE LAS SOLICITUDES DE FINANCIAMIENTO PUBLICADAS A TRAVÉS DE LA PLATAFORMA NO SE ENCUENTRAN GARANTIZADOS DE NINGUNA MANERA POR PROSPERAECU S.A./CRECE ECUADOR, NO SIENDO ÉSTE RESPONSABLE DE LAS DECISIONES DE INVERSIÓN DEL INVERSIONISTA NI DE SUS CONSECUENCIAS.
            """ 
    agregar_parrafo(Story, ptext, styles)



    #V
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
Es aquel descrito en la cláusula décimo Octava del Contrato de Términos Legales  y Condiciones Generales de Uso del Sitio Web.
            """ 
    agregar_parrafo(Story, ptext, styles)


    #VI
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext = '1. Cuotas de cada Inversionista.'
    agregar_subtitulo(Story, ptext, styles)
    ptext= """
Para cada Solicitud de Financiamiento, se calculará un porcentaje de prorrateo de acuerdo a los montos adjudicados a cada uno de los Inversionistas que han financiado la Solicitud de Financiamiento. Las cuotas se calcularán hasta con dos decimales.

            """ 
    agregar_parrafo(Story, ptext, styles)

    ptext = '2. Cobro de cuotas.'
    agregar_subtitulo(Story, ptext, styles)
    ptext= """
El Inversionista otorga mediante el presente acuerdo un mandato específico en favor de Prosperaecu S.A. / Crece Ecuador, para el cobro de los dividendos de la operación.  Prosperaecu S.A. /Crece Ecuador gestiona los montos de capital e intereses, de ser aplicables y de las inversiones realizadas en la Plataforma en favor de los Inversionistas a través de la cuenta Escrow del Solicitante. Posteriormente, Prosperaecu S.A. / Crece Ecuador dividirá las cuotas entre los Inversionistas que han participado en cada Solicitud de Financiamiento, en proporción a los montos aportados al mismo y transfiriendo dichos fondos de la cuenta Escrow del Solicitante a la cuenta bancaria designada por el Inversionista en un tiempo máximo de 4 días laborables contados a partir desde la recepción del pago en la cuenta Escrow del solicitante. El banco aplicará una comisión por transferencia interbancaria sobre el dividendo recibido del solicitante según la opción que el inversionista haya decidido en la cláusula III, literal m del presente Acuerdo Específico del Inversionista.
            """ 
    agregar_parrafo(Story, ptext, styles)

    ptext = '3. Pago de cuotas.'
    agregar_subtitulo(Story, ptext, styles)
    ptext= """
 Prosperaecu S.A. / Crece Ecuador sólo autorizará pagos a los Inversionistas si dichos pagos han sido efectuados por el Solicitante o el Deudor a la cuenta Escrow asignada para la operación. Prosperaecu S.A. / Crece Ecuador no se hace responsable de pagar al Inversionista deudas que el Solicitante o el Deudor no haya pagado o haya pagado en un lugar o forma distinta al acordado para la operación. En el caso de que Prosperaecu S.A. / Crece Ecuador reciba un pago parcial, este pago se transferirá a la cuenta designada por los Inversionistas de acuerdo al porcentaje de inversión que haya realizado cada uno sobre el monto total de la operación. El Inversionista recibirá el pago de la deuda efectuado por Prosperaecu S.A. / Crece Ecuador, mediante transferencia electrónica a la cuenta bancaria registrada en su perfil descrita en el proceso de registro o mediante la tarjeta de débito de la cuenta Escrow de Inversionista, si éste lo solicita así durante el proceso de Adjudicación. Los cargos realizados por la institución bancaria por motivo de transferencia de fondos correrán por cuenta del inversionista, serán debitados de la cuenta escrow del solicitante y se restará dicho cargo de los intereses por acreditar al inversionista.
            """ 
    agregar_parrafo(Story, ptext, styles)
     




    
    #VII
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
a) En caso de mora de parte del Solicitante en su obligación con el Inversionista y en virtud del mandato específico de cobro a otorgado por el Inversionista a Prosperaecu S.A. / Crece Ecuador, Prosperaecu S.A. / Crece Ecuador estará encargado de la cobranza extrajudicial y, eventualmente judicial en caso de que el Inversionista así lo decida, de aquellos créditos publicados en la Plataforma que se encuentren morosos o con cuotas impagas. Prosperaecu S.A. / Crece Ecuador se encontrará facultado para delegar en terceros dichas acciones de cobranza, en caso que Prosperaecu S.A. / Crece Ecuador así lo requiera.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
b) El Inversionista declara conocer y aceptar expresamente que Prosperaecu S.A. / Crece Ecuador NO ES RESPONSABLE DE LOS RESULTADOS DE LA COBRANZA DE LOS CRÉDITOS ADEUDADOS RESPECTO DE LAS SOLICITUDES DE FINANCIAMIENTO ADJUDICADAS, SINO EXCLUSIVAMENTE DE CUMPLIR CON SU MANDATO PARA EL COBRO Y PERCIBIR LOS DINEROS DEL SOLICITANTE, EN LOS TÉRMINOS DEL MANDATO QUE EL INVERSIONISTA OTORGA A CRECE ECUADOR PARA ESTOS EFECTOS.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
c) Los gastos, honorarios, costos y demás conceptos que ocasione la cobranza judicial y/o extrajudicial que se generen respecto de una Solicitud de Financiamiento serán cobrados y pagados con parte del monto recuperado.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
d) La morosidad de un Solicitante será visible para otros Usuarios Registrados de Crece Ecuador, ya que su historial de pago se encontrará disponible en cada Solicitud de Financiamiento publicada. La morosidad del Solicitante afecta su historial de comportamiento en la Plataforma y, por tanto, podría condicionar la publicación de nuevas Solicitudes de Crédito de dicho Solicitante. Prosperaecu S.A. / Crece Ecuador podrá inhabilitar a un Solicitante moroso para participar en la Plataforma en su calidad de Solicitante y en su calidad de Inversionista también si la tuviese.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
e) La información personal de contacto del Solicitante estará a disposición de los Inversionistas, quienes podrán tener contacto con éste durante todas las etapas del crédito con posterioridad a la adjudicación.

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
El Inversionista hará sus mejores esfuerzos para no entorpecer el proceso de cobranza encomendado a Prosperaecu S.A. / Crece Ecuador.

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
El Inversionista declara conocer y aceptar que existe la posibilidad que ciertas Solicitudes de Financiamiento no sean pagadas por el Solicitante o el deudor en su totalidad, asumiendo los riesgos que esto implica. En este sentido, se entenderá que un crédito ha sido declarado como incobrable cuando se hayan agotado todas las acciones prejudiciales y judiciales de cobranza. Prosperaecu S.A. / Crece Ecuador establece que no ejecutará acciones de cobranza judicial para créditos o saldos de deuda menores a USD 1500 (mil quinientos dólares de los Estados Unidos de Norteamérica)
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
El Inversionista declara expresamente conocer y aceptar que las Solicitudes de Financiamiento publicadas en la Plataforma no se encuentran garantizados por Crece Ecuador, pues las operaciones realizadas mediante la Plataforma constituyen relaciones jurídicas exclusivas entre el Inversionista y el Solicitante.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
CRECE ECUADOR NO GARANTIZA EN NINGUNA CIRCUNSTANCIA QUE EL INVERSIONISTA RECUPERARÁ LA TOTALIDAD O UNA PORCIÓN DEL MONTO INVERTIDO. CRECE ECUADOR NO ACTÚA EN REPRESENTACIÓN DE LOS SOLICITANTES O DEUDORES Y NO RESPONDE BAJO NINGÚN CONCEPTO COMO AVAL, CODEUDOR, NI DEUDOR SOLIDARIO, O DE FORMA ALGUNA COMO GARANTE POR LOS PAGOS DE CUOTAS NI INTERESES QUE EL SOLICITANTE O EL DEUDOR SE OBLIGA A REALIZAR.
            """ 
    agregar_parrafo(Story, ptext, styles)


    #VIII
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext = 'De las obligaciones del inversionista: '
    agregar_subtitulo(Story, ptext, styles)
    ptext= """
1. El Inversionista se obliga a conocer las condiciones específicas de su Solicitud de Financiamiento, las que se encontrarán disponibles en la Plataforma de manera permanente durante la vigencia de la Solicitud de Financiamiento.

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
2. Para el correcto funcionamiento de todos los mecanismos y operaciones relacionados con su Solicitud de Financiamiento, el Inversionista deberá leer, aceptar y firmar todos los términos y condiciones, acuerdos específicos, declaración de origen de fondos, mandato y demás documentos relativos a la Solicitud de Financiamiento, los cuales serán debidamente informados y entregados por Crece Ecuador al Inversionista.

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
3. Es de responsabilidad exclusiva del inversionista realizar su declaración de impuesto a la renta de acuerdo a las leyes ecuatorianas y a los procedimientos y fechas estipulados por el Servicio de Rentas Internas, en especial por concepto de la renta obtenida por intereses provenientes de los créditos publicados en la plataforma. Crece Ecuador entregará la información que éste solicite para realizar su declaración de renta anual. Además, Crece Ecuador podrá entregar directamente al Servicio de Rentas Internas todos los antecedentes de las operaciones realizadas a través de la Plataforma, según las instrucciones que el SRI  establezca a este respecto, de manera de facilitar la declaración de impuestos para los Inversionistas.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext = 'Prohibiciones del inversionista: '
    agregar_subtitulo(Story, ptext, styles)
    ptext= """
El Inversionista declara conocer y aceptar que no podrá realizar las siguientes acciones al participar en la Plataforma, ya sea como Usuario Registrado, como Inversionista o como Solicitante:
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
I. Suplantación de identidad, creando un registro de Usuario Solicitante o de Inversionista en Crece Ecuador bajo la identidad de un tercero.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
II. Cobrar o intentar cobrar a los Solicitantes que participan en Crece Ecuador algún cargo adicional a los establecidos para el acceso a la Plataforma
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
III. Interferir o entorpecer de ninguna manera en las gestiones de cobro de su mandatario Crece Ecuador o  sus delegados.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
IV. Las demás establecidas en las políticas de privacidad y los términos y condiciones generales de uso de plataforma.

            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
V. No divulgará/hará pública información reservada para inversionistas registrados en la plataforma. Esto incluye, pero no se limita a, información personal y financiera de los solicitantes, datos de sus negocios, entre otros a través de ningún medio de comunicación existente en el presente y los que pudieran existir en el futuro.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
VI. Exigir a los solicitantes el pago de intereses que superen las tasas máximas permitidas por la ley para la materia.
            """ 
    agregar_parrafo(Story, ptext, styles)





    #IX
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
Por este acto, el Inversionista confiere mandato especial, pero tan amplio como en derecho corresponda, a PROSPERAECU S.A. para que éste, en nombre y en representación del Inversionista realice lo siguiente:
""" 
    agregar_parrafo(Story, ptext, styles)

    ptext= """
1. Gestionar la apertura de una cuenta bancaria Escrow para la o las operaciones de financiamiento colaborativo en la entidad bancaria designada por Crece Ecuador a nombre del Inversionista, haciendo constar a Prosperaecu S.A. / Crece Ecuador como firma autorizada en el caso de que el Inversionista lo solicite conforme a la cláusula III literal m del presente Acuerdo.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
2. Disponer los movimientos de fondos en la cuenta Escrow del Inversionista y según las condiciones establecidas en los compromisos de inversión que realice el Inversionista en la plataforma.
        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
3. Transferir los fondos de la cuenta Escrow del inversionista a la cuenta Escrow del Solicitante en virtud del compromiso de Inversión de la nueva Solicitud de Financiamiento elegida.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
4. Realizar los siguientes cobros: 1.  la comisión o cargo por Adjudicación de la operación de financiamiento colaborativo en favor de Prosperaecu S.A. / Crece Ecuador desde la cuenta Escrow del Solicitante conforme a la cláusula XIII del presente Acuerdo Específico, y; 2. La comisión derivada del pago de cada uno de los dividendos por parte del Solicitante desde la cuenta Escrow del Solicitante conforme a la cláusula XIII del presente Acuerdo Específico.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
5. Entregar cualquier información relacionada con la operación de financiamiento colaborativo a la autoridad encargada de control de conformidad con la Ley Orgánica De Emprendimiento e Innovación.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
6.  Entregar cualquier información relacionada con la operación de financiamiento colaborativo a la UAFE a efectos de dar cumplimiento a lo dispuesto en la Ley Orgánica De Prevención, Detección y Erradicación del Delito De Lavado De Activos y del Financiamiento de Delitos.
        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
7. Consulte información crediticia del inversionista en las Centrales de Riesgo y ante las entidades que estime necesarias.
        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
8. Gestionar una tarjeta de débito del banco asignado por Crece Ecuador para la o las operaciones de financiamiento colaborativo a nombre del inversionista para que este pueda retirar los pagos y dividendos pagados por los solicitantes.
        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
9. Transferir desde la cuenta Escrow del Solicitante a la cuenta designada por el Inversionista los dividendos pagados por los solicitantes de acuerdo con las condiciones establecidas en el contrato de la operación.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
Adicionalmente por este acto, el Inversionista confiere mandato especial, pero tan amplio como en derecho corresponda, a PROSPERAECU S.A. para que, en nombre y representación del Inversionista realice la gestión de cobranza extrajudicialmente, perciba, por sí mismo o a través de terceros especialmente delegados al efecto, las cuotas de dinero a que tenga derecho el Inversionista de conformidad con la Solicitud de Financiamiento, más sus intereses correspondientes, y para dividir las cuotas pagadas entre los Inversionistas que han participado en dicha Solicitud de Financiamiento, en proporción a sus respectivos aportes, todo lo anterior en los términos del presente instrumento y de las disposiciones del mandato del Código Civil.  Todo valor recuperado por la gestión de cobranza se acreditará a través de la cuenta Escrow del Solicitante designada para la operación y será transferido a las cuentas designadas por los Inversionistas conforme a las condiciones establecidas en  el presente Acuerdo Específico.
        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
Para los efectos del mandato otorgado en la cláusula precedente, el Inversionista faculta expresamente a PROSPERAECU S.A. para deducir de las sumas percibidas los descuentos acordados en el Contrato de Términos Legales y Condiciones Generales de Uso del Sitio  Web aceptado y suscrito por el Inversionista, entre los cuales se incluyen el cobro por concepto de uso de la plataforma, y otros que se hayan acordado entre las Partes.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
En el ejercicio de su mandato, PROSPERAECU S.A. / Crece Ecuador podrá realizar las siguientes actuaciones y estará premunido de las siguientes facultades:

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
a. Recibir y custodiar el o los pagaré suscritos por el Solicitante de conformidad con el Contrato de Términos Legales y Condiciones Generales de Uso del Sitio  Web respectivo como respaldo de la Solicitud de Financiamiento vía crédito, facultad que podrá delegar en terceros.
        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
b. Aceptar y recibir toda clase de garantías reales y personales, que constituya el Solicitante o el deudor en alguna operación de financiamiento colaborativo o de cobro factura para garantizar el pago íntegro y oportuno de la Solicitud de Financiamiento.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
c. Aceptar y recibir eventuales daciones en pago del Solicitante o del deudor de una factura.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
d. Delegar total o parcialmente sus facultades en terceros.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
e. Actuar como cesionario de facturas en representación de los Inversionistas.
        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
f. Ingresar los datos del Solicitante  y su comportamiento crediticio al buró de Crédito y entidades similares.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
g. Las demás actuaciones que considere para el cumplimiento de las condiciones establecidas para cada operación.

        """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
Serán de cargo exclusivo del Inversionista los gastos, impuestos, derechos notariales y de registro e inscripciones, como asimismo, cualquier desembolso de cualquier naturaleza que esté relacionado con el otorgamiento, o registro de este mandato, así como aquéllos derivados de escrituras públicas complementarias que pueda ser necesario otorgar en orden a clarificar, rectificar, complementar o modificar el presente instrumento.
        """ 
    agregar_parrafo(Story, ptext, styles)


    #X
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
CRECE ECUADOR podrá en cualquier momento y de tiempo en tiempo, corregir, modificar, agregar, eliminar y actualizar los términos y condiciones de este Contrato, previa aceptación expresa al efecto por el Inversionista.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
Para estos efectos, Crece Ecuador notificará oportunamente al Inversionista de las modificaciones que se desee efectuar al presente Contrato a través de la publicación de una notificación dirigida al mismo cuando éste ingrese a su Cuenta. Los cambios en el presente Contrato se harán efectivos a partir del momento en que el Inversionista acepta las referidas modificaciones.

            """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
Crece Ecuador podrá cambiar los montos de cobro por acceso a la Plataforma en cualquier momento, los que serán válidos para futuros financiamientos en los que participe el Inversionista, no así para financiamientos que se encuentran activos o publicados al momento del cambio en dichos cobros. Crece Ecuador notificará de los cambios en su web y a través de un nuevo “Acuerdos específicos de Uso del sitio web Inversionista” que actualizará en la Plataforma, notificando debidamente a los Inversionistas de este cambio.
        """
    agregar_parrafo(Story, ptext, styles)


    #XI
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
Los presentes Acuerdos específicos de Uso del Sitio web del Inversionista tendrá duración indefinida, sin perjuicio de lo indicado en la cláusula siguiente.
            """
    agregar_parrafo(Story, ptext, styles)




    #XII
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
Sin perjuicio de lo acordado en la cláusula Octava del Contrato de Términos Legales y Condiciones Generales de Uso del Sitio  Web, Crece Ecuador podrá dar por terminado anticipadamente el presente Contrato a su sola discreción, pudiendo desactivar la cuenta de un Usuario y el Registro de Usuario respectivo, en cualquiera de los siguientes casos:
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
a. En caso de comprobar que alguna de las informaciones suministradas por el Inversionista fuese falsa, incompleta, inexacta, errónea, y/o de cualquier forma poco fidedigna;
            """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
b. En el evento de incurrir el Inversionista en un uso no autorizado del Contenido de la Plataforma según lo prescrito en los Términos y Condiciones  Generales de Uso de la Plataforma o sus acuerdos específicos.

        """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
c. En el evento de incurrir el Usuario en alguna conducta u omisión que vulnere las disposiciones anti spam contenidas en los Términos y Condiciones Generales de Uso de la Plataforma; y en general.
        """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
d. En el evento de incurrir el Usuario en alguna infracción de sus obligaciones bajo este Contrato, los Términos y Condiciones de Uso de la Plataforma y/o los Acuerdos Específicos aceptados en la Plataforma.
        """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
e.              En caso de encontrar evidencia de falsedad en la información registrada, incumplimiento de las normas contra el lavado de activos y financiamiento de delitos y otros comportamientos que a criterio de CRECE perjudiquen a los demás participantes y al correcto funcionamiento de las actividades de la plataforma, CRECE podrá dar por terminado el presente contrato y se guarda el derecho de eliminar el perfil del inversionista y prohibir su participación de la plataforma.
        """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
f.          En cualquiera de estos casos, se entenderá que el presente Contrato ha terminado desde el momento en que Crece Ecuador así lo notifique al Inversionista mediante el envío de correo electrónico dirigido a la dirección registrada por éste en www.creceecuador.com
        """
    agregar_parrafo(Story, ptext, styles)


    #XIII
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
            El inversionista pagará a PROSPERAECU S.A. el 0.8% del capital invertido en la operación de financiamiento colaborativo como cargo por adjudicación de operación. Dicho valor será pagado a PROSPERAECU S.A. una sola vez por operación al momento de acreditarse la transferencia de fondos a la cuenta Escrow del Solicitante, asignada para la operación de financiamiento colaborativo y se hará de manera automática.
            """ 
    agregar_parrafo(Story, ptext, styles)
    ptext= """
            El inversionista además pagará a PROSPERAECU S.A. por la gestión de cobranza extrajudicial el valor de 0.45% + IVA mensual del capital insoluto a la fecha de pago. En caso de que el porcentaje aquí indicado resulte en un valor inferior a USD $0.50 (cincuenta centavos de dólar de los Estados Unidos de Norteamérica) se establece el valor de USD $0.50 (cincuenta centavos de dólar de los Estados Unidos de Norteamérica) como cargo por gestión de cada uno de los dividendos cobrados al Solicitante.
            Este valor se debitará de la cuenta Escrow del solicitante al momento de transferir la parte de la cuota que corresponde a cada Inversionista según las condiciones acordadas en la operación.
            """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
        En caso de que las partes soliciten otro servicio ofrecido por PROSPERAECU S.A. / CRECE ECUADOR y derivado del uso de la plataforma, las partes suscribirán el adenda correspondiente que se adjuntará al archivo de la operación con las formalidades que la ley o Crece Ecuador estime convenientes.
        """
    agregar_parrafo(Story, ptext, styles)





    #XIV
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
            Los presentes Acuerdos Específicos de uso del Sitio Web y las Términos Legales y Condiciones Generales de Uso del Sitio Web se encuentran sujetos y regidos por las leyes vigentes en la República de Ecuador.
            """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
            Cualquier dificultad o controversia que se produzca entre los contratantes respecto de la aplicación, interpretación, duración, validez o ejecución de este contrato o cualquier otro motivo será incoada o presentada ante un juez de la Unidad Judicial Civil con sede en el cantón Guayaquil.
            """
    agregar_parrafo(Story, ptext, styles)
    ptext= """
    El Usuario acepta notificar a Prosperaecu S.A. de manera escrita ante cualquier reclamo o disputa concerniente o relativa a este Sitio y a los Contenidos y servicios provistos en el mismo, y dar a Prosperaecu S.A. un período razonable para responder al Usuario, antes de comenzar cualquier acción legal contra Prosperaecu S.A.            """
    agregar_parrafo(Story, ptext, styles)


    #XV
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= """
    Las comunicaciones que el Usuario deba o quiera dirigir a Prosperaecu S.A., se efectuarán por correo electrónico dirigido a info@creceecuador.com o bien a través de la sección Contacto de www.creceecuador.com
    """
    agregar_parrafo(Story, ptext, styles)

    ptext= """
    Las comunicaciones que Prosperaecu S.A. deba o quiera dirigir al Usuario, se efectuarán por correo electrónico dirigido a la dirección electrónica designada por el Usuario en el Proceso de Registro.
    """
    agregar_parrafo(Story, ptext, styles)



    #XVI
    SECCION += 1
    agregar_SECCION(Story, SECCION, styles)
    ptext= DECLARACION_ACEPTACION.format(nombre=usuario.get('nombres')+" "+usuario.get('apellidos'), 
                                        cedula=usuario.get('cedula'), dia=DIAS[date.today().weekday()], fecha=fecha, hora=date.hour, minutos=date.minute, segundos=date.second)
    agregar_parrafo(Story, ptext, styles)



    doc.build(Story)


def agregar_parrafo(Story, texto, styles):
    Story.append(Paragraph(texto, styles["Justify"]))
    Story.append(Spacer(1, 0.2*inch))

def agregar_titulo(Story, texto, styles):
    Story.append(Paragraph(texto, styles["title"]))
    Story.append(Spacer(1, 0.2*inch))

def agregar_SECCION(Story, indice, styles):
    ix = '<b> <font size="12">'+SECCIONES_IX[indice]+'</font> </b>'
    Story.append(Paragraph(ix, styles["center"]))
    titulo = '<b> <font size="12">'+SECCIONES[indice]+'</font> </b>'
    Story.append(Paragraph(titulo, styles["center"]))
    Story.append(Spacer(1, 0.2*inch))

def agregar_subtitulo(Story, texto, styles):
    Story.append(Paragraph('<u>'+texto+'</u>', styles['Justify']))
    Story.append(Spacer(1, 0.2*inch))

