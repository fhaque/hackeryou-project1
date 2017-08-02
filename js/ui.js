const $nav_prev = $('.prev_header_hero_block');
const $nav_next = $('.next_header_hero_block');
const $nav_hero = $('.hero_image');

const images = ['images/homes/hero.png','images/blog/blog-header-bg.png', 'images/work/project-hero.jpg'];

$(function() {

    let hero = new Hero({
        $hero: $nav_hero,
        $prev_nav: $nav_prev,
        $next_nav: $nav_next,
        slideDuration: 2000,
        autoAnimation: 'slideToLeft',
        autoDuration: 6000,
        images: images,
    });
});

class Hero {
    //accepts $hero, $prev_nav, $next_nav, slideDuration, autoDuration
    constructor(obj) {
        $.extend(this, obj);

        this.leftImageCSS = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0, 
        };
        this.leftImageResetCSS = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: '100%', 
        }
        this.rightImageCSS = {
            position: 'absolute',
            top: 0,
            left: '100%',
            bottom: 0,
            right: 0, 
        };

        this.imageIndexCounter = new LoopCounter(0, this.images.length - 1);

        //allow asynchronous operation of animations and chainability
        this.animationPromise = Promise.resolve();
        
        this.$leftImage = $('<div>').css(this.leftImageCSS);
        this.$rightImage = $('<div>').css(this.rightImageCSS);

        this.$hero.append(this.$leftImage, this.$rightImage);
        
        //ensure parent hero is positioned
        if (this.$hero.css('position') === 'static') {
            this.$hero.css('position', 'relative');
        }

        //Setup automated animation
        if (!("autoDuration" in this) || this.autoDuration === 0) {
            this.timedAnimateActive = false;
            this.autoDuration = 0;
        } else {
            this.timedAnimateActive = true;
            this.timedAnimate(this[this.autoAnimation || 'slideToLeft']);
        }
        
        //Setup clickable next and previous navigations
        if(("$next_nav" in this) && ("$prev_nav" in this)) {
            this.$next_nav.on('click', this.slideToLeft.bind(this));
            this.$prev_nav.on('click', this.slideToRight.bind(this));
        }

    }

    timedAnimate(animation) {
        setTimeout(() => {
            if (this.timedAnimateActive) {
                animation.call(this);
                this.timedAnimate(animation);
            }
        },this.autoDuration);
    }

    slideToLeft() {
        this.animationPromise = this.animationPromise.then(
        () => {
            return new Promise((resolve, reject) => {
                if (this.$leftImage.width() < this.$rightImage.width()) {
                    this.$leftImage.css(this.rightImageCSS);
                    this.swapLeftRightImageProperties();
                }

                this.imageIndexCounter.increment();
                this.$rightImage.css('background-image', `url('${this.images[this.imageIndexCounter.index]}')`);
                
                this.$leftImage.animate({right: '100%'}, {duration: this.slideDuration, queue: false});
                this.$rightImage.animate({left: '0%'}, {
                    duration: this.slideDuration, 
                    queue: false,
                    complete: () => {
                        //switch the two images and reuse the former leftImage as the new rightImage
                        const $tempImage = this.$leftImage;
                        this.$leftImage = this.$rightImage;
                        this.$rightImage = $tempImage;
                        this.$rightImage.css(this.rightImageCSS);

                        this.animationDone = true;
                        resolve();
                    }
                });
            
            });

        });

        return this;
    }

    slideToRight() {
        this.animationPromise = this.animationPromise.then(
        () => {
            return new Promise((resolve, reject) => {
                if (this.$leftImage.width() > this.$rightImage.width()) {
                    this.$rightImage.css(this.leftImageResetCSS);
                    this.swapLeftRightImageProperties();
                    
                    
                }

                this.imageIndexCounter.decrement();
                this.$leftImage.css('background-image', `url('${this.images[this.imageIndexCounter.index]}')`);
                
                this.$leftImage.animate({right: '0%'}, {duration: this.slideDuration, queue: false});
                this.$rightImage.animate({left: '100%'}, {
                    duration: this.slideDuration, 
                    queue: false,
                    complete: () => {
                        this.animationDone = true;
                        resolve(this);
                    }
                });
            
            });

        });

        return this;
    }

    swapLeftRightImageProperties() {
        const $tempImage = this.$rightImage;
        this.$rightImage = this.$leftImage;
        this.$leftImage = $tempImage;
    }
}


class LoopCounter {
    constructor(start, end) {
        this.start = start;
        this.end = end;

        this.index = start;
    }

    increment() {
        this.index++;
        if (this.index > this.end) {
            this.index = this.start;
        }
        return this.index;
    }

    decrement() {
        this.index--;
        if (this.index < this.start) {
            this.index = this.end;
        }

        return this.index;
    }
}