function createMap() {
  //Defines las variables
  let api =
    'https://opensheet.elk.sh/17h5q34xXFcAXCrgKr46Ke1OnOvOO7s6iZpSjTkbwD5M/6'
  //
  let select = document.getElementById('select-location')
  // COORDENADAS DE INICIO
  var map = L.map('map').setView([31.676995715562786, -106.36449413988777], 11.49)
  //
  // ICONO POZO
  var tanqueIcon = L.icon({
    iconUrl: './assets/images/icons/33606.png',
    iconSize: [50, 50],
    iconAnchor: [20, 20],
    popupAnchor: [10, -10],
  })
  var dataIcon = L.icon({
    iconUrl: './assets/images/icons/dataIcon.png',
    iconSize: [40, 40],
    iconAnchor: [10, 04],
    popupAnchor: [14, -3],
  })
  var pozoIcon = L.icon({
    iconUrl: './assets/images/icons/motorIcon.png',
    iconSize: [40, 60], // size of the icon
    iconAnchor: [10, 04], // point of the icon which will correspond to marker's location
    popupAnchor: [11, -4], // point from which the popup should open relative to the iconAnchor
  })
  //
  // PRUEBAS {{{
  //info {{{
  var info = L.control()

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info')
    this.update()
    return this._div
  }
//alarma y alertas 
  info.update = function (props) {
    this._div.innerHTML = '<h4>Alertas</h4>'
    this._div.setAttribute('id', 'panelNot')
  }
  info.addTo(map)
  //}}}
 
  
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
})
  .addTo(map)
  // FUNCION QUE CREA LOS ELEMENTOS PARA LA LISTA DE LAS ETIQUETAS
  document
    .getElementById('select-location')
    .addEventListener('change', function (e) {
      let coords = e.target.value.split(',')
      map.flyTo(coords, 17)
    })
  //
  // AQUI SE EMPIEZA A USAR LA API
  fetch(api)
    .then((res) => res.json())
    .then((info) => {
      // console.log(info)
      var popupOptions = {
        maxWidth: '500',
        className: 'custom-popup',
      }
      // Se inicia un loop para que verifique el ID y apartir de ahi definir la variable "popupContent" que es la que se muestra al final
      for (var i = 0; i < info.length; i++) {
        // console.log('NOMBRE: ' + info[i].NUMERO + '\n' + "NIVEL: " + info[i].VALUE + "\n" + "LATITUD: " + info[i].LAT + "\n" + "LONGITUD: " + info[i].LONG)
        let inf = info[i]
        if (inf.ID == 0) {
          // Si el ID es igual a 0 se muestra lo siguiente:
          var popupContent = `<h3>${inf.NUMERO}</h3>
            <hr color="#00008B" size="4"><table border='0' style='font-size:12x;'><tr><td style='color:#00008B;font-weight:bold;padding-left:10px'><td style="width: 400px;background-color:#DEB887</td><td style="vertical-align: text-middle;">
            <b>Nivel: </b>${inf.NIVEL}<br>
            <b>Gasto de Entrada: </b>${inf.GE}<br>
            <b>Gasto de Salida: </b>${inf.GS}<br>
            <b>Fecha Actualización: </b>${inf.ACT}
            </td></tr></table>`
          // Luego de declarar lo que se va mostrar se agrega al mapa:
          var marker = L.marker([info[i].LAT, info[i].LONG],{ icon: tanqueIcon })
            .addTo(map)
            .bindPopup(popupContent, popupOptions) //Aqui se agrega lo declarado antes y la variable global "popupOptions"
        } else if (inf.ID == 1) {
          // Si el ID es igual a 1 se muestra lo siguiente:
          var popupContent = `<h3>${inf.NUMERO}</h3>
            <hr color="#00008B" size="4"><table border='0' style='font-size:12x;'><tr><td style='color:#00008B;font-weight:bold;padding-left:10px'><td style="width: 400px;background-color:#DEB887</td><td style="vertical-align: text-middle;">
            <b>Presión de Entrada: </b>${inf.PE}<br>
            <b>Presión de Salida: </b>${inf.PS}<br>
            <b>Gasto de Entrada: </b>${inf.GE}<br>
            <b>Fecha Actualización: </b>${inf.ACT}
            </td></tr></table>`
          var marker = L.marker([info[i].LAT, info[i].LONG],{ icon: dataIcon })
            .addTo(map)
            .bindPopup(popupContent, popupOptions)
        } else if (inf.ID == 2) {
          // Si el ID es igual a 2 se muestra lo siguiente:
          var popupContent = `<h3>${inf.NUMERO}</h3>
            <hr color="#00008B" size="4"><table border='0' style='font-size:12x;'><tr><td style='color:#00008B;font-weight:bold;padding-left:10px'><td style="width: 400px;background-color:#DEB887</td><td style="vertical-align: text-middle;">
            <b>Gasto de Salida: </b>${inf.GS}<br>
            <b>Presión: </b>${inf.PS}<br>
            <b>Estatus: </b>${inf.EST}<br>
            <b>Fecha Actualización: </b>${inf.ACT}
            </td></tr></table>`
          var marker = L.marker([info[i].LAT, info[i].LONG],{ icon: pozoIcon })
            .addTo(map)
            .bindPopup(popupContent, popupOptions)
        } else {
          console.log('No se econtro ID para: ' + inf.NUMERO)
        }
        // Aqui con la informacion sacada de la api obtenemos el NOMBRE y las CORDENADAS
        var opt = document.createElement('option')
        opt.value = info[i].LAT + ',' + info[i].LONG //Aqui separa las cordenadas para que sean compatibles con el html
        opt.innerHTML = info[i].NUMERO //Aqui se obtiene el Nombre
        select.appendChild(opt) // aqui agrega cada uno a la lista
      }
    })
}

