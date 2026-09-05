# Misión: VIG-01

## Porcentaje de consumo: 5%

## Pasos requeridos:

- vigilancia.gov/listar/camaras
- vigilancia.gov/listar/alertas
- vigilancia.gov/borrar/alerta?id=ALT-002
- vigilancia.gov/desactivar/camara?codigo=CAM-001
- vigilancia.gov/desactivar/camara?codigo=CAM-007

# Misión: VIG-02

## Porcentaje de consumo: 4%

## Pasos requeridos:

vigilancia.gov/listar/camaras
vigilancia.gov/crear/alerta?camara=CAM-003&nivel=ALTO&descripcion=Actividad sospechosa
vigilancia.gov/activar/camara?codigo=CAM-004
vigilancia.gov/crear/alerta?camara=CAM-004&nivel=ALTO&descripcion=Robo en progreso

# Misión: VIG-03

## Porcentaje de consumo: 3%

## Pasos requeridos:

vigilancia.gov/listar/alertas
vigilancia.gov/modificar/alerta?id=ALT-001&nivel=BAJO
vigilancia.gov/modificar/alerta?id=ALT-005&nivel=BAJO

# Misión: FIN-01

## Porcentaje de consumo: 3%

## Pasos requeridos:

registro.gov/listar/ciudadanos
finanzas.gov/cuentas/cliente?cedula=1023456781
finanzas.gov/crear/transaccion?cuenta=CTA-001&monto=2250000&tipo=CONSIGNACIÓN

# Misión: FIN-02

## Porcentaje de consumo: 4%

## Pasos requeridos:

registro.gov/listar/ciudadanos
finanzas.gov/multas/ciudadano?cedula=1023456782
finanzas.gov/modificar/multa?id=MUL-001&estado=ANULADA
finanzas.gov/modificar/multa?id=MUL-006&estado=ANULADA

# Misión: FIN-03

## Porcentaje de consumo: 4%

## Pasos requeridos:

registro.gov/listar/ciudadanos
finanzas.gov/cuentas/cliente?cedula=1023456783
finanzas.gov/crear/transaccion?cuenta=CTA-004&monto=1200000&tipo=RETIRO
finanzas.gov/crear/transaccion?cuenta=CTA-010&monto=1200000&tipo=CONSIGNACIÓN

# Misión: FIN-04

## Porcentaje de consumo: 4%

## Pasos requeridos:

finanzas.gov/listar/transacciones
finanzas.gov/listar/cuentas
registro.gov/listar/ciudadanos
finanzas.gov/crear/transaccion?cuenta=CTA-007&monto=7300000&tipo=RETIRO

# Misión: DEF-01

## Porcentaje de consumo: 5%

## Pasos requeridos:

registro.gov/listar/ciudadanos
defensa.gov/listar/prisioneros
defensa.gov/listar/celdas
defensa.gov/liberar/celda?numero=CEL-007
defensa.gov/modificar/prisionero?codigo=PRI-001&estado=LIBERADO

# Misión: DEF-02

## Porcentaje de consumo: 4%

## Pasos requeridos:

registro.gov/listar/ciudadanos
defensa.gov/listar/prisioneros
defensa.gov/modificar/prisionero?codigo=PRI-002&estado=CUMPLIENDO SENTENCIA
defensa.gov/asignar/celda?numero=CEL-003&prisionero=PRI-002

# Misión: DEF-03

## Porcentaje de consumo: 5%

## Pasos requeridos:

registro.gov/listar/ciudadanos
defensa.gov/listar/prisioneros
defensa.gov/modificar/prisionero?codigo=PRI-003&oficial=[cualquier oficial excepto OFI-002]
defensa.gov/modificar/prisionero?codigo=PRI-007&oficial=[cualquier oficial excepto OFI-002]
defensa.gov/borrar/oficial?placa=OFI-002

# Misión: DEF-04

## Porcentaje de consumo: 3%

## Pasos requeridos:

defensa.gov/listar/prisioneros
defensa.gov/listar/oficiales
defensa.gov/borrar/prisionero?codigo=PRI-004
