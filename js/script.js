document.addEventListener('DOMContentLoaded', function(){
        // input mask
        document.querySelectorAll('.phone-mask').forEach(function(inp) {
                inp.addEventListener('input', function() {
                    let value = inp.value;  
                    value = value.replace(/\D/g, '');
                    if (value[0] !== '7') {
                        value = '7' + value;
                    }
                    let formattedValue = '+7 ';
                    if (value.length > 1) {
                        formattedValue += '(' + value.substring(1, 4) + ') ';
                    }
                    if (value.length > 4) {
                        formattedValue += value.substring(4, 7) + ' ';
                    }
                    if (value.length > 7) {
                        formattedValue += value.substring(7, 9) + ' ';
                    }
                    if (value.length > 9) {
                        formattedValue += value.substring(9, 11);
                    }
                    inp.value = formattedValue.trim(); 
                });
        });

        // menu__list-wrap
        const menuListWrap = document.querySelector('.menu__list-wrap');

        if (menuListWrap) {
          function setExactScreenHeight() {
            if (window.innerWidth < 992) {
              const headerHeight = document.querySelector('.header').offsetHeight;
              const viewportHeight = window.innerHeight;
              menuListWrap.style.height = (viewportHeight - headerHeight) + 'px';
              menuListWrap.style.top = headerHeight + 'px';
            } else {
              menuListWrap.style.height = ''; 
            }
          }
          window.addEventListener('resize', setExactScreenHeight);
          setExactScreenHeight();
        }
        
        // burger 
        var burger = document.querySelector('.js-burger')
        var menuList = document.querySelector('.menu__list-wrap');
        document.addEventListener('click', e => {
            if (!e.target.closest('.js-burger') && !e.target.closest('.menu__list-wrap')) {
                burger.classList.remove('clicked');
                menuList.classList.remove('show');
            } 
            else if (e.target.matches('.js-burger')) {
                burger.classList.toggle('clicked');
                menuList.classList.toggle('show');
            }
        });

        // increase and deacrease
        document.addEventListener('click', function(e) {
            if (e.target.matches('.js-oneClick-increase')) {
                var input = e.target.previousElementSibling;
                input.value = parseInt(input.value) + 1;
            } else if (e.target.matches('.js-oneClick-decrease')) {
                var input = e.target.nextElementSibling;
                input.value = Math.max(1, parseInt(input.value) - 1);
            }
        });

        // modal 
        document.addEventListener('click', function (e) {
            if (!e.target.matches('[data-show-modal]')) return;
            else{
            e.preventDefault();
            var modal = document.querySelectorAll('#'+e.target.dataset.id);
            var price = e.target.getAttribute('data-price');
            var modalCalcPrice = document.getElementById("calcPriceInput");
            var modalCalcText = document.querySelector(".calcPriceText");
            if(price){
                if(modalCalcPrice){
                    modalCalcPrice.value = price;
                }
                if(modalCalcText){
                    modalCalcText.textContent = price;
                }
            }
            Array.prototype.forEach.call(modal, function (el) {
                    el.classList.add('active');
            });
            }
        });
        document.addEventListener('click', function (e) {
            if (!e.target.matches('[data-close-modal]')) return;
            else{
                e.target.closest('.modal').classList.remove('active');
            }
        });

        // dropdowns 
        HTMLElement.prototype.slideToggle = function(duration, callback) {
            if (this.clientHeight === 0) {
              _s(this, duration, callback, true);
            } else {
              _s(this, duration, callback);
            }
        };
        HTMLElement.prototype.slideUp = function(duration, callback) {
        _s(this, duration, callback);
        };
        HTMLElement.prototype.slideDown = function (duration, callback) {
        _s(this, duration, callback, true);
        };
        function _s(el, duration, callback, isDown) {
        if (typeof duration === 'undefined') duration = 400;
        if (typeof isDown === 'undefined') isDown = false;
        el.style.overflow = "hidden";
        if (isDown) el.parentNode.classList.add('is-open');
        if (isDown) el.style.display = "block";
        var elStyles        = window.getComputedStyle(el);
        var elHeight        = parseFloat(elStyles.getPropertyValue('height'));
        var elPaddingTop    = parseFloat(elStyles.getPropertyValue('padding-top'));
        var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
        var elMarginTop     = parseFloat(elStyles.getPropertyValue('margin-top'));
        var elMarginBottom  = parseFloat(elStyles.getPropertyValue('margin-bottom'));
        var stepHeight        = elHeight        / duration;
        var stepPaddingTop    = elPaddingTop    / duration;
        var stepPaddingBottom = elPaddingBottom / duration;
        var stepMarginTop     = elMarginTop     / duration;
        var stepMarginBottom  = elMarginBottom  / duration;
        var start;

        function step(timestamp) {
            if (start === undefined) start = timestamp;
            var elapsed = timestamp - start;
            if (isDown) {
            el.style.height        = (stepHeight        * elapsed) + "px";
            el.style.paddingTop    = (stepPaddingTop    * elapsed) + "px";
            el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop     = (stepMarginTop     * elapsed) + "px";
            el.style.marginBottom  = (stepMarginBottom  * elapsed) + "px";
            } else {
            el.style.height        = elHeight        - (stepHeight        * elapsed) + "px";
            el.style.paddingTop    = elPaddingTop    - (stepPaddingTop    * elapsed) + "px";
            el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop     = elMarginTop     - (stepMarginTop     * elapsed) + "px";
            el.style.marginBottom  = elMarginBottom  - (stepMarginBottom  * elapsed) + "px";
            }
            if (elapsed >= duration) {
            el.style.height        = "";
            el.style.paddingTop    = "";
            el.style.paddingBottom = "";
            el.style.marginTop     = "";
            el.style.marginBottom  = "";
            el.style.overflow      = "";
            if (!isDown) el.parentNode.classList.remove('is-open');
            if (!isDown) el.style.display = "none";
            if (typeof callback === 'function') callback();
            } else {
            window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
        }
        document.addEventListener("click", function(e){
			if(!e.target.classList.contains('drop-head')){
			}
			else {
				var nextPanel = e.target.nextElementSibling;
				nextPanel.slideToggle(200);
			}
		})

        // observer, animation on scroll
        const inViewport = (element, observer) => {
            element.forEach(entry => {
                entry.target.classList.toggle("is-inViewport", entry.isIntersecting);
                element.forEach(item => {
                if(item.target.classList.contains('is-inViewport') && !item.target.classList.contains('watched')){
                    item.target.classList.add("watched");
                }
                })
            });
        };
        let ioConfiguration = {
        rootMargin: '0% 0% 0% 0%',
        threshold: 0.2
        };
        const Obs = new IntersectionObserver(inViewport, ioConfiguration);
        const obsOptions = {}; 
        const ELs_inViewport = document.querySelectorAll('[data-inviewport]');
        ELs_inViewport.forEach(EL => {
        Obs.observe(EL, obsOptions);
        });

        // menu for mobile
        if (window.innerWidth < 992) {
            const toggles = document.querySelectorAll('.toggle_ul');
            toggles.forEach(function(toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const nextUl = toggle.closest('li').querySelector('ul');
                    nextUl.classList.toggle('show');
                });
            });
        }

        // swiper 
        const swiperContainers = document.querySelectorAll('.customSwiper');
        swiperContainers.forEach(container => {
            const outerSwiperContainer = container.closest('.swiper-container-outer');
            const outerSwiper = outerSwiperContainer?.swiper;
            const isInnerSwiper = outerSwiper !== null;

            const loop = container.dataset.loop === "true";
            const slidesPerView = parseInt(container.dataset.slidesPerView) || 1;
            const spaceBetween = parseInt(container.dataset.spaceBetween) || 10;
            const autoplay = container.dataset.autoplay === "true";
            const pagination = container.dataset.pagination === "true";
            const breakpoints = container.dataset.breakpoints ? JSON.parse(container.dataset.breakpoints) : {};

            const swiper = new Swiper(container, {
                loop: loop,
                slidesPerView: slidesPerView,
                spaceBetween: spaceBetween,
                autoplay: autoplay ? {
                    delay: 2500,
                    disableOnInteraction: false
                } : false,
                pagination: pagination ? {
                    el: container.querySelector('.swiper-pagination'),
                    clickable: true
                } : false,
                navigation: {
                    nextEl: container.parentNode.querySelector('.swiper-button-next'),
                    prevEl: container.parentNode.querySelector('.swiper-button-prev')
                },
                breakpoints: breakpoints,

                on: {
                    touchStart(swiper, event) {
                        if (isInnerSwiper && outerSwiper) {
                            outerSwiper.disable();
                            event.stopImmediatePropagation();
                        }
                    },
                    touchMove(swiper, event) {
                        if (isInnerSwiper) {
                            event.stopImmediatePropagation();
                        }
                    },
                    touchEnd(swiper, event) {
                        if (isInnerSwiper && outerSwiper) {
                            setTimeout(() => {
                                outerSwiper.enable();
                            }, 300);
                        }
                    }
                }
            });
        });
})


   



