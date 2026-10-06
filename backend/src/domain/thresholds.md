# Umbrales de clasificación

La clasificación de la inclinación de hombros se basa en el **valor absoluto del ángulo**
entre la línea que une ambos hombros y la horizontal, en grados.

| Clasificación | Rango (|ángulo|) | Color sugerido |
|---|---|---|
| `symmetric` (simétrico) | < 2° | Verde `#2E7D32` |
| `mild` (leve) | 2° – < 5° | Amarillo `#F9A825` |
| `moderate` (moderado) | 5° – < 10° | Naranja `#EF6C00` |
| `marked` (marcado) | ≥ 10° | Rojo `#C62828` |

## Configuración

Los límites se pueden ajustar sin tocar el código mediante variables de entorno:

```
THRESHOLD_SYMMETRIC_MAX=2
THRESHOLD_MILD_MAX=5
THRESHOLD_MODERATE_MAX=10
```

Debe cumplirse `symmetricMax < mildMax < moderateMax`; si no, el módulo lanza un error.

## Nota clínica

Estos umbrales son orientativos y pensados para concientización, no para
diagnóstico. La interpretación clínica corresponde a un profesional de la salud.
