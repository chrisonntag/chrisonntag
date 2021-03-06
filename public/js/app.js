import { gsap } from "gsap";
import { Swiper } from 'swiper';
import 'lazysizes';
import initPageTransitions from "./initPageTransitions";

/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */

class Slider {
    constructor() {
        initPageTransitions();
        this.initDemo();
        this.initSwiper();
        window.lazySizes.init();
    }

    initDemo() {
        const { Back } = window;
        this.cursor = document.querySelector(".arrow-cursor");
        this.cursorIcon = document.querySelector(".arrow-cursor__icon");
        this.cursorBox = this.cursor.getBoundingClientRect();
        this.easing = "back.out(1.7)"; //Back.easeOut.config(1.7);
        this.animationDuration = 0.3;
        this.cursorSide = null; // will be "left" or "right"
        this.cursorInsideSwiper = false;

        // initial cursor styling
        gsap.to(this.cursorIcon, {
            duration: 0,
            rotation: -135,
            opacity: 0,
            scale: 0.5
        });

        document.addEventListener("mousemove", e => {
            this.clientX = e.clientX;
            this.clientY = e.clientY;
        });

        const render = () => {
            gsap.set(this.cursor, {
                x: this.clientX,
                y: this.clientY
            });
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // mouseenter
        const onSwiperMouseEnter = e => {
            this.swiperBox = e.target.getBoundingClientRect();

            if (!this.clientX) this.clientX = e.clientX;
            if (!this.clientY) this.clientY = e.clientY;

            let startRotation;
            if (this.clientY < this.swiperBox.top + this.swiperBox.height / 2) {
                startRotation = -135;
            } else {
                startRotation = this.clientX > window.innerWidth / 2 ? 135 : -315;
            }
            gsap.set(this.cursorIcon, {
                rotation: startRotation
            });

            this.cursorSide = this.clientX > window.innerWidth / 2 ? "right" : "left";

            gsap.to(this.cursorIcon, {
                rotation: this.cursorSide === "right" ? 0 : -180,
                scale: 1,
                duration: this.animationDuration,
                opacity: 1,
                ease: this.easing
            });
        };

        // mouseLeave
        const onSwiperMouseLeave = e => {
            this.swiperBox = e.target.getBoundingClientRect();

            let outRotation = 0;
            if (this.clientY < this.swiperBox.top + this.swiperBox.height / 2) {
                outRotation = this.cursorSide === "right" ? -135 : -45;
            } else {
                outRotation = this.cursorSide === "right" ? 135 : -315;
            }

            gsap.to(this.cursorIcon, {
                rotation: outRotation,
                duration: this.animationDuration,
                opacity: 0,
                scale: 0.3
            });

            this.cursorSide = null;
            this.cursorInsideSwiper = false;
        };

        // move cursor from left to right or right to left inside the Swiper
        const onSwitchSwiperSides = () => {
            if (this.cursorInsideSwiper) {
                gsap.to(this.cursorIcon, {
                    duration: this.animationDuration,
                    rotation: this.cursorSide === "right" ? -180 : 0,
                    ease: this.easing
                });
                this.cursorSide = this.cursorSide === "left" ? "right" : "left";
            }

            if (!this.cursorInsideSwiper) {
                this.cursorInsideSwiper = true;
            }
        };

        const swiperContainer = document.querySelector(".swiper-container");
        swiperContainer.addEventListener("mouseenter", onSwiperMouseEnter);
        swiperContainer.addEventListener("mouseleave", onSwiperMouseLeave);

        const swiperButtonPrev = document.querySelector(".swiper-button-prev");
        const swiperButtonNext = document.querySelector(".swiper-button-next");
        swiperButtonPrev.addEventListener("mouseenter", onSwitchSwiperSides);
        swiperButtonNext.addEventListener("mouseenter", onSwitchSwiperSides);
    }

    initSwiper() {
        //const { Swiper } = window;
        this.swiper = new Swiper(".swiper-container", {
            loop: true,
            direction: "horizontal",
            slidesPerView: "auto",
            spaceBetween: 40,
            centeredSlides: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }
        });
        this.swiper.on("touchMove", e => {
            const { clientX, clientY } = e;
            this.clientX = clientX;
            this.clientY = clientY;

            this.cursorSide = this.clientX > window.innerWidth / 2 ? "right" : "left";

            gsap.to(this.cursorIcon, {
                duration: this.animationDuration,
                rotation: this.cursorSide === "right" ? 0 : -180,
                ease: this.easing
            });
        });

        this.bumpCursorTween = gsap.to(this.cursor, {
            duration: 0.1,
            scale: 0.85,
            onComplete: () => {
                gsap.to(this.cursor, {
                    duration: 0.2,
                    scale: 1,
                    ease: this.easing
                });
            },
            paused: true
        });

        this.swiper.on("slideChange", () => {
            this.bumpCursorTween.play();
        });
    }
}

const slider = new Slider();

