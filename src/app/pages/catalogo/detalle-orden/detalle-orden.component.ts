import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { DetallePedidoStoreService } from 'src/app/services/local-session/detalle-pedido-store.service';
import { LoginStoreService } from 'src/app/services/local-session/login-store.services';
import { BayerService } from 'src/app/services/bayer.service';
import { EmailService } from 'src/app/services/email.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Email } from 'src/app/model/email';
import { EmailEnum } from 'src/app/enum/email-enum';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss']
})
export class DetalleOrdenComponent implements OnInit, OnDestroy {

  @Output() envioCerrarModal = new EventEmitter();
  @Output() actualizoGrilla = new EventEmitter();
  @Output() cancelaProductCompra = new EventEmitter();
  @Output() eliminaProductoCarro = new EventEmitter();
  @Input() nuevoProductoCarro: any;

  private carroCompraSubscription: Subscription;
  private emialSubscription: Subscription;

  public fechaHoy = new Date();
  public flagMostrarTabla: boolean = false;
  public flagCargando: boolean = false;
  public activaCierreModal: boolean = false;

  listaProductosCarro = [];
  listaEnvioProductos = [];
  envListCarroVacio = [];
  nuevoProductoAgregado: any;
  totalPedido: string;
  capturaIdCompra: number;
  fechaActual: string;
  comentario: string;
  email: string;
  mantenerCarro = false;

  formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  })

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private loginStoreService: LoginStoreService,
    private detallePedidoStoreService: DetallePedidoStoreService,
    private bayerService: BayerService,
    private emailService: EmailService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    setTimeout(() =>
      this.cargarComponente(), 200);
  }

  cargarComponente() {
    this.flagCargando = true;
    if (JSON.parse(sessionStorage.getItem('detallePedido')) != null) {
      this.listaProductosCarro = JSON.parse(sessionStorage.getItem('detallePedido'));
    }
    this.nuevoProductoAgregado = this.nuevoProductoCarro;
    console.log(this.nuevoProductoCarro);
    this.listaProductosCarro = this.verificarProductoEnCarro(this.listaProductosCarro);
    sessionStorage.setItem('detallePedido', JSON.stringify(this.listaProductosCarro));
    this.sumarTotalPedido(this.listaProductosCarro);
    this.flagCargando = false;
    this.flagMostrarTabla = true;
    this.activaCierreModal = false;
    let capturaEmail = this.loginStoreService.obtenerLogin();
    this.email = capturaEmail.email;
    this.fechaHoy = new Date();
    this.fechaActual = this.datePipe.transform(this.fechaHoy, "dd-MM-yyyy");
  }

  //Emite una output refrescar al mantenedor del componente padre catalogo
  actualizarGrilla() {
    this.actualizoGrilla.emit();
  }

  // Emite un output de cierre de modal al padre
  cerrarModal() {
    this.cancelaProdustos();
    sessionStorage.removeItem('detallePedido');
    this.activaCierreModal = true;
    this.envioCerrarModal.emit();
    this.mantenerCarro = false;
  }

  cancelaProdustos() {
    let flagCarroVacio = true;
    this.cancelaProductCompra.emit(flagCarroVacio);
  }

  seguirComprando() {
    sessionStorage.setItem('detallePedido', JSON.stringify(this.listaProductosCarro));
    this.envioCerrarModal.emit();
  }

  // call to update cell value
  updateValue(event, rowIndex) {
    console.log('rowIndex: ', rowIndex);
    this.envListCarroVacio.push(rowIndex);
    this.listaProductosCarro[rowIndex].cantidad = event.target.value;
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
    let obtieneProdEliminado = new Array();
    console.log(rowIndex);
    for (let x = 0; x < this.listaProductosCarro.length; x++) {
      if (x === rowIndex) {
        obtieneProdEliminado.push(this.listaProductosCarro[x]);
        this.listaProductosCarro.splice(x, 1);
        this.listaProductosCarro = [...this.listaProductosCarro];
      }
    }
    console.log('listaProductosCarro: ', this.listaProductosCarro);
    this.eliminaProductoCarro.emit(obtieneProdEliminado);
    this.sumarTotalPedido(this.listaProductosCarro);
    this.listaProductosCarro = this.listaProductosCarro;
    sessionStorage.setItem('detallePedido', JSON.stringify(this.listaProductosCarro));
  }

  sumarTotalPedido(listaProductos) {
    let suma = 0;
    let aux = 0;
    for (let i = 0; i < listaProductos.length; i++) {
      aux = listaProductos[i].cantidad * listaProductos[i].precioporUnidad;
      suma = suma + aux;
    }
    let totalCLP = suma;
    this.totalPedido = this.formatter.format(totalCLP);
  }

  verificarProductoEnCarro(listaCarro) {
    let contador = 0;
    console.log('listaCarro', listaCarro);

    if (listaCarro.length > 0) {
      for (let i = 0; i < listaCarro.length; i++) {
        if (listaCarro[i].id === this.nuevoProductoAgregado.id) {
          listaCarro[i].cantidad = this.nuevoProductoAgregado.cantidad + listaCarro[i].cantidad;
          contador++;
        }
        console.log('listaCarroLength: ', listaCarro.length)
        listaCarro[i].precioTotalPorItem = listaCarro[i].cantidad * listaCarro[i].precioporUnidad;
        console.log("carro 2 ", listaCarro[i]);
      }
      if (contador === 0) {
        this.nuevoProductoAgregado.precioTotalPorItem = this.nuevoProductoAgregado.cantidad * this.nuevoProductoAgregado.precioporUnidad;
        listaCarro.push(this.nuevoProductoAgregado);
        console.log("carro 3 ", listaCarro[0]);
      }

      return listaCarro;
    }

    if (listaCarro.length == 0) {
      listaCarro.push(this.nuevoProductoAgregado);
      listaCarro[0].precioTotalPorItem = this.listaProductosCarro[0].cantidad * this.listaProductosCarro[0].precioporUnidad;
      console.log("carro 1 ", listaCarro);
      return listaCarro;
    }
  }

  confirmarCarroCompra() {
    let envioProductoCarro = {
      materialId: null,
      variedadId: null,
      cantidad: null,
      precioUnitario: null,
      precioTotal: null,
    }

    for (let i = 0; i < this.listaProductosCarro.length; i++) {
      envioProductoCarro.materialId = this.listaProductosCarro[i].id;
      envioProductoCarro.variedadId = this.listaProductosCarro[i].variedadSemilla.id;
      envioProductoCarro.cantidad = this.listaProductosCarro[i].cantidad;
      envioProductoCarro.precioUnitario = this.listaProductosCarro[i].precioporUnidad;
      envioProductoCarro.precioTotal = this.listaProductosCarro[i].precioTotalPorItem;
      this.listaEnvioProductos.push(JSON.parse(JSON.stringify(envioProductoCarro)));
    }

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
        if (result.value) {
          if (this.listaProductosCarro !== null || this.listaProductosCarro !== undefined) {
            this.carroCompraSubscription = this.bayerService.carroCompraDetallePedido(this.listaEnvioProductos).subscribe(carro => {
              console.log('carro: ', carro);
              if (carro !== undefined && carro !== null) {
                let response = carro.mensaje;
                this.capturaIdCompra = carro.idCompra;
                this.enviarNotificacionEmail(this.capturaIdCompra);
                setTimeout(() =>
                  swal.fire({
                    title: 'Atención',
                    text: 'Cargando datos ...',
                    imageUrl: 'assets/img/loadingCircucle.gif',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  }), 1);
                setTimeout(() =>
                  swal.fire('Solicitud exitosa', '<span><b><div class="alert alert-success" role="alert">Confirmación exitosa. ' + response + '!</div></b></span>', 'success'), 1000);
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
      }).catch(e => {
        console.log(e);
      });
  }

  enviarNotificacionEmail(idCompra: number) {
    const email: Email = new Email();
    email.content = EmailEnum.textHeaderMessage + EmailEnum.textMessageFecha + this.fechaActual + EmailEnum.textMessageMonto + this.totalPedido;
    email.averageContent = EmailEnum.textAverageMessage;
    email.footerContent = EmailEnum.textFooterMessage;
    email.subject = EmailEnum.subject + idCompra;
    email.email = this.email;
    console.log('email: ', email);
    setTimeout(() =>
      this.toastrService.success('Detalle de compra ' + idCompra + '. Mail enviado exitosamente!', 'Success'), 200);
    this.emialSubscription = this.emailService.email(email).subscribe(dataEmail => {
      if (dataEmail !== null) {
        console.log('email: ', dataEmail);
      }
    });
  }

  volverCatalogoCompra() {
    let ruta = 'catalogo';
    setTimeout(() => {
      this.router.navigate([ruta]);
    }, 2000);
    this.seguirComprando();
    this.actualizarGrilla();
  }

  ngOnDestroy(): void {
    if (this.carroCompraSubscription) {
      this.carroCompraSubscription.unsubscribe();
    }
    if (this.emialSubscription) {
      this.emialSubscription.unsubscribe();
    }
  }

}
