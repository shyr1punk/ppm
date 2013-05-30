function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map")
    pointes = new PPM({});
    airports = new Airports({});
    routes = new Routes({});
    
    map = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 6,
            behaviors: ['default', 'scrollZoom']
        });
    map.controls.add('zoomControl');
    
    pointes.getData();
    airports.getData();
    routes.getData();
    pointes.onMapAll();
    airports.onMapAll();
}