export const routes = [
  '/', '/productos', '/productos/radios', '/productos/bases-moviles',
  '/productos/infraestructura', '/productos/wave-ptx', '/productos/accesorios',
  '/productos/radios/mototrbo-r7', '/productos/radios/mototrbo-r2',
  '/productos/infraestructura/slr-5100', '/productos/bases-moviles/dgm-8000',
  '/soluciones', '/industrias',
  ...['seguridad', 'mineria', 'petroleo-gas', 'energia', 'industria', 'logistica', 'salud', 'eventos'].map(i => `/industrias/${i}`),
  '/dealers', '/nosotros', '/novedades',
  ...['elegir-un-sistema', 'radio-y-banda-ancha', 'accesorios-en-la-operacion'].map(a => `/novedades/${a}`),
  '/contacto', '/privacidad',
];
