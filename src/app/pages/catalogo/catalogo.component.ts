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
import swal from 'sweetalert2';

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
    this.cargarComponente();

  }

  cargarComponente() {
    this.cargarEspeciesSemillas();
    this.cargarTiposSemillas();
    this.cargarVariedadesSemillas();
    this.cargarTodoProductos();
  }

  cargarTodoProductos() {
    this.flagCargando = true;
    setTimeout(
      () =>
        swal.fire({
          title: 'Atención!',
          text: 'Cargando datos ...',
          imageUrl: 'assets/img/loadingCircucle.gif',
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }),
      100
    );
    this.flagCargando = false;
    this.listaTodoProductsSubscription = this.bayerService.listarTodoProducto().subscribe((productList) => {
      console.log('todos los productos: ', productList);
      if (productList !== null || productList !== undefined) {
        for (let i = 0; i < productList.length; i++) {
          productList[i].tipoEnvase = productList[i].envase.tipoEnvase;
          productList[i].nombreEspecie = productList[i].especieSemilla.nombreEspecie;
          productList[i].nombreTipo = productList[i].tipoSemilla.nombreTipo;
          productList[i].nombreVariedad = productList[i].variedadSemilla.nombreVariedad;
          productList[i].cantidadMedida = productList[i].unidad.cantidad;
          productList[i].unidadMedida = productList[i].unidad.unidadMedida;
          productList[i].precioporUnidad = productList[i].preciosPorMaterial.valorUnidad;
        }
        swal.close();
        this.arrayProductos = productList;
        console.log('arrayProductos: ', this.arrayProductos);
      }
    });
  }

  ejecutarListaProducto(idEspacie, idTipo, idVariedad) {
    this.flagCargando = true;
    setTimeout(
      () =>
        swal.fire({
          title: 'Atención!',
          text: 'Cargando datos ...',
          imageUrl: 'assets/img/loadingCircucle.gif',
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }),
      100
    );
    this.flagCargando = false;
    this.listaTodoProductsSubscription = this.bayerService.filtraListaProducto(idEspacie, idTipo, idVariedad).subscribe(productList => {
      if (productList !== null || productList !== undefined) {
        console.log('productList: ', productList);
        for (let i = 0; i < productList.length; i++) {
          productList[i].tipoEnvase = productList[i].envase.tipoEnvase;
          productList[i].nombreEspecie = productList[i].especieSemilla.nombreEspecie;
          productList[i].nombreTipo = productList[i].tipoSemilla.nombreTipo;
          productList[i].nombreVariedad = productList[i].variedadSemilla.nombreVariedad;
          productList[i].cantidadMedida = productList[i].unidad.cantidad;
          productList[i].unidadMedida = productList[i].unidad.unidadMedida;
          productList[i].precioporUnidad = productList[i].preciosPorMaterial.valorUnidad;
        }
        swal.close();
        this.arrayProductos = productList;
        console.log('arrayProductos: ', this.arrayProductos);
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
          console.log('arrayEspecies: ', this.arrayEspecies);
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
          console.log('arrayTipos: ', this.arrayTipos);
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
          console.log('arrayVariedades: ', this.arrayVariedades);
        } else {
          console.error('No hay data!');
        }
      });
  }

  onChangeEspecies(event) {
    let especieSel: any = this.arrayEspecies.find(e => e.id === event).id;
    this.especie = especieSel;
    console.log('especie: ', this.especie);
  }

  onChangeTipos(event) {
    let tipoSel: any = this.arrayTipos.find(t => t.id === event).id;
    this.tipo = tipoSel;
    console.log('tipo: ', this.tipo);
  }

  onChangeVariedades(event) {
    let variedadSel = this.arrayVariedades.find(v => v.id === event).id;
    this.variedad = variedadSel;
    console.log('variedad: ', this.variedad);
  }

  buscarProductos() {
    console.log('paramsProduct', this.especie, this.tipo, this.variedad);
    if(this.especie == undefined){
      this.especie = "0"
    }
    if(this.tipo == undefined){
      this.tipo = "0"
    }
    if(this.variedad == undefined){
      this.variedad = "0"
    }
    this.ejecutarListaProducto(this.especie, this.tipo, this.variedad);
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
