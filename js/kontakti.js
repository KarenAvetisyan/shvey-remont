document.addEventListener('DOMContentLoaded', () => {
    ymaps.ready(init);

    function init() {
    var placemarks = [
        {
            coords: [55.795929, 37.607664],
            hint: `Москва, ул. Cтрелецкая 16,`,
            balloon: `Москва, ул. Cтрелецкая 16,`,
            buttonId: '_address_1'
        },
        {
            coords: [55.767595, 37.575648],
            hint: `Москва, ул. Климашкина 8`,
            balloon: `Москва, ул. Климашкина 8`,
            buttonId: '_address_2'
        },
        {
            coords: [55.710038, 37.630472],
            hint: `Москва, Гамсоновский переулок, 1`,
            balloon: `Москва, Гамсоновский переулок, 1`,
            buttonId: '_address_3'
        },
        {
            coords: [55.701702, 37.852380],
            hint: "Лермонтовский проспект",
            balloon: "Лермонтовский проспект",
            buttonId: '_address_4'
        },
    ];

    // Optional initial center before setBounds
    var map = new ymaps.Map("map", {
        center: [55.75, 37.62],
        zoom: 10,
        controls: ["typeSelector", "fullscreenControl"]
    });

    placemarks.forEach(function(placemark) {
        var iconSize = window.innerWidth < 768 ? [35, 45] : [52, 66];

        var placemarkObj = new ymaps.Placemark(placemark.coords, {
            hintContent: placemark.hint,
            balloonContent: placemark.balloon,
        }, {
            iconLayout: 'default#image',
            iconImageHref: '../img/icons/placemark.png',
            iconImageSize: iconSize,
            iconImageOffset: [-15, -42] 
        });

        map.geoObjects.add(placemarkObj);

        placemarkObj.events.add('mouseenter', function () {
            document.getElementById(placemark.buttonId).classList.add('highlighted');
        });
        placemarkObj.events.add('mouseleave', function () {
            document.getElementById(placemark.buttonId).classList.remove('highlighted');
        });
    });

    // Automatically center and zoom to fit all placemarks
    map.setBounds(map.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 40
    });

    placemarks.forEach(function(placemark) {
        var button = document.getElementById(placemark.buttonId);
        if (button) {
            button.addEventListener('mouseenter', function () {
                map.balloon.open(placemark.coords, placemark.hint);
            });
            button.addEventListener('mouseleave', function () {
                map.balloon.close(); 
            });
        }
    });
}

});
document.getElementById('map').addEventListener('mouseleave', function() {
    var buttons = document.querySelectorAll('[id^="_address_"]');
    buttons.forEach(function(button) {
        button.classList.remove('highlighted');
    });
});