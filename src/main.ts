import "./styles/main.scss";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";

const audio = new Audio("/sounds/bg.mp3");
audio.preload = "auto";
audio.volume = 0.03;
audio.currentTime = 5;
audio.loop = true;

document.querySelector('#start')?.addEventListener("click", () => {
    audio.play();
    const preview = document.querySelector<HTMLDivElement>('.preview');
    document.body.style.overflowY = "";

    if (preview) {
        preview.style.opacity = "0";
        preview.style.pointerEvents = "none";
    }
});

document.querySelector('#mute-btn')?.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollSmoother);

ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.1,
});



gsap.to(".section-1 h1", {
    opacity: 0,
    scale: 2,
    scrollTrigger: {
        trigger: ".section-1",
        start: "bottom bottom",
        scrub: 1,
    }
});


gsap.fromTo(".section-2 h1", {
    opacity: 0,
    scale: 0.6,
    x: -200,
}, {
    opacity: 1,
    scale: 1,
    x: 0,
    scrollTrigger: {
        trigger: ".section-2",
        start: "top bottom",
        scrub: 1,
    }
});


gsap.fromTo(".offer3",
    { opacity: 0, y: 100 },
    {
        opacity: 1,
        duration: 1,
        y: 0,
        scrollTrigger: {
            trigger: ".offer3",
            start: "top 80%",
        }
    }
);



const loader = new GLTFLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const light = new THREE.AmbientLight("#fff", 1);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 0.2;
scene.add(light);

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

let triggeredOnce = false;

loader.load('/models/scene.gltf', function (gltf) {
    let model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(0.6, 0.6, 0.6);
    model.rotateY(THREE.MathUtils.degToRad(-25));
    model.rotateX(THREE.MathUtils.degToRad(15));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(model);
    renderer.render(model, camera);


    ScrollTrigger.create({
        trigger: "#scroll-section",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const scale = THREE.MathUtils.lerp(0.6, 1, progress);

            model.scale.set(scale, scale, scale);
            model.rotation.y = progress * Math.PI * 2;
            model.position.y = -progress * 0.02

            if (model.position.y > -0.015) {
                model.position.x = progress * 0.15;
            }

            if (progress > 0.9 && !triggeredOnce) {
                triggeredOnce = true;

                const tl = gsap.timeline({ duration: 1 });

                tl
                    .to(".section-3 header", {
                        opacity: 1,
                    })
                    .fromTo(".section-3 img",
                        {
                            scale: 0,
                            opacity: 0,
                        },
                        {
                            scale: 1,
                            opacity: 1,
                        }
                    )
                    .fromTo(".section-3 header button",
                        {
                            opacity: 0,
                        },
                        {
                            opacity: 1,
                        },
                        "+=0"
                    )
            }
        }
    });
}, undefined, function (error) {
    console.error(error);
});