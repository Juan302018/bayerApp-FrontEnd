import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { DetallePedidoStoreService } from 'src/app/services/local-session/detalle-pedido-store.service';
import { BayerService } from 'src/app/services/bayer.service';
import { ToastrService } from 'ngx-toastr';
import { DetallePedido } from 'src/app/model/detalle-pedido';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss']
})
export class DetalleOrdenComponent implements OnInit, OnDestroy {

  @Output() envioCerrarModal = new EventEmitter();
  @Output() actualizoGrilla = new EventEmitter();
  @Input() nuevoProductoCarro: any;

  private confirmaDetalleSubscription: Subscription;

  public flagMostrarTabla: boolean = true;
  public flagCargando: boolean = false;

  envioProductoCarro = [];
  listaProductosCarro = [];
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
    this.envioProductoCarro = [];
    this.listaProductosCarro = [];
    this.flagMostrarTabla = false;
    this.flagCargando = true;
  }

  cargarComponente() {
    if (JSON.parse(localStorage.getItem('detallePedido')) != null) {
      this.listaProductosCarro = JSON.parse(localStorage.getItem('detallePedido'));
    }
    console.log(this.nuevoProductoCarro);
    this.nuevoProductoAgregado = this.nuevoProductoCarro;
    this.verificarProductoEnCarro();
    console.log('listaProductosCarro: ', this.listaProductosCarro);
    localStorage.setItem('detallePedido', JSON.stringify(this.listaProductosCarro));
    this.detallePedidoStoreService.guardarCarroCompra(this.listaProductosCarro);
    this.sumarTotalPedido(this.listaProductosCarro);
    this.flagCargando = false;
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

  disminuirCantidad(rowIndex) {
    if (this.listaProductosCarro[rowIndex].cantidad == 0) {
      this.listaProductosCarro[rowIndex].cantidad = 0;
      this.sumarTotalPedido(this.listaProductosCarro)
    }
    if (this.listaProductosCarro[rowIndex].cantidad > 0) {
      this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad - 1;
      this.sumarTotalPedido(this.listaProductosCarro)
    }
  }

  aumentarCantidad(rowIndex) {
    this.listaProductosCarro[rowIndex].cantidad = this.listaProductosCarro[rowIndex].cantidad + 1;
    this.sumarTotalPedido(this.listaProductosCarro)
  }

  eliminarProductodeCarro(rowIndex) {
    this.listaProductosCarro.splice(rowIndex, 1);
    console.log('listaProductosCarro: ', this.listaProductosCarro);
    localStorage.setItem('detallePedido', JSON.stringify(this.listaProductosCarro));
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

  verificarProductoEnCarro() {
    let contador = 0;
    console.log('listaProductosCarro', this.listaProductosCarro);
    for (let i = 0; i < this.listaProductosCarro.length; i++) {
      if (this.listaProductosCarro[i].codigoMaterial === this.nuevoProductoAgregado.codigoMaterial) {
        this.listaProductosCarro[i].cantidad = this.nuevoProductoAgregado.cantidad + this.listaProductosCarro[i].cantidad;
        contador++;
      }
      this.listaProductosCarro[i].precioTotalPorItem = this.listaProductosCarro[i].cantidad * this.listaProductosCarro[i].precioporUnidad;
    }
    if (contador === 0) {
      this.listaProductosCarro.push(this.nuevoProductoAgregado);
    }
  }

  confirmarCarroCompra() {
    this.envioProductoCarro = [];
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
    }).then((result) => {
      if (result.value) {
        if (this.listaProductosCarro !== null || this.listaProductosCarro !== undefined) {
          for (let i = 0; i < this.listaProductosCarro.length; i++) {
            this.listaProductosCarro[i].materialId = this.listaProductosCarro[i].id;
            this.listaProductosCarro[i].variedadId = this.listaProductosCarro[i].variedadSemilla.id;
            this.listaProductosCarro[i].cantidad = this.listaProductosCarro[i].cantidad;
            this.listaProductosCarro[i].precioUnitario = this.listaProductosCarro[i].precioporUnidad;
            this.listaProductosCarro[i].precioTotal = this.listaProductosCarro[i].precioTotalPorItem;
          }
          console.log('listaProductoCarro: ', this.listaProductosCarro);
          this.confirmaDetalleSubscription = this.bayerService.carroCompraDetallePedido(this.listaProductosCarro).subscribe(carro => {
            console.log('carro: ', carro);
            if (carro !== undefined && carro !== null) {
              let response = carro;
              console.log('response: ', response);
              setTimeout(() => swal.fire({
                title: 'Atención',
                text: 'Cargando datos ...',
                imageUrl: 'assets/img/loadingCircucle.gif',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              }), 100);
              setTimeout(() =>
                swal.fire('Solicitud exitosa', '<span><b><div class="alert alert-success" role="alert">Confirmación exitosa!</div></b></span>', 'success'), 1000);
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
      } else {
        console.log('se cancela');
      }
    });
  }

  volverCatalogoCompra() {
    let ruta = 'catalogo';
    this.router.navigate([ruta]);
    this.cerrarModal();
    this.actualizarGrilla();
  }

  ngOnDestroy(): void {
    if (this.confirmaDetalleSubscription) {
      this.confirmaDetalleSubscription.unsubscribe();
    }
  }

}
