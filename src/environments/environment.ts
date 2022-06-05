// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const url ='url de backend';
export const environment = {
  production: false,

  apiLogin: url+'/session/login',
  apiValidate: url+'/session/validate_session',
  apiGetMesa: url+'/table_manager/get_tables',
  apiAgMesa: url+'/table_manager/create_table',
  apiDelMesa: url+'/table_manager/del_table',
  apiGetCarta:url+'/order_manager/get_consumables',
  apiPedido: url+'/order_manager/set_order',
  apiGetGarzon: url+'/cajero/get_garzones',
  apiGetPersonal: url+'/cajero/get_name_employees',
  apiCerrarMesa: url+'/table_manager/close_table',
  apiGetPaidMethod: url+'/cajero/get_paid_methods',
  apiAbrirCaja: url+'/cash_register/open_register',
  apiCerrarCaja: url+'/cash_register/close_register',
  apiHistorial: url+'/cajero/historical',
  apiGetOrderDetail: url+'/cajero/get_order_detail',
  apiRefund:url+'/order_manager/refund_order',
  apiPend:url+'/order_manager/pay_pendient',
  apiGetCajero: url+'/cajero/get_cajeros',
  //Cocina
  apiSetStatus: url+'/cocina/set_order_status',
  apiLiberaMesa: url+'/table_manager/cancel_table',
  //Delivery
  apiDoDelivery: url+'/delivery_manager/agregar_pedido',
  apiDetalleDelivery: url+'/delivery/get_order_detail',
  //Socket
  apiSocket: 'http://186.156.92.127:8101',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
