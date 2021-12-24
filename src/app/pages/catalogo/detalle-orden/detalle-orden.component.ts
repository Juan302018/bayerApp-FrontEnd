import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { DetallePedidoStoreService } from 'src/app/services/local-session/detalle-pedido-store.service';
import { BayerService } from 'src/app/services/bayer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss']
})
export class DetalleOrdenComponent implements OnInit, OnDestroy {

  @Output() envioCerrarModal = new EventEmitter();
  @Output() actualizoGrilla = new EventEmitter();
  @Input() nuevoProductoCarro: any;

  private carroCompraSubscription: Subscription;

  public flagMostrarTabla: boolean = true;
  public flagCargando: boolean = false;
  public activaCierreModal: boolean = false;

  listaProductosCarro = [];
  listaEnvioProductos = [];
  nuevoProductoAgregado: any;
  totalPedido: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private detallePedidoStoreService: DetallePedidoStoreService,
    private bayerService: BayerService
  ) { }

  ngOnInit(): void {
    setTimeout(() =>
      this.cargarComponente(), 200);
    this.flagMostrarTabla = false;
    this.activaCierreModal = false;
    this.flagCargando = true;
  }

  cargarComponente() {
    if (JSON.parse(sessionStorage.getItem('detallePedido')) != null) {
      if (this.cerrarModal) {
        this.listaProductosCarro = [];
        sessionStorage.removeItem('detallePedido');
      } else if (this.seguirComprando) {
        this.listaProductosCarro = JSON.parse(sessionStorage.getItem('detallePedido'));
      }
    }
    this.nuevoProductoAgregado = this.nuevoProductoCarro;
    console.log(this.nuevoProductoCarro);
    this.verificarProductoEnCarro(this.listaProductosCarro); //?
    //console.log('listaProductosCarro: ', this.listaProductosCarro);
    sessionStorage.setItem('detallePedido', JSON.stringify(this.listaProductosCarro));
    //this.detallePedidoStoreService.guardarCarroCompra(this.listaProductosCarro);
    this.sumarTotalPedido(this.listaProductosCarro);
    this.flagCargando = false;
  }

  //Emite una output refrescar al mantenedor del componente padre catalogo
  actualizarGrilla() {
    this.actualizoGrilla.emit();
  }

  // Emite un output de cierre de modal al padre
  cerrarModal() {
    this.activaCierreModal = true;
    this.envioCerrarModal.emit();
    this.listaProductosCarro = null;
  }

  seguirComprando() {
    this.envioCerrarModal.emit();
  }

  // call to update cell value
  updateValue(event, rowIndex) {
    this.listaProductosCarro[rowIndex].cantidad = event.target.value;
    this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad;;
  }

  disminuirCantidad(rowIndex) {
    if (this.listaProductosCarro[rowIndex].cantidad == 0) {
      this.listaProductosCarro[rowIndex].cantidad = 0;
      this.sumarTotalPedido(this.listaProductosCarro)
    }
    if (this.listaProductosCarro[rowIndex].cantidad > 0) {
      this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad - 1;
      this.listaProductosCarro[rowIndex].precioTotalPorItem = this.listaProductosCarro[rowIndex].cantidad * this.listaProductosCarro[rowIndex].precioporUnidad;
      this.sumarTotalPedido(this.listaProductosCarro)
    }
  }

  aumentarCantidad(rowIndex) {
    this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad + 1;
    this.listaProductosCarro[rowIndex].precioTotalPorItem = this.listaProductosCarro[rowIndex].cantidad * this.listaProductosCarro[rowIndex].precioporUnidad;
    this.sumarTotalPedido(this.listaProductosCarro);
  }

  eliminarProductodeCarro(rowIndex) {
    this.listaProductosCarro.splice(rowIndex, 1);
    console.log('listaProductosCarro: ', this.listaProductosCarro);
    sessionStorage.setItem('detallePedido', JSON.stringify(this.listaProductosCarro));
    this.sumarTotalPedido(this.listaProductosCarro);
    //this.detallePedidoStoreService.borrarCarroCompra();
  }

  sumarTotalPedido(listaProductos) {
    let suma = 0;
    let aux = 0;
    for (let i = 0; i < listaProductos.length; i++) {
      aux = listaProductos[i].cantidad * listaProductos[i].precioporUnidad;
      suma = suma + aux;
    }
    this.totalPedido = suma;
  }

  verificarProductoEnCarro(listaCarro) {
    let contador = 0;
    console.log('listaCarro', listaCarro);
    
    if(this.listaProductosCarro.length > 0){
      for (let i = 0; i < listaCarro.length; i++) {
        if (listaCarro[i].codigoMaterial === this.nuevoProductoAgregado.codigoMaterial) {
          listaCarro[i].cantidad = listaCarro.cantidad + listaCarro[i].cantidad;
          contador++;
        }
        listaCarro[i].precioTotalPorItem = listaCarro[i].cantidad * listaCarro[i].precioporUnidad;
        console.log("carro 2 ",listaCarro[i]);
      }
      if (contador === 0) {
        listaCarro.push(this.nuevoProductoAgregado);
        console.log("carro 3 ", listaCarro[0]);
      }

      return listaCarro;
    }

    if (listaCarro.length === 0) {
      listaCarro.push(this.nuevoProductoAgregado);
      listaCarro[0].precioTotalPorItem = this.listaProductosCarro[0].cantidad * this.listaProductosCarro[0].precioporUnidad;
      console.log("carro 1 ",listaCarro);
      return listaCarro;
    }    
  }

  confirmarCarroCompra() {
    let envioProductoCarro= {
      materialId: null,
      variedadId: null,
      cantidad: null,
      precioUnitario: null,
      precioTotal: null,
    }
    console.log(envioProductoCarro);
    for (let i = 0; i < this.listaProductosCarro.length; i++) {
      envioProductoCarro.materialId = this.listaProductosCarro[i].id;
      envioProductoCarro.variedadId = this.listaProductosCarro[i].variedadSemilla.id;
      envioProductoCarro.cantidad = this.listaProductosCarro[i].cantidad;
      envioProductoCarro.precioUnitario = this.listaProductosCarro[i].precioporUnidad;
      envioProductoCarro.precioTotal = this.listaProductosCarro[i].precioTotalPorItem;
      this.listaEnvioProductos.push(envioProductoCarro);
    }
    console.log('listaProductoCarro: ', this.listaProductosCarro);
    swal.fire({
      title: '¿Está seguro que desea confirmar el detalle de compra?',
      //html: '<span  class="paraLaInterrogracion"><b></b></span>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#73bb6f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      imageHeight: 71.5,
      imageWidth: 71.5,
    })
    .then((result) => {
        if (this.listaProductosCarro !== null || this.listaProductosCarro !== undefined) {
          this.carroCompraSubscription = this.bayerService.carroCompraDetallePedido(this.listaEnvioProductos).subscribe(carro => {
            console.log('carro: ', carro);
            if (carro !== undefined && carro !== null) {
              let response = carro.mensaje;
              console.log('response: ',response);
              setTimeout(() => swal.fire({
                title: 'Atención',
                text: 'Cargando datos ...',
                imageUrl: 'assets/img/loadingCircucle.gif',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              }), 100);
              setTimeout(() =>
                swal.fire('Solicitud exitosa', '<span><b><div class="alert alert-success" role="alert">Confirmación exitosa! </div></b></span>', 'success'), 2000);
              this.listaProductosCarro = [];
              this.detallePedidoStoreService.borrarCarroCompra();
              this.actualizarGrilla();
              swal.close();
              this.cerrarModal();
            } else {
              this.toastrService.error('No se registraron los productos!', 'Error');
              swal.close();
            }
          });
        }
    }).catch( e =>{
      console.log(e);
    });
  }

  volverCatalogoCompra() {
    let ruta = 'catalogo';
    this.router.navigate([ruta]);
    this.seguirComprando();
    this.actualizarGrilla();
  }

  ngOnDestroy(): void {
    if (this.carroCompraSubscription) {
      this.carroCompraSubscription.unsubscribe();
    }
  }

}
