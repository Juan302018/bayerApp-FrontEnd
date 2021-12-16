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
  nuevoProductoAgregado: object;
  constructor() { }

  ngOnInit(): void {
    console.log(this.nuevoProductoCarro);
    this.nuevoProductoAgregado=this.nuevoProductoCarro;
    this.listaProductosCarro.push(this.nuevoProductoAgregado)
    console.log(this.listaProductosCarro);
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
    this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad;
    console.log("cantidad:" , this.listaProductosCarro[rowIndex].cantidad);
  }
  disminuirCantidad(rowIndex){
    
    if(this.listaProductosCarro[rowIndex].cantidad == 0){
      this.listaProductosCarro[rowIndex].cantidad = 0;
    }
    if(this.listaProductosCarro[rowIndex].cantidad > 0){
      this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad - 1;
      console.log("cantidad:" , this.listaProductosCarro[rowIndex].cantidad);
    }
    
  }

  aumentarCantidad(rowIndex){
    
    this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad + 1;
    console.log("cantidad:" , this.listaProductosCarro[rowIndex].cantidad);
  }


  ngOnDestroy(): void {
    
  }

}
