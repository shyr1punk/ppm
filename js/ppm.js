/* 
 * Промежуточные пункты маршрута
 */

//конструктор объекта, хранящий местоположение ППМ
function PPM(args){
    this.ppmlist = args.ppmlist || new Object();
    this.count = args.count || 0;
    this.placemarks = args.placemarks || new Object();
}


//получаем данные о координатах городов из БД
PPM.prototype.getData = function(){
    var self = this;
    var l = this.ppmlist;
    $.getJSON('http://brothersdesign.ru/ppm/php/db.php?type=ppm', function(data) {
        $.each(data, function(key, val) {
            l[val.ID] = new Coordinates({
                id:val.ID,
                name:val.name,
                area:val.area,
                lat:val.lat,
                lng:val.lng
            });
        });
        self.onMapAll();
    });
};

PPM.prototype.setData = function(){
    str = '';
    for(id in this.ppmlist){
        str += this.ppmlist[id].toStringHTML();
    };
    return str;
};

PPM.prototype.onMapAll = function(){
    for(id in this.ppmlist){
        this.ppmlist[id].onMap(this);
    };
};

//Конструктор нового объекта местоположения ППМ
function Coordinates(args) {
    this.id = args.id || 0;
    this.name = args.name || "";
    this.area = args.area || "";
    this.lat = args.lat || 0;
    this.lng = args.lng || 0;
}

//вывод в формате HTML
Coordinates.prototype.toStringHTML = function() {
    return ("<br>" + this.id +
        "<br>" + this.name +
        "<br>" + this.area + 
        "<br>" + this.lat + 
        "<br>" + this.lng);
};

//вывод на карту
Coordinates.prototype.onMap = function(ppm) {
    // Создаем метку.
    ppm[this.id] = new ymaps.Placemark([this.lat, this.lng], {
        //balloonContent: "Область: " + this.area + "<br>Город: " + this.name,
    }, {
        iconImageHref: 'img/RedDot.png', // картинка иконки
        iconImageSize: [6, 6], // размеры картинки
        iconImageOffset: [-3, -3] // смещение картинки
    });
    ppm[this.id].id = this.id;//id ППМ
    //событие нажатия на метку ППМ
    ppm[this.id].events.add('click', function () {
        routes.addPPM(this.id);
    },ppm[this.id]);
    map.geoObjects.add(ppm[this.id]);
};