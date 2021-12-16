import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss']
})
export class DetalleOrdenComponent implements OnInit, OnDestroy {

  @Output() envioCerrarModal = new EventEmitter();
  @Output() actualizoGrilla = new EventEmitter();
  @Input() nuevoProductoCarro: object;

  listaProductosCarro = [];
  nuevoProductoAgregado: any;
  totalPedido:number;
  constructor() { }

  ngOnInit(): void {
    if(JSON.parse(localStorage.getItem('carroCompra')) != null){
      this.listaProductosCarro = JSON.parse(localStorage.getItem('carroCompra'));
    }
    console.log(this.nuevoProductoCarro);
    this.nuevoProductoAgregado=this.nuevoProductoCarro;
    this.verificarProductoEnCarro()
    console.log(this.listaProductosCarro);
    localStorage.setItem('carroCompra',JSON.stringify(this.listaProductosCarro));
    console.log("localSotrage", JSON.parse(localStorage.getItem('carroCompra')))
    this.sumarTotalPedido(this.listaProductosCarro);

  }

  actualizarGrilla() {
    this.actualizoGrilla.emit();
  }
  
  cerrarModal() {
    this.envioCerrarModal.emit();
  }

  // call to update cell value
  updateValue(event, rowIndex) {
    this.listaProductosCarro[rowIndex].cantidad = event.target.value;
    this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad;;
  }
  disminuirCantidad(rowIndex){
    
    if(this.listaProductosCarro[rowIndex].cantidad == 0){
      this.listaProductosCarro[rowIndex].cantidad = 0;
      this.sumarTotalPedido(this.listaProductosCarro)
    }
    if(this.listaProductosCarro[rowIndex].cantidad > 0){
      this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad - 1;
      this.sumarTotalPedido(this.listaProductosCarro)
    }
    
  }

  aumentarCantidad(rowIndex){
    
    this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad + 1;
    this.sumarTotalPedido(this.listaProductosCarro)
  }

  eliminarProductodeCarro(rowIndex){
    this.listaProductosCarro.splice(rowIndex,1);
    localStorage.setItem('carroCompra',JSON.stringify(this.listaProductosCarro));
    this.sumarTotalPedido(this.listaProductosCarro)

  }

  sumarTotalPedido(listaProductos){
    let suma=0;
    let aux = 0;
    for(let i=0;i< listaProductos.length;i++){
      aux = listaProductos[i].cantidad * listaProductos[i].precioporUnidad;
      suma = suma + aux;
    }
    this.totalPedido = suma;

  }

  verificarProductoEnCarro(){
    let contador = 0;
    for(let i=0;i< this.listaProductosCarro.length;i++){
      if(this.listaProductosCarro[i].codigoMaterial == this.nuevoProductoAgregado.codigoMaterial){
        this.listaProductosCarro[i].cantidad = this.nuevoProductoAgregado.cantidad + this.listaProductosCarro[i].cantidad;
        contador++;
      }
    }
    if(contador == 0){
      this.listaProductosCarro.push(this.nuevoProductoAgregado)
    }
    
  }


  ngOnDestroy(): void {
    
  }

}
