const $nav_prev = $('.prev_header_hero_block');
const $nav_next = $('.next_header_hero_block');
const $nav_hero = $('.hero_image');
const $nav_hero_image_1 = $('.hero_image_1');
const $nav_hero_image_2 = $('.hero_image_2');

$(function() {

    let hero = new Hero({
        $hero: $nav_hero,
        slideDuration: 5000,
        autoDuration: 500,
    });
    hero.slideToLeft().then((obj) => obj.slideToRight());


});

class Hero {
    //accepts $hero, $prev_nav, $next_nav, slideDuration, autoDuration
    constructor(obj) {
        $.extend(this, obj);
        const leftImageCSS = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0, 
        };
        const rightImageCSS = {
            position: 'absolute',
            top: 0,
            left: '100%',
            bottom: 0,
            right: 0, 
        };
        this.$leftImage = $('<div>').css(leftImageCSS);
        this.$rightImage = $('<div>').css(rightImageCSS);

        this.$hero.append(this.$leftImage, this.$rightImage);
        
        if (this.$hero.css('position') === 'static') {
            this.$hero.css('position', 'relative');
        }
    }

    slideToLeft() {
        return new Promise((resolve, reject) => {
            this.$rightImage.css('background-image', `url('images/blog/blog-header-bg.png')`);
            // this.$leftImage.css('background-image', `url('images/work/project-hero.jpg')`);
            this.$leftImage.animate({right: '100%'}, {duration: this.slideDuration, queue: false});
            this.$rightImage.animate({left: '0%'}, {
                duration: this.slideDuration, 
                queue: false,
                complete: () => {
                    console.log("slidetoleft");
                    resolve(this);
                }
            });  
        });
    }

    slideToRight() {
        return new Promise((resolve, reject) => {
            // this.$rightImage.css('background-image', `url('images/blog/blog-header-bg.png')`);
            this.$leftImage.css('background-image', `url('images/work/project-hero.jpg')`);
            this.$leftImage.animate({right: '0%'}, {duration: this.slideDuration, queue: false});
            this.$rightImage.animate({left: '100%'}, {
                duration: this.slideDuration, 
                queue: false,
                complete: () => {
                    console.log("slidetoright");
                    resolve(this);
                }
            });

        });
    }

}


// $nav_hero.animate({
//     filter: 'brightness(0)',
// },1000, () => console.log("finished"));
