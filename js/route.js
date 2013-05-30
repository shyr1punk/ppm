/* 
 * Маршруты
 */

function Route(args) {
    this.id = args.id || 0;
    this.points = args.points || [];
    this.coords = args.coords || [];
    this.begin = args.begin || undefined;
    this.end = args.end || undefined;
    this.line = new ymaps.Polyline([],{
        hintContent: "Ломаная линия"
    }, {
        strokeColor: '#ff0000',
        strokeWidth: 4
    });
}

Route.prototype.onMap = function(){
    this.line.geometry.setCoordinates(this.coords);
    map.geoObjects.add(this.line);
};

Route.prototype.onPanel = function(){
    var r = '<div id="route' + this.id + '" class="alert alert-info"><h5>Маршрут №' + this.id + '<h5>';
    r += 'Вылет: ' + airports.airportlist[this.begin].name + "<br />";
    this.points.forEach(function(ppm) {
        r += pointes.ppmlist[ppm].name + "<br />";
    });
    r += 'Прилёт: ' + airports.airportlist[this.end].name + "<br />";
    r += '</div>';
    $("#routeList").append(r);
};

//конструктор объекта массивом, хранящий местоположение ППМ
function Routes(args) {
    this.items = args.items || new Array();
    this.current = 0;
    this.editing = 0;
}

Routes.prototype.newRoute = function() {
    this.current = this.items.length;
    this.editing = 1;
    this.items[this.current] = new Route({id:this.current});
    // Добавляем линию на карту.
    map.geoObjects.add(this.items[this.current].line);
    //Выводим описание в сайдбар
    $("#routeList").append('<div id="route' + this.current + '" class="alert alert-info"><h5>Маршрут №' + this.current + '<h5></div>');
};

Routes.prototype.addPPM = function(ppmid) {
    if (this.editing) {
        if (this.items[this.current].begin !== undefined) {
            this.items[this.current].points.push(ppmid);
            this.items[this.current].coords.push([pointes.ppmlist[ppmid].lat, pointes.ppmlist[ppmid].lng]);
            this.items[this.current].line.geometry.setCoordinates(this.items[this.current].coords);
            $('#route' + this.current).append(pointes.ppmlist[ppmid].name + "<br />");
        }
    }
};

Routes.prototype.addAirport = function(airportcode) {
    if (this.editing) {
        if (this.items[this.current].begin === undefined) {
            this.items[this.current].begin = airportcode;
            $('#route' + this.current).append('Вылет: ' + airports.airportlist[this.items[this.current].begin].name + "<br />");
        } else if (this.items[this.current].end === undefined) {
            this.items[this.current].end = airportcode;
            $('#route' + this.current).append('Прилёт: ' + airports.airportlist[this.items[this.current].end].name + "<br />");
            this.saveRoute();
        }
        this.items[this.current].coords.push([airports.airportlist[airportcode].lat, airports.airportlist[airportcode].lng]);
        this.items[this.current].line.geometry.setCoordinates(this.items[this.current].coords);
    }
};

Routes.prototype.saveRoute = function() {
    if (this.editing) {
        var self = this;
        console.log("Маршрут сохранён");
        this.editing = 0;
        $.ajax({
            type: "POST",
            url: "php/saveroute.php",
            dataType: 'JSON',
            data: {
                route: self.current,
                begin : self.items[self.current].begin,
                end : self.items[self.current].end,
                ppm : self.items[self.current].points
            },
            beforesend: $('#status').html('Загрузка'),
            success: function(data, code) {
                if (code == 200) {
                    $('#status').html(data); // запрос успешно прошел
                } else {
                    $('#status').html(code); // возникла ошибка, возвращаем код ошибки
                }

                $('#status').html(data); // данные которые вернул сервер!

            },
            error: function(xhr, str) {
                $('#status').html('Критическая ошибка');
            },
            complete: function() { //а тут ничего из предложенных параметров не берем :)
                //$('#something').hide(); //например, спрятали какую-то кнопочку, которая вызывала запрос
            }
        });
    }
};

Routes.prototype.getData = function(){
    var self = this;
    var l = this.items;
    $.getJSON('http://brothersdesign.ru/ppm/php/db.php?type=routes', function(data) {
        $.each(data, function(key, val) {
            console.log(val);
            l[val.id] = new Route({
                id : val.id,
                begin : val.begin,
                end : val.end,
                points : val.points,
                coodrs : []
            });
            l[val.id].onPanel();
        });
    });
};