document.addEventListener('DOMContentLoaded', function(){
    window.onload = function () {
        // Инициализация всех слайдеров при загрузке страницы
        const sliderContainers = document.querySelectorAll('.productListing__filter-range');
        sliderContainers.forEach(setupSliderPair);

        // Установка обработчиков чекбоксов
        setupCheckboxListeners();

        // Первоначальное обновление списка выбранных фильтров
        updateCheckedList();
    };

    const minGap = 0; // Минимальный зазор между ползунками

    // Форматирует число с пробелами: 10000 → 10 000
    function formatNumberWithSpace(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    // Настройка одного блока диапазона (два ползунка)
    function setupSliderPair(container) {
        const sliderOne = container.querySelector(".js-range-slider-1");
        const sliderTwo = container.querySelector(".js-range-slider-2");
        const displayValOne = container.querySelector(".js-range-1");
        const displayValTwo = container.querySelector(".js-range-2");
        const sliderTrack = container.querySelector(".js-range-track");
        const max = parseInt(sliderOne.max);
        const min = parseInt(sliderOne.min);

        // Updates slider track color
        function fillColor() {
            const percent1 = (sliderOne.value / max) * 100;
            const percent2 = (sliderTwo.value / max) * 100;
            sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #A6A6A6 ${percent1}%, #A6A6A6 ${percent2}%, #dadae5 ${percent2}%)`;
        }

        // Update left slider
        function slideOne() {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderOne.value = parseInt(sliderTwo.value) - minGap;
            }
            displayValOne.value = sliderOne.value;
            fillColor();

            container.dataset.hasChanged = (sliderOne.value != min || sliderTwo.value != max).toString();
            updateCheckedList();
        }

        // Update right slider
        function slideTwo() {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderTwo.value = parseInt(sliderOne.value) + minGap;
            }
            displayValTwo.value = sliderTwo.value;
            fillColor();

            container.dataset.hasChanged = (sliderOne.value != min || sliderTwo.value != max).toString();
            updateCheckedList();
        }

        // Manual input: left field
        displayValOne.addEventListener('change', function () {
            let val = parseInt(displayValOne.value.replace(/\D/g, '')) || min;
            val = Math.max(min, Math.min(val, sliderTwo.value - minGap));
            sliderOne.value = val;
            slideOne();
        });

        // Manual input: right field
        displayValTwo.addEventListener('change', function () {
            let val = parseInt(displayValTwo.value.replace(/\D/g, '')) || max;
            val = Math.min(max, Math.max(val, parseInt(sliderOne.value) + minGap));
            sliderTwo.value = val;
            slideTwo();
        });

        container.dataset.hasChanged = "false";

        sliderOne.addEventListener("input", slideOne);
        sliderTwo.addEventListener("input", slideTwo);

        slideOne();
        slideTwo();
    }


    // Обработка изменения чекбоксов
    function setupCheckboxListeners() {
        const allCheckboxes = document.querySelectorAll(".productListing__filter-checkbox input[type='checkbox']");
        allCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", function () {
                const dropdown = checkbox.closest(".productListing__filter-dropdown");
                if (dropdown) {
                    const checkboxesInGroup = dropdown.querySelectorAll("input[type='checkbox']");
                    const selectedCount = [...checkboxesInGroup].filter(cb => cb.checked).length;
                    const counter = dropdown.querySelector(".js-checkbox-counter");
                    if (counter) {
                        counter.textContent = selectedCount > 0 ? `${selectedCount}` : "";
                        counter.classList.toggle('active', selectedCount > 0);
                    }
                }

                updateCheckedList();
            });
        });
    }

    // Обновление визуального списка выбранных фильтров
    function updateCheckedList() {
        const checkedListContainer = document.getElementById('productListing__filter-checked-list');
        if (!checkedListContainer) return;

        checkedListContainer.innerHTML = '';

        const hasFilters = [];

        const filterBlocks = document.querySelectorAll('.productListing__filter-dropdown');

        filterBlocks.forEach(block => {
            const head = block.querySelector('.productListing__filter-dropdown-head');
            const title = head?.childNodes[0]?.textContent?.trim();
            const titleKey = title?.toLowerCase().replace(/\s+/g, '-'); // Уникальный ключ для каждого фильтра

            // --- Обработка диапазонных фильтров ---
            const range = block.querySelector('.productListing__filter-range');
            if (range && range.dataset.hasChanged === "true") {
                const valFrom = range.querySelector('.js-range-slider-1').value;
                const valTo = range.querySelector('.js-range-slider-2').value;

                const rangeValueElems = range.querySelectorAll('.productListing__filter-range-value');

                // 
                const fromPrefix = rangeValueElems[0].querySelector('.js-prefix')?.textContent.trim() || '';
                const fromValue = formatNumberWithSpace(valFrom);
                const fromSuffix = rangeValueElems[0].querySelector('.js-suffix')?.textContent.trim() || '';

                // 
                const toPrefix = rangeValueElems[1].querySelector('.js-prefix')?.textContent.trim() || '';
                const toValue = formatNumberWithSpace(valTo);
                const toSuffix = rangeValueElems[1].querySelector('.js-suffix')?.textContent.trim() || '';

                // Assemble clean text parts (ignore empty prefixes like "")
                const fromText = `${fromPrefix ? fromPrefix + ' ' : ''}${fromValue}${fromSuffix ? ' ' + fromSuffix : ''}`;
                const toText = `${toPrefix ? toPrefix + ' ' : ''}${toValue}${toSuffix ? ' ' + toSuffix : ''}`;

                const itemDisplay = document.createElement('div');
                itemDisplay.classList.add('filter-summary-item');
                itemDisplay.innerHTML = `
                    <span>${title}</span>: ${fromText} – ${toText}
                    <span class="remove-filter" data-filter-type="${titleKey}" data-filter-range="true">×</span>
                `;
                checkedListContainer.appendChild(itemDisplay);
                hasFilters.push(true);
            }


            // --- Обработка выбранных чекбоксов ---
            const checkboxes = block.querySelectorAll("input[type='checkbox']");
            const checked = [...checkboxes].filter(cb => cb.checked);

            if (checked.length > 0 && title) {
                const labels = checked.map(cb => cb.parentElement.querySelector('.productListing__filter-checkbox-holder').textContent.trim());
                const itemDisplay = document.createElement('div');
                itemDisplay.classList.add('filter-summary-item');
                itemDisplay.innerHTML = `
                    <span>${title}</span>: ${labels.join(', ')}
                    <span class="remove-filter" data-filter-type="${titleKey}">×</span>
                `;
                checkedListContainer.appendChild(itemDisplay);
                hasFilters.push(true);
            }
        });

        // Показ или скрытие кнопки "Очистить фильтры"
        const resetBtns = document.querySelectorAll('.js-clearFilters');
        resetBtns.forEach(clearBtn => {
            if (hasFilters.length > 0) {
                clearBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    resetAllFilters();
                });
                clearBtn.classList.add('show');
            } else {
                clearBtn.classList.remove('show');
            }
        });

        // индикатор активности кнопки "Фильтры" на мобильном
        const mobileFilterBtn = document.querySelector('.js-head-filterBtn');
        if (mobileFilterBtn) {
            if (hasFilters.length > 0) {
                mobileFilterBtn.classList.add('active');
            } else {
                mobileFilterBtn.classList.remove('active');
            }
        }

        // Сброс одного диапазонного фильтра
        function resetRangeFilter(typeName) {
            const filterBlocks = document.querySelectorAll('.productListing__filter-dropdown');
            filterBlocks.forEach(block => {
                const head = block.querySelector('.productListing__filter-dropdown-head');
                const title = head?.childNodes[0]?.textContent?.trim().toLowerCase().replace(/\s+/g, '-');

                if (title === typeName) {
                    const range = block.querySelector('.productListing__filter-range');
                    if (range) {
                        const sliderOne = range.querySelector('.js-range-slider-1');
                        const sliderTwo = range.querySelector('.js-range-slider-2');
                        const min = parseInt(sliderOne.min);
                        const max = parseInt(sliderOne.max);

                        sliderOne.value = min;
                        sliderTwo.value = max;
                        range.dataset.hasChanged = "false";

                        const event = new Event('input', { bubbles: true });
                        sliderOne.dispatchEvent(event);
                        sliderTwo.dispatchEvent(event);
                    }
                }
            });
        }

        // Обработка кнопок удаления одного фильтра (X)
        const removeButtons = document.querySelectorAll('.remove-filter');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const type = this.dataset.filterType;
                const isRange = this.dataset.filterRange === "true";

                if (isRange) {
                    resetRangeFilter(type);
                } else {
                    resetCheckboxFilter(type);
                }

                updateCheckedList();
            });
        });
    }

    // Сброс выбранных чекбоксов по названию фильтра
    function resetCheckboxFilter(typeName) {
        const filterBlocks = document.querySelectorAll('.productListing__filter-dropdown');
        filterBlocks.forEach(block => {
            const head = block.querySelector('.productListing__filter-dropdown-head');
            const title = head?.childNodes[0]?.textContent?.trim().toLowerCase().replace(/\s+/g, '-');

            if (title === typeName) {
                const checkboxes = block.querySelectorAll("input[type='checkbox']");
                checkboxes.forEach(cb => {
                    if (cb.checked) {
                        cb.checked = false;
                        cb.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            }
        });
    }

    // Полный сброс всех фильтров (ползунки и чекбоксы)
    function resetAllFilters() {
        const allRanges = document.querySelectorAll('.productListing__filter-range');
        allRanges.forEach(range => {
            const sliderOne = range.querySelector('.js-range-slider-1');
            const sliderTwo = range.querySelector('.js-range-slider-2');
            const min = parseInt(sliderOne.min);
            const max = parseInt(sliderOne.max);

            sliderOne.value = min;
            sliderTwo.value = max;
            range.dataset.hasChanged = "false";

            const event = new Event('input', { bubbles: true });
            sliderOne.dispatchEvent(event);
            sliderTwo.dispatchEvent(event);
        });

        const allCheckboxes = document.querySelectorAll(".productListing__filter-checkbox input[type='checkbox']");
        allCheckboxes.forEach(cb => {
            if (cb.checked) {
                cb.checked = false;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        updateCheckedList();
    }

    // показать фильтры в моб. 
    const filterBlock = document.querySelector('.productListing__filter');
    document.addEventListener('click', function(e){
        if(!e.target.matches('[data-show-filter]')){
        }
        else {
            e.preventDefault();
            filterBlock.classList.add('show');
            document.querySelector('body').style.overflow = 'hidden';
        }
    })
    document.addEventListener('click', function(e){
        if(!e.target.matches('[data-close-filter]')){
        }
        else {
            e.preventDefault();
            filterBlock.classList.remove('show');
            document.querySelector('body').style.overflow = 'auto';
        }
    })

})