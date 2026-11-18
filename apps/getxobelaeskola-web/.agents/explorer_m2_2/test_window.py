import re

msg_j80 = """⛵ ¡Curso de iniciación J80 en Getxo Bela Eskola!  ¿Te apetece aprender a navegar a vela? Disfruta del mar mientras aprendes las maniobras básicas en equipo. ¡No necesitas experiencia previa!  📅 14, 21 y 22 de noviembre 🕙 De 10:00 a 14:00 ⏱️ 12 horas de curso repartidas en 3 días. 💶 180 € por persona, curso completo.  📍 Getxo Bela Eskola Puerto Deportivo de Getxo.  📲 Información y reservas por WhatsApp: 634 405 624  🌊 ¡Nos vemos en el agua!"""

msg_cuota = """Hola GEXTO BELA ESKOLA, Se ha ordenado una transferencia con los siguientes datos:  Ordenante: Luciano Jose  Importe: 100,00 €  Cuenta: *0619  Beneficiario: GEXTO BELA ESKOLA  Concepto: LUCIANO NATALI ( CUOTA 5 EN 2026)  Llegada: 07/08/2026"""

# Test J80 regex with broader window or two-pass / sentence-level regex
regex_j80 = re.compile(r'(?:J80|J-80|j\s*80)[\s\S]{0,400}?(?P<amount>180(?:[\.,]00)?)\s*(?P<currency>€|euros?)|(?P<amount_alt>180(?:[\.,]00)?)\s*(?P<currency_alt>€|euros?)[\s\S]{0,400}?(?:J80|J-80|j\s*80)', re.IGNORECASE)
print("J80 test:", bool(regex_j80.search(msg_j80)))

# Test Cuota regex
regex_cuota = re.compile(r'(?:CUOTA|cuota|mensualidad|abono|socio)[\s\S]{0,250}?(?P<amount>100(?:[\.,]00)?)\s*(?P<currency>€|euros?)|(?P<amount_alt>100(?:[\.,]00)?)\s*(?P<currency_alt>€|euros?)[\s\S]{0,250}?(?:CUOTA|cuota|mensualidad|abono|socio)', re.IGNORECASE)
print("Cuota test:", bool(regex_cuota.search(msg_cuota)))