function createGraph() {
  // Definimos la api
  let api =
    'https://opensheet.elk.sh/1VZjXk2fLaotH0MThrkYCJL6ZCTvuvprkB2zn9J1xht4/2'
  //
  // Comenzamos a usar la api
  fetch(api)
    .then((res) => res.json())
    .then((info) => {
      google.charts.load('current', { packages: ['corechart'] })
      google.charts.setOnLoadCallback(drawChart)
      function drawChart() {
        var data = new google.visualization.DataTable()
        data.addColumn('string', 'POZOS')
        data.addColumn('number', 'PROMEDIO')
        for (var i = 0; i < info.length; i++) {
          let prom = parseFloat(info[i].PROMEDIO)
          // console.log(info[i].NOMBRE, prom)
          data.addRow([info[i].NOMBRE, prom])
        }
        // Set chart options
        var options = {
          title: 'PROMEDIO POZOS',
          width: 400,
          height: 300,
        }
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(
          document.getElementById('chart_div')
        )
        chart.draw(data, options)
      }
    })
  console.log('reload')
}

function notifications() {
  function notify(text) {
    let p = document.createElement('div')
    p.innerHTML = text
    return p
  }
  let api =
    'https://opensheet.elk.sh/17h5q34xXFcAXCrgKr46Ke1OnOvOO7s6iZpSjTkbwD5M/6'
  let panel = document.getElementById('panelNot')
  fetch(api)
    .then((res) => res.json())
    .then((info) => {
      for (let i = 0; i < info.length; i++) {
        const inf = info[i]
        if (inf.NIVEL >50) {
          console.log('prueba')
          panel.appendChild(
            // notify(inf.NUMERO + '  PRESIÓN ALTA  ' + inf.NIVEL)
            notify(`<h3>${inf.NUMERO}</h3>
            <b>Nivel: </b>${inf.NIVEL}<br>
            <b>Fecha Actualización: </b>${inf.ACT}
            <hr class="nHr"><table class="nTable" border='0'><tr><td><td style="width: 400px;background-color:#DEB887</td><td style="vertical-align: text-middle;">
            
            
            </td></tr></table>`)
          )
        }
        
      }
      console.log(info)
    })
  // console.log("prueba")
}

if (document.getElementById('map')) {
  console.log('map')
  createMap()
  notifications()
  // setInterval(createMap,3000);
} else if (document.getElementById('chart_div')) {
  console.log('graph')
  setInterval(createGraph, 3000)
} else {
  alert('Ocurrio un error')
}
