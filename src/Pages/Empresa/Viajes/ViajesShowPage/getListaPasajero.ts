import DataHora from "@/Classes/DataHora";
import IPasajeComplete from "./Types/IPasajeComplete";

export default function getListaPasajero(pasajeros: IPasajeComplete[]) {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Pasajeros</title>
</head>
<style>
    body {
        padding: 5px;
    }

    .tabela {
        border: solid 1px;
        width: 100%;
        margin: 0;
    }

    .primeiraColuna {
        padding-left: 1rem;
        padding-top: 1rem;
        padding-bottom: 1rem
    }

    .datosViaje {
        padding: 5px;
        border: solid 1px;
        border-bottom: 0;
        display: flex;
        justify-content: space-between;
    }

    .datosViaje div h4 {
        margin: 0;
    }

    .datosViaje div p {
        margin: 0;
    }
</style>

<body>
    <div>
        <h2>Datos del Viaje</h2>
    </div>
    <table class="tabela">
        <thead>
            <tr style="text-align:start">
                <th style="text-align:start; width: 50px;">Asiento</th>
                <th style="text-align:start; width: 70px;">Carnet</th>
                <th style="text-align:start;">Nombre</th>
                <th style="text-align:center; width: 120px;">Fecha de Nacimiento</th>
                <th style="text-align:start">Salida</th>
                <th style="text-align:start">Destino</th>
            </tr>
        </thead>
        <tbody>
        ${pasajeros.map((pasajero: IPasajeComplete) => {
        return `<tr class="hover:bg-slate-100">
        <td>
        ${pasajero.nSilla}
    </td>
    <td>${pasajero.carnet}</td>
    <td>${pasajero.nombre}</td>
    <td  style="text-align: center;">
        ${(new DataHora(pasajero.nascimento)).data.imprimir()}
    </td>
    <td>
        ${pasajero.salida.ciudad} - ${pasajero.salida.abreviacion}
    </td>
    <td>
        ${pasajero.destino.ciudad} - ${pasajero.destino.abreviacion}
    </td>
            </tr>`}).join()}
        </tbody>
    </table>
</body>

</html>`
}