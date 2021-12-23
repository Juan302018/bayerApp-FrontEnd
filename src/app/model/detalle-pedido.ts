export class DetallePedido {
    materialId: number;
    variedadId: number;
    cantidad: number;
    precioUnitario: number;
    precioTotal?: number;
    
      public constructor(init?: Partial<DetallePedido>) {
        Object.assign(this, init);
      }
    }