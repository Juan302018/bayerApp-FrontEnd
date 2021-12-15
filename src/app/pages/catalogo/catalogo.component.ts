import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

  private modalReference: NgbModalRef;

  private listaTodoProductsSubscription: Subscription;
  private listaEspeciesSubscription: Subscription;
  private listaTiposSubscription: Subscription;
  private listaVariedadesSubscription: Subscription;

  public flagCargando: boolean = false;
  public flagActivoTipo: boolean;
  public flagActivoVariedad: boolean;
  public flagDesactivo: boolean;
  public dataSourceCatalogo = new Array();
  public arrayProductos = new Array();
  public arrayEspecies = new Array();
  public arrayTipos = new Array();
  public arrayVariedades = new Array();

  especie: any;
  tipo: any;
  variedad: any;

  constructor(
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private bayerService: BayerService
  ) {
    this.dataSourceCatalogo = [];
  }

  ngOnInit(): void {
    this.cargarComponente();
  }

  cargarComponente() {
    this.flagActivoTipo = false;
    this.flagActivoVariedad = false;
    this.cargarEspeciesSemillas();
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
    if (idEspacie !== 0) {
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
      } else {
      this.flagCargando = false;
      setTimeout(
        () =>
          swal.fire(
            'Error',
            '<span><b><div class="alert alert-danger" role="alert">' +
            'No debe ejecutar una especie no válida!' +
            '</div></b></span>',
            'error'
          ),
        1000
      );
    }
    this.especie = null;
    this.flagActivoTipo = false;
  }

  cargarEspeciesSemillas() {
    this.listaEspeciesSubscription = this.bayerService
      .listarEspecies()
      .pipe(take(1))
      .subscribe((especies) => {
        if (especies !== null || especies !== undefined) {
          especies = especies.concat({ id: 0, nombreEspecie: 'Sin especie semilla' });
          especies = especies.sort((a, b) => {
            return a.id.toString().localeCompare(b.id);
          });
          this.arrayEspecies = especies;
          console.log('arrayEspecies: ', this.arrayEspecies);
        } else {
          console.error('No hay data!');
        }
      });
  }

  cargarTiposSemillas(idEspecie: number) {
    this.flagActivoTipo = true;
    if (idEspecie === 0) {
      this.flagCargando = false;
      setTimeout(
        () =>
          swal.fire(
            'Atención!',
            '<span><b><div class="alert alert-warning" role="alert">' +
            'Debe seleccionar un tipo de especie válida!' +
            '</div></b></span>',
            'warning'
          ),
        1000
      );
      this.especie = 0;
    } else {
      this.listaTiposSubscription = this.bayerService
      .filtraPorIdEspecie(idEspecie)
      .pipe(take(1))
      .subscribe((tipos) => {
        if (tipos !== null || tipos !== undefined) {
          tipos = tipos.concat({ id: 0, nombreTipo: 'Sin tipo semilla' });
          tipos = tipos.sort((a, b) => {
            return a.id.toString().localeCompare(b.id);
          });
          this.arrayTipos = tipos;
          console.log('arrayTipos: ', this.arrayTipos);
        } else {
          console.error('No hay data!');
        }
      });
    }
  }

  cargarVariedadesSemillas(idTipo: number) {
    this.flagActivoVariedad = true;
    if (idTipo === 0) {
      this.listaVariedadesSubscription = this.bayerService
        .filtraPorIdTipo(idTipo)
        .pipe(take(1))
        .subscribe((variedades) => {
          if (variedades === null || variedades === undefined) {
            console.log('variedades: ', variedades);
            variedades = { id: 0, nombreVariedad: 'Sin variedad semilla' };
            this.arrayVariedades.push(variedades);
            console.log('arrayVariedades: ', this.arrayVariedades);
          }
        });
    } else {
      this.listaVariedadesSubscription = this.bayerService
        .filtraPorIdTipo(idTipo)
        .pipe(take(1))
        .subscribe((variedades) => {
          if (variedades !== null || variedades !== undefined) {
            console.log('variedades: ', variedades);
            variedades = variedades.sort((a, b) => {
              return a.id.toString().localeCompare(b.id);
            });

            this.arrayVariedades = variedades;
            console.log('arrayVariedades: ', this.arrayVariedades);
          } else {
            console.error('No hay data!');
          }
        });
    }
  }

  onChangeEspecies(event) {
    let especieSel: any = this.arrayEspecies.find(e => e.id === event).id;
    this.especie = especieSel;
    console.log('especie: ',this.especie);
    this.tipo = null;
    this.variedad = null;
    this.cargarTiposSemillas(this.especie);
  }

  onChangeTipos(event) {
    let tipoSel: any = this.arrayTipos.find(t => t.id === event).id;
    this.tipo = tipoSel;
    console.log('tipo: ',this.tipo);
    this.variedad = null;
    this.cargarVariedadesSemillas(this.tipo);
  }

  onChangeVariedades(event) {
    let variedadSel = this.arrayVariedades.find(v => v.id === event).id;
    this.variedad = variedadSel;
    console.log('variedad: ',this.variedad);
  }

  buscarProductos() {
    console.log('paramsProduct', this.especie, this.tipo, this.variedad);
    this.ejecutarListaProducto(this.especie, this.tipo, this.variedad);
  }

  openDetalleDeCompra(content) {
    // @ts-ignore 
    this.modalReference = this.modalService.open(content, { windowClass: 'modal-in', backdrop: 'static', keyboard: true, size: 'xl' });
  }

  cerrarModal() {
    this.modalReference.close();
  }

  actualizarGrilla() {
    this.cargarTodoProductos();
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
