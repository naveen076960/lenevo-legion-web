"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const FRAME_COUNT = 36;
const FRAME_EXTENSION = "png";

const textContainer = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 * i },
  }),
};

const textItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Gpu() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const currentFrameRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll();

  const frameUrls = useMemo(
    () =>
      Array.from({ length: FRAME_COUNT }, (_, i) => {
        const frameNumber = String(i + 1).padStart(3, "0");
        return `/back-bombview/ezgif-frame-${frameNumber}.${FRAME_EXTENSION}`;
      }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(window.innerWidth);
      const height = Math.round(window.innerHeight);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      const img = imagesRef.current[currentFrameRef.current];
      if (img) {
        drawFrame(context, img, width, height);
      } else {
        drawFallback(context, width, height, currentFrameRef.current);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const imageList: Array<HTMLImageElement | null> = [];

    frameUrls.forEach((src, index) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.decoding = "async";

      image.onload = () => {
        imageList[index] = image;
        imagesRef.current[index] = image;
        const nextLoaded = imageList.filter(Boolean).length;
        setLoadedCount(nextLoaded);

        if (nextLoaded >= FRAME_COUNT) {
          setIsLoading(false);
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
              const img = imagesRef.current[currentFrameRef.current] ?? image;
              const width = canvas.clientWidth || window.innerWidth;
              const height = canvas.clientHeight || window.innerHeight;
              drawFrame(context, img, width, height);
            }
          }
        }
      };

      image.onerror = () => {
        imageList[index] = null;
        imagesRef.current[index] = null;
        const nextLoaded = imageList.filter(Boolean).length;
        setLoadedCount(nextLoaded);

        if (nextLoaded >= FRAME_COUNT) {
          setIsLoading(false);
        }
      };

      image.src = src;
    });
  }, [frameUrls]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const rawFrame = clamped * (FRAME_COUNT - 1);
    const frameIndex = Math.round(rawFrame);

    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;

      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;

      const image = imagesRef.current[frameIndex];
      if (image) {
        drawFrame(
          context,
          image,
          canvas.clientWidth || window.innerWidth,
          canvas.clientHeight || window.innerHeight,
        );
      } else {
        drawFallback(
          context,
          canvas.clientWidth || window.innerWidth,
          canvas.clientHeight || window.innerHeight,
          frameIndex,
        );
      }
    }
  });

  return (
    <section
      className="gpu-section gpu-hero gpu-hero-left"
      aria-labelledby="gpu-heading"
    >
      <div className="gpu-hero-inner">
        <motion.div
          className="gpu-hero-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={textContainer}
          custom={1}
        >
          <motion.span className="kicker" variants={textItem}>
            // GRAPHICS
          </motion.span>

          <motion.h2
            id="gpu-heading"
            className="story-title small"
            variants={textItem}
          >
            RTX5070 — ray-trace ready, thermally tuned.
          </motion.h2>

          <motion.p className="story-copy" variants={textItem}>
            The RTX5070 brings hardware-accelerated ray tracing and AI denoising
            to the Legion, delivering ultra-realistic lighting and dramatically
            improved frame rates in modern titles.
          </motion.p>

          <motion.ul
            className="gpu-spec-compact"
            variants={textContainer}
            custom={2}
          >
            <motion.li variants={textItem}>
              <strong>GPU:</strong>
              <span>RTX 5070</span>
            </motion.li>
            <motion.li variants={textItem}>
              <strong>CUDA / RT Cores:</strong>
              <span>4864 / 38</span>
            </motion.li>
            <motion.li variants={textItem}>
              <strong>VRAM:</strong>
              <span>8 GB GDDR6</span>
            </motion.li>
            <motion.li variants={textItem}>
              <strong>Boost Clock:</strong>
              <span>up to 2.1 GHz</span>
            </motion.li>
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

function drawFrame(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const width = Number.isNaN(canvasWidth) ? 1920 : canvasWidth;
  const height = Number.isNaN(canvasHeight) ? 1080 : canvasHeight;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#050505";
  context.fillRect(0, 0, width, height);

  const sourceWidth = image.naturalWidth || image.width || 1600;
  const sourceHeight = image.naturalHeight || image.height || 900;

  const ratio = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * ratio;
  const drawHeight = sourceHeight * ratio;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function drawFallback(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  frameIndex: number,
) {
  const width = Number.isNaN(canvasWidth) ? 1920 : canvasWidth;
  const height = Number.isNaN(canvasHeight) ? 1080 : canvasHeight;

  const diagonal = context.createLinearGradient(0, 0, width, height);
  diagonal.addColorStop(0, "#080808");
  diagonal.addColorStop(0.55, "#111111");
  diagonal.addColorStop(1, "#040404");

  context.clearRect(0, 0, width, height);
  context.fillStyle = diagonal;
  context.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const arm = Math.max(Math.min(120 + frameIndex, 360), 80);

  context.strokeStyle = "rgba(255,255,255,0.14)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(centerX - arm, centerY);
  context.lineTo(centerX + arm, centerY);
  context.stroke();

  context.strokeStyle = "rgba(255,255,255,0.08)";
  context.strokeRect(centerX - 240, centerY - 160, 480, 320);
}
