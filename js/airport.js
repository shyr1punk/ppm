/* 
 * Аэропорты
 */

//Конструктор нового объекта местоположения Аэропорта
function Airport(args) {
    this.code = args.code || "";
    this.name = args.name || "";
    this.lat = args.lat || 0;
    this.lng = args.lng || 0;
}

//вывод на карту аэтопорта
Airport.prototype.onMap = function(airport) {
    // Создаем метку.
    airport[this.code] = new ymaps.Placemark([this.lat, this.lng], {
        //balloonContent: "Область: " + this.area + "<br>Город: " + this.name,
    }, {
        iconImageHref: 'img/icon-airport.gif', // картинка иконки
        iconImageSize: [15, 15], // размеры картинки
        iconImageOffset: [-7, -7] // смещение картинки
    });
    airport[this.code].code = this.code;//код аэропорта
    //событие нажатия на метку ППМ
    airport[this.code].events.add('click', function () {
        routes.addAirport(this.code);
    },airport[this.code]);
    map.geoObjects.add(airport[this.code]);
};

//конструктор объекта, хранящий местоположение ППМ
function Airports(args){
    this.airportlist = args.airportlist || new Object();
    this.count = args.count || 0;
    this.placemarks = args.placemarks || new Object();
}


//получаем данные о координатах городов из БД
Airports.prototype.getData = function(){
    var self = this;
    var l = this.airportlist;
    $.getJSON('http://brothersdesign.ru/ppm/php/db.php?type=airport', function(data) {
        $.each(data, function(key, val) {
            l[val.code] = new Airport({
                code:val.code,
                name:val.name,
                lat:val.lat,
                lng:val.lng
            });
        });
        self.onMapAll();
    });
};

Airports.prototype.setData = function(){
    str = '';
    for(id in this.airportlist){
        str += this.airportlist[id].toStringHTML();
    };
    return str;
};

Airports.prototype.onMapAll = function(){
    for(code in this.airportlist){
        this.airportlist[code].onMap(this);
    };
};