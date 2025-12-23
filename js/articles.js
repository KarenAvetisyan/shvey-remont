"use strict";

document.addEventListener('DOMContentLoaded', () => {

    const tags = document.querySelectorAll('.articles-tag__item');
    const articles = document.querySelectorAll('.article-item');

    tags.forEach(tag => {
        tag.addEventListener('click', e => {
            e.preventDefault();

            // active state
            tags.forEach(t => t.classList.remove('_active'));
            tag.classList.add('_active');

            const filter = tag.dataset.filter;

            articles.forEach(article => {
                const categories = article.dataset.category.split(' ');

                if (filter === 'all' || categories.includes(filter)) {
                    article.classList.remove('is-hidden');
                } else {
                    article.classList.add('is-hidden');
                }
            });
        });
    });
});