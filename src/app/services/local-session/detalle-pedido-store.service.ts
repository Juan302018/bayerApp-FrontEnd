import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetallePedidoStoreService {
  
  constructor() { }

  static readonly DETALLE_PEDIDO = 'detallePedido';

  public guardarCarroCompra(detalleCompra): void {
      localStorage.setItem(DetallePedidoStoreService.DETALLE_PEDIDO, JSON.stringify(detalleCompra));
    }
  
    public obtenerCarroCompra(): any {
      const solicitud: any = JSON.parse(localStorage.getItem(DetallePedidoStoreService.DETALLE_PEDIDO));
      return solicitud;
    }
  
    public borrarCarroCompra(): void {
      localStorage.removeItem(DetallePedidoStoreService.DETALLE_PEDIDO);
    }
}
