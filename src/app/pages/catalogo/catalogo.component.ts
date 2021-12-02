import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BayerService } from 'src/app/services/bayer.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})

export class CatalogoComponent implements OnInit, OnDestroy {
  private listaTodoProductsSubscription: Subscription;
  private listaEspeciesSubscription: Subscription;
  private listaTiposSubscription: Subscription;
  private listaVariedadesSubscription: Subscription;

  public flagCargando: boolean = false;
  public dataSourceCatalogo = new Array();
  public arrayProductos = new Array();
  public arrayEspecies = new Array();
  public arrayTipos = new Array();
  public arrayVariedades = new Array();

  especie: string;
  tipo: string;
  variedad: string;

  constructor(
    private toastrService: ToastrService,
    private bayerService: BayerService
  ) {
    this.dataSourceCatalogo = [];
  }

  ngOnInit(): void {
    this.flagCargando = true;
    this.flagCargando = false;
    this.cargarComponente();
  }

  cargarComponente() {
    this.cargarEspeciesSemillas();
    this.cargarTiposSemillas();
    this.cargarVariedadesSemillas();
    this.cargarTodoProductos();
  }

  cargarTodoProductos() {
    this.listaTodoProductsSubscription = this.bayerService.listarTodoProducto().subscribe((productos) => {
      if (productos !== null || productos !== undefined) {
        console.log('productos: ',productos);
        this.arrayProductos = this.arrayProductos.concat(productos.envases);
        this.arrayProductos = this.arrayProductos.concat(productos.especies);
        this.arrayProductos = this.arrayProductos.concat(productos.materiales);
        this.arrayProductos = this.arrayProductos.concat(productos.preciosPorMateriales);
        this.arrayProductos = this.arrayProductos.concat(productos.tipos);
        this.arrayProductos = this.arrayProductos.concat(productos.unidades);
        this.arrayProductos = this.arrayProductos.concat(productos.variadades);
        console.log('arrayProductos: ',this.arrayProductos);
        this.arrayProductos.forEach(p => {
          let datos = new Object();
          this.dataSourceCatalogo = this.dataSourceCatalogo.concat(p.nombreEspecie);
          this.dataSourceCatalogo = this.dataSourceCatalogo.concat(p.nombreTipo);
          this.dataSourceCatalogo = this.dataSourceCatalogo.concat(p.nombreVariedad);
          this.dataSourceCatalogo = this.dataSourceCatalogo.concat(p.tipoEnvase);
          //this.dataSourceCatalogo = this.dataSourceCatalogo.concat(datos);
          console.log('dataSourceCatalogo: ',this.dataSourceCatalogo);
        });
      }
    });
  }

  cargarEspeciesSemillas() {
    this.listaEspeciesSubscription = this.bayerService
      .listarEspecies()
      .pipe(take(1))
      .subscribe((especies) => {
        if (especies !== null || especies !== undefined) {
          this.arrayEspecies = especies;
          console.log('arrayEspecies: ',this.arrayEspecies);
        } else {
          console.error('No hay data!');
        }
      });
  }

  cargarTiposSemillas() {
    this.listaTiposSubscription = this.bayerService
    .listarTipos()
    .pipe(take(1))
    .subscribe((tipos) => {
      if (tipos !== null || tipos !== undefined) {
        this.arrayTipos = tipos;
        console.log('arrayTipos: ',this.arrayTipos);
      } else {
        console.error('No hay data!');
      }
    });
  }

  cargarVariedadesSemillas() {
    this.listaVariedadesSubscription = this.bayerService
    .listarVariedades()
    .pipe(take(1))
    .subscribe((variedades) => {
      if (variedades !== null || variedades !== undefined) {
        this.arrayVariedades = variedades;
        console.log('arrayVariedades: ',this.arrayVariedades);
      } else {
        console.error('No hay data!');
      }
    });
  }

  onChangeEspecies(event) {
    let especieSel: any = this.arrayEspecies.find(e => e.id === event).id;
    this.especie = especieSel;
    console.log('especie: ',this.especie);
  }

  onChangeTipos(event) {
    let tipoSel: any = this.arrayTipos.find(t => t.id === event).id;
    this.tipo = tipoSel;
    console.log('tipo: ',this.tipo);
  }

  onChangeVariedades(event) {
    let variedadSel = this.arrayVariedades.find(v => v.id === event).id;
    this.variedad = variedadSel;
    console.log('variedad: ',this.variedad);
  }

  ngOnDestroy(): void {
    if (this.listaEspeciesSubscription) {
      this.listaEspeciesSubscription.unsubscribe();
    }
    if (this.listaTiposSubscription) {
      this.listaTiposSubscription.unsubscribe();
    }
    if (this.listaVariedadesSubscription) {
      this.listaVariedadesSubscription.unsubscribe();
    }
    if (this.listaTodoProductsSubscription) {
      this.listaTodoProductsSubscription.unsubscribe();
    }
  }
}
