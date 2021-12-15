import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss']
})
export class DetalleOrdenComponent implements OnInit, OnDestroy {

  @Output() envioCerrarModal = new EventEmitter();
  @Output() actualizoGrilla = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  actualizarGrilla() {
    this.actualizoGrilla.emit();
  }
  
  cerrarModal() {
    this.envioCerrarModal.emit();
  }

  ngOnDestroy(): void {
    
  }

}
