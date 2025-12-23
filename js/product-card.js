document.addEventListener('DOMContentLoaded', function(){
    // Инициализация превью слайдера
    const sliderThumbs = new Swiper(".productCard__slider-thumbs", {
        direction: "vertical", 
        slidesPerView: 4,
        spaceBetween: 10, 
        centeredSlides: false,
        navigation: {
            nextEl: ".slider__next", 
            prevEl: ".slider__prev" 
        },
        breakpoints: {
            0: {
            direction: "horizontal",
            },
            768: {
            direction: "vertical" 
            }
        }
    });
    const sliderImages = new Swiper(".slider__images", {
        slidesPerView: 1, 
        navigation: {
            nextEl: ".slider__next",
            prevEl: ".slider__prev" 
        },
        grabCursor: true, 
        thumbs: {
            swiper: sliderThumbs 
        },
    });

    // increase and deacrease
    var _productCardCount = document.getElementById('_productCardCount');
    document.addEventListener('click', function(e){
        if(e.target.matches('.js-qnt-increase')){
            _productCardCount.value++;
        }
        else if(e.target.matches('.js-qnt-decrease')){
                _productCardCount.value--;
                if(_productCardCount.value == 0) {
                    _productCardCount.value = 1;
                }
        }
    })

    // Табы
    document.querySelectorAll(".tab--box").forEach((tab) => {
        if (!tab) return;

        const cardClassName = "tab--box";
        const tabDataAttributeName = "data-tab-id";
        const tabClassName = `${cardClassName}__tab`;
        const tabSectionClassName = `${cardClassName}__section`;
        const tabSectionsContainerClassName = `${cardClassName}__body`;
        const tabSectionsContainerSelector = `.${tabSectionsContainerClassName}`;
        const tabSelector = `.${tabClassName}[${tabDataAttributeName}]`;
        const tabSectionSelector = `.${tabSectionClassName}`;
        const activeTabClassName = `${tabClassName}--active`;
        const activeSectionClassName = `${tabSectionClassName}--active`;
        const tabs = tab.querySelectorAll(tabSelector);
        const tabSectionsContainer = tab.querySelector(tabSectionsContainerSelector);

        let observer = null;

        const setTabInactive = (tab) => tab?.classList.remove(activeTabClassName);
        const setTabActive = (tab) => tab?.classList.add(activeTabClassName);
        const setSectionInactive = (section) =>
        section?.classList.remove(activeSectionClassName);

        const getSectionHeight = (section) =>
        section ? section.getBoundingClientRect().height : 0;

        const changeSectionsContainerHeight = (section) => {
        if (section && tabSectionsContainer) {
            tabSectionsContainer.style.height = `${getSectionHeight(section)}px`;
        }
        };

        const getCurrentlyActiveTab = () =>
        tab.querySelector(`.${activeTabClassName}`);

        const getCurrentlyActiveSection = () =>
        tab.querySelector(`.${activeSectionClassName}`);

        const observeContentChanges = (targetSection) => {
        if (!targetSection) return;
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            changeSectionsContainerHeight(targetSection);
        });

        observer.observe(targetSection, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
            attributeFilter: ["style", "class"],
        });
        };

        const setSectionActive = (sectionId) => {
        const currentSection = tab.querySelector(
            `${tabSectionSelector}#${sectionId}`
        );
        if (currentSection) {
            changeSectionsContainerHeight(currentSection);
            currentSection.classList.add(activeSectionClassName);
            observeContentChanges(currentSection);
        }
        };

        const changeTab = (tabButton) => {
        const tabSectionId = tabButton.getAttribute(tabDataAttributeName);
        if (tabSectionId) {
            setTabInactive(getCurrentlyActiveTab());
            setSectionInactive(getCurrentlyActiveSection());
            setTabActive(tabButton);
            setSectionActive(tabSectionId);
        }
        };

        const updateSectionsContainerHeight = () => {
        const currentlyActiveSection = getCurrentlyActiveSection();
        if (currentlyActiveSection) {
            changeSectionsContainerHeight(currentlyActiveSection);
        }
        };

        // Init
        changeTab(getCurrentlyActiveTab());

        tabs.forEach((tabBtn) => {
        tabBtn.addEventListener("click", () => changeTab(tabBtn));
        });

        // Mark as initialized AFTER everything is ready
        window.addEventListener("load", () => {
        updateSectionsContainerHeight();
        tab.classList.add("tab--box--initialized");
        });

        window.addEventListener("resize", updateSectionsContainerHeight);
    });

    // Развернуть все характеристики 
    const expandBtn = document.querySelector('.js-expand-chars');
    const maxShow = parseInt(expandBtn.dataset.maxCharShow, 10);
    const list = document.querySelector('.js-char-list');
    const items = list.querySelectorAll('li');

    let expanded = false;
    function updateListDisplay() {
        items.forEach((item, index) => {
        item.style.display = (expanded || index < maxShow) ? 'flex' : 'none';
        });
        expandBtn.textContent = expanded ? 'Свернуть все характеристики' : 'Развернуть все характеристики';
    }
    expandBtn.addEventListener('click', function (e) {
        e.preventDefault();
        expanded = !expanded;
        updateListDisplay();
    });
    updateListDisplay();

   

});