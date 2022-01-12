import { DetallePedidoStoreService } from 'src/app/services/local-session/detalle-pedido-store.service';
import { LoginStoreService } from 'src/app/services/local-session/login-store.services';
import { ToastrService } from 'ngx-toastr';
import { BayerService } from 'src/app/services/bayer.service';
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
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

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

  public fechaHoy = new Date();
  public flagActivaCompra: boolean = false;
  public flagCargando: boolean = false;
  public flagActivoTipo: boolean;
  public flagDesactivoTipo: boolean;
  public flagActivoVariedad: boolean;
  public dataSourceCatalogo = new Array();
  public arrayProductos = new Array();
  public arrayEspecies = new Array();
  public arrayTipos = new Array();
  public arrayVariedades = new Array();

  public arrayVariedad: Array<any> = [
    { id: 0, nombreVariedad: 'Sin variedad semilla' }
  ];

  detalleCompra: any;

  especie: any;
  tipo: any;
  variedad: any;
  productoAgregadoCarro: any;
  arrayCantVacio = [];
  editing = {};
  rows = [];
  labels = [];
  nombreUser: string;
  fechaActual: string;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private loginStoreService: LoginStoreService,
    private detallePedidoStoreService: DetallePedidoStoreService,
    private bayerService: BayerService,
    private datePipe: DatePipe
  ) {
    this.dataSourceCatalogo = [];
    this.arrayCantVacio = [];
  }

  ngOnInit(): void {
    this.cargarComponente();
  }

  cargarComponente() {
    this.flagActivoTipo = false;
    this.flagDesactivoTipo = true;
    this.flagActivoVariedad = false;
    this.flagActivaCompra = false;
    this.fechaHoy = new Date();
    this.fechaActual = this.datePipe.transform(this.fechaHoy, "dd-MM-yyyy");
    let user = this.loginStoreService.obtenerLogin();
    this.nombreUser = user.user.username;
    this.cargarEspeciesSemillas();
    this.cargarTodoProductos();
  }

  recibeResultCarroVacio(event: any) {
    if (event === true) {
      for (let i = 0; i < this.arrayProductos.length; i++) {
        if (this.arrayProductos[i].cantidad > 0 || this.arrayProductos[i].cantidad === undefined) {
          this.arrayProductos[i].cantidad = 0;
          this.validaCantidad(this.arrayProductos[i].cantidad);
        }
      }
    } else {
      console.error('No recibe evento!');
    }
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
      if (productList !== null || productList !== undefined) {
        for (let i = 0; i < productList.length; i++) {
          productList[i].tipoEnvase = productList[i].envase.tipoEnvase;
          productList[i].nombreEspecie = productList[i].especieSemilla.nombreEspecie;
          productList[i].nombreTipo = productList[i].tipoSemilla.nombreTipo;
          productList[i].nombreVariedad = productList[i].variedadSemilla.nombreVariedad;
          productList[i].unidadMedida = productList[i].unidad.unidadMedida;
          productList[i].cantidadMedida = productList[i].unidad.cantidad;
          productList[i].unidadCantidad = `${productList[i].unidad.cantidad}` + " " + `${productList[i].unidad.unidadMedida}`;
          productList[i].cantidad = 0;

          productList[i].precioporUnidad = productList[i].preciosPorMaterial.valorUnidad;
        }
        swal.close();
        this.arrayProductos = productList;
        console.log('arrayProductos: ', this.arrayProductos);
      }
    });
  }

  cargarProductosActualizados() {
    this.listaTodoProductsSubscription = this.bayerService.listarTodoProducto().pipe(take(1)).subscribe((productAct) => {
      if (productAct !== null || productAct !== undefined) {
        for (let i = 0; i < productAct.length; i++) {
          productAct[i].tipoEnvase = productAct[i].envase.tipoEnvase;
          productAct[i].nombreEspecie = productAct[i].especieSemilla.nombreEspecie;
          productAct[i].nombreTipo = productAct[i].tipoSemilla.nombreTipo;
          productAct[i].nombreVariedad = productAct[i].variedadSemilla.nombreVariedad;
          productAct[i].unidadMedida = productAct[i].unidad.unidadMedida;
          productAct[i].cantidadMedida = productAct[i].unidad.cantidad;
          productAct[i].unidadCantidad = `${productAct[i].unidad.cantidad}` + " " + `${productAct[i].unidad.unidadMedida}`;
          productAct[i].cantidad = 0;
          productAct[i].precioporUnidad = productAct[i].preciosPorMaterial.valorUnidad;
        }
        this.arrayProductos = productAct;
        console.log('arrayProductos: ', this.arrayProductos);
      } else {
        console.error('No hay productos!');
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
        if (productList !== null || productList !== undefined && productList.length > -1) {
          for (let i = 0; i < productList.length; i++) {
            productList[i].tipoEnvase = productList[i].envase.tipoEnvase;
            productList[i].nombreEspecie = productList[i].especieSemilla.nombreEspecie;
            productList[i].nombreTipo = productList[i].tipoSemilla.nombreTipo;
            productList[i].nombreVariedad = productList[i].variedadSemilla.nombreVariedad;
            productList[i].cantidadMedida = productList[i].unidad.cantidad;
            productList[i].unidadMedida = productList[i].unidad.unidadMedida;
            productList[i].precioporUnidad = productList[i].preciosPorMaterial.valorUnidad;
            productList[i].unidadCantidad = `${productList[i].unidad.cantidad}` + `" "` + `${productList[i].unidad.unidadMedida}`;
            productList[i].cantidad = 0;
          }
          swal.close();
          this.arrayProductos = productList;
          console.log('arrayProductos: ', this.arrayProductos);
        } else if (productList.length === undefined) {
          let msg = productList.error[0].mensaje
          console.log('msg : ', msg);
          //this.toastrService.error('No hay registros para esta búsqueda!', 'Atención'), 
          setTimeout(() =>
            swal.fire(
              'Error',
              '<span><b><div class="alert alert-danger" role="alert">' +
              '</div></b></span>',
              'error'
            ),
            1000
          );
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
    //this.especie = null;
    //this.flagActivoTipo = false;
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
        } else {
          console.error('No hay data!');
        }
      });
  }

  cargarTiposSemillas(idEspecie: number) {
    this.flagActivoTipo = true;
    this.flagDesactivoTipo = false;
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
            variedades = this.arrayVariedad;
            this.arrayVariedades = variedades;
            console.log('arrayVariedades: ', this.arrayVariedades);
          }
        });
    } else {
      this.listaVariedadesSubscription = this.bayerService
        .filtraPorIdTipo(idTipo)
        .pipe(take(1))
        .subscribe((variedades) => {
          if (variedades !== null || variedades !== undefined) {
            variedades = variedades.sort((a, b) => {
              return a.id.toString().localeCompare(b.id);
            });
            this.arrayVariedades = variedades;
          } else {
            console.error('No hay data!');
          }
        });
    }
  }

  onChangeEspecies(event) {
    let especieSel: any = this.arrayEspecies.find(e => e.id === event).id;
    this.especie = especieSel;
    this.flagActivoVariedad = false;
    this.tipo = null;
    this.variedad = null;
    this.cargarTiposSemillas(this.especie);
  }

  onChangeTipos(event) {
    this.arrayTipos.forEach(t => {
      if (t.id === event) {
        this.tipo = event;
      }
    });
    this.variedad = null;
    this.cargarVariedadesSemillas(this.tipo);
  }

  onChangeVariedades(event) {
    let variedadSel = this.arrayVariedades.find(v => v.id === event).id;
    this.variedad = variedadSel;
  }

  buscarProductos() {
    if(this.tipo == null){
      this.tipo = 0;

    }

    if(this.variedad == null){
      this.variedad = 0;

    }
    this.ejecutarListaProducto(this.especie, this.tipo, this.variedad);
    this.especie = null; 
    this.tipo = null;
    this.variedad = null;
  }

  openDetalleDeCompra(content, rowIndex) {
    // @ts-ignore 
    this.validaCantidad(this.arrayProductos[rowIndex].cantidad);
    this.detalleCompra = this.arrayProductos[rowIndex];
    this.modalReference = this.modalService.open(content, { windowClass: 'modal-in', backdrop: 'static', keyboard: true, size: 'xl' });
  }

  cerrarModal() {
    this.modalReference.close();
  }

  actualizarGrilla() {
    this.cargarProductosActualizados();
  }

  // Llamada para actualizar el valor de la celda
  updateValue(event, rowIndex) {
    console.log('event: ',event.target.value);
    this.arrayProductos[rowIndex].cantidad = event.target.value;
    console.log("event:", event.target.value);
    this.arrayProductos[rowIndex].cantidad = this.arrayProductos[rowIndex].cantidad;
    //console.log("cantidad:" , this.arrayProductos[rowIndex].cantidad);
  }

  disminuirCantidad(rowIndex) {
    if (this.arrayProductos[rowIndex].cantidad == 0) {
      this.arrayProductos[rowIndex].cantidad = 0;
    }
    if (this.arrayProductos[rowIndex].cantidad > 0) {
      this.arrayProductos[rowIndex].cantidad = this.arrayProductos[rowIndex].cantidad - 1;
      console.log("cantidadMenos:", this.arrayProductos[rowIndex].cantidad);
      this.validaCantidad(this.arrayProductos[rowIndex].cantidad);
    }

  }

  aumentarCantidad(rowIndex) {
    this.arrayProductos[rowIndex].cantidad = this.arrayProductos[rowIndex].cantidad + 1;
    console.log("cantidadMas: ", this.arrayProductos[rowIndex].cantidad);
    this.validaCantidad(this.arrayProductos[rowIndex].cantidad);
  }

  validaCantidad(cantidad): boolean {
    if (cantidad > 0) {
      this.flagActivaCompra = true;
      console.log("cantidasVal: ",cantidad);
      this.padNumber(cantidad);
      return this.flagActivaCompra;
    } else if (cantidad === 0){
      this.flagActivaCompra = false;
      this.padNumber(cantidad);
      return this.flagActivaCompra;
    }
  }

  logout() {
    this.loginStoreService.limpiarToken();
    this.loginStoreService.borrarLogin();
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 2000);

  }

  padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      console.error('Valor no es número!');
      return "";
    }
  }

  isNumber(value: any): boolean {
    return !isNaN(this.toInteger(value));
  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
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
