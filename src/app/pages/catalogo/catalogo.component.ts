import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit, OnDestroy {

  public flagCargando: boolean = false;
  public dataSourceCatalogo = new Array();

  especie: string;
  tipo: string;
  variedad: string;


  constructor(
    private toastrService: ToastrService
  ) {
    this.dataSourceCatalogo = [];
   }

  ngOnInit(): void {
    this.flagCargando = true;
    this.flagCargando = false;
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
