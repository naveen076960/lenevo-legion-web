"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const FRAME_COUNT = 36;
const FRAME_EXTENSION = "jpg";

export default function BackBombView() {
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
    <section className="scroll-bombview-section">
      <div className="sticky-canvas-frame">
        <div className="scroll-bombview-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="scroll-bombview-canvas"
            aria-label="Lenevo Legion product disassembly sequence"
          />

          {isLoading && (
            <div className="canvas-loader">
              <div className="loader-orb">
                <span />
              </div>
              <span className="loader-text">SYSTEM BOOTING</span>
              <span className="loader-progress">
                {Math.round((loadedCount / FRAME_COUNT) * 100)}%
              </span>
            </div>
          )}

          <div className="story-overlay">
            <motion.div
              className="story-step story-step-hero"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="kicker">LENEVO LEGION // SYSTEM 09</span>

              <p className="story-copy">
                A performance platform engineered to move at tactical speed.
              </p>
            </motion.div>

            <motion.div
              className="story-step story-step-one"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.9 }}
            >
              <span className="kicker">// FIELD MODE</span>
              <h2 className="story-title small">
                Deploy full-system intelligence
              </h2>
              <p className="story-copy">
                Unite hardware, signal, and operations into one living command
                layer.
              </p>
            </motion.div>

            <motion.div
              className="story-step story-step-cta"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.85 }}
            >
              <span className="kicker">// SYSTEM READY</span>
              <h2 className="story-title">Enter the Legion</h2>
              <button className="cta-button">Request access</button>
            </motion.div>
          </div>
        </div>
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
