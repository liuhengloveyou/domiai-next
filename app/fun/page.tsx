/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/nav-bar";
import * as fabric from "fabric";
import { FerrisWheel, ImageUp } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FunPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [mounted, setMounted] = useState(false);
  // 上传图片
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 上传背景图片
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  // 背景图片URL
  const [backgroundUrl, setBackgroundUrl] = useState("https://picsum.photos/1920/1080");
  // 动画
  const [drawingMode, setDrawingMode] = useState<string>("select");
  const [pathObj, setPathObj] = useState<fabric.Path | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationObjRef = useRef<fabric.FabricObject | undefined>(undefined); 
  const animationRef = useRef<number | null>(null);
  const [speed, setSpeed] = useState(1); // 新增：速度控制，默认1
  const speedRef = useRef(1);

  // 历史记录
  const historyRef = useRef<{
    states: string[];
    currentStateIndex: number;
  }>({
    states: [],
    currentStateIndex: -1,
  });

  // 初始化 Canvas
  useEffect(() => {
    setMounted(true);

    if (mounted && canvasRef.current && !fabricCanvasRef.current) {
      // 初始化Fabric.js画布
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight - 64,
      });
      fabricCanvasRef.current = canvas;

      // 只注册一次路径创建事件
      canvas.on("path:created", function (e: any) {
        e.path.set({
          selectable: false,
          evented: false,
        });
        setPathObj(e.path);
        setDrawingMode("select");
        canvas.isDrawingMode = false;
        canvas.add(e.path);
        console.log("?>>>>>>>>>>>>>>>>>>pathObj", pathObj, animationObjRef.current);
        if (animationObjRef.current) { // 使用ref而不是state
          animateAlongPath(e.path);
        }
      });

      // 设置动画循环
      const animate = () => {
        if (!canvas) return;
        const activeObj = canvas.getActiveObject();

        canvas.getObjects().forEach((obj: any) => {
          if (obj === activeObj && obj.data?.isJumping) {
            // 实现跳动效果
            const time = Date.now();
            const jumpHeight = Math.sin(time / 200) * 10;

            // 如果对象被移动，更新originalTop
            if (
              obj.data.lastTop !== undefined &&
              Math.abs(obj.top! - obj.data.lastTop - obj.data.jumpOffset) > 1
            ) {
              obj.data.originalTop = obj.top! - obj.data.jumpOffset;
            }

            const newTop = obj.data.originalTop + jumpHeight;
            obj.data.jumpOffset = jumpHeight;
            obj.data.lastTop = newTop;

            obj.set("top", newTop);
            obj.setCoords();
          } else if (obj.data?.isJumping) {
            // 非选中对象，恢复到 originalTop
            if (typeof obj.data.originalTop === "number") {
              obj.set("top", obj.data.originalTop);
              obj.setCoords();
            }
          }
        });

        canvas.renderAll();
        requestAnimationFrame(animate);
      };

      animate();

      // 初始化绘图笔刷
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 1;
      canvas.freeDrawingBrush.color = "#000000";

      saveCanvasState(canvas);

      // 修正 handleResize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight - 64;
        canvas.setDimensions({ width, height }, { backstoreOnly: false });
      };

      handleResize();
      window.onresize = handleResize;

      // 清理函数
      return () => {
        window.onresize = null; // 清除 resize 事件监听
        // 清理Fabric.js画布，避免内存泄漏
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
      };
    }
  }, [mounted]);

  // 保存 Canvas 状态
  const saveCanvasState = (canvas: fabric.Canvas) => {
    if (!canvas) return;

    const history = historyRef.current;
    const json = JSON.stringify(canvas.toJSON());

    // 如果当前不是最新状态，删除当前状态之后的所有状态
    if (history.currentStateIndex < history.states.length - 1) {
      history.states = history.states.slice(0, history.currentStateIndex + 1);
    }

    history.states.push(json);
    history.currentStateIndex = history.states.length - 1;

    // setCanUndo(history.currentStateIndex > 0);
    // setCanRedo(false);
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !fabricCanvasRef.current)
      return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result || !fabricCanvasRef.current) return;
      const dataUrl = event.target.result as string;

      // 加载图片并设置为可移动和可缩放
      fabric.FabricImage.fromURL(dataUrl)
        .then((img) => {
          // 调整图片大小
          const maxSize = 200;
          if (img.width && img.height) {
            if (img.width > img.height) {
              if (img.width > maxSize) {
                img.scaleToWidth(maxSize);
              }
            } else {
              if (img.height > maxSize) {
                img.scaleToHeight(maxSize);
              }
            }
          }

          // 随机位置
          const canvas = fabricCanvasRef.current!;
          const randomLeft =
            Math.random() * (canvas.width! - img.getScaledWidth());
          const randomTop =
            Math.random() * (canvas.height! - img.getScaledHeight());

          img.set({
            left: randomLeft,
            top: randomTop,
            selectable: true, // 使图片可选择
            evented: true, // 使图片可以接收事件
            hasBorders: true, // 显示边框
            hasControls: true, // 显示控制点
            data: {
              isJumping: true,
              originalTop: randomTop,
            },
          });

          // 添加到画布
          canvas.add(img);
        })
        .catch((error) => {
          console.error("Error loading image:", error);
        });
    };

    reader.readAsDataURL(file);
    // 重置input，允许重复上传相同文件
    e.target.value = "";
  };

  // 停止动画
  const stopAnimation = () => {
    toast.info("动画已停止");
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    animationObjRef.current = undefined;
    setIsAnimating(false);

    //动画结束后清除路径线条和点
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      canvas.getObjects("path").forEach((obj) => canvas.remove(obj));
      setPathObj(null);
      canvas.renderAll();
    }
  };

  // 图片沿路径运动
  const animateAlongPath = (customPathObj?: fabric.Path) => {
    if (!fabricCanvasRef.current || !(customPathObj || pathObj)) return;
    const canvas = fabricCanvasRef.current;

    if (!animationObjRef.current) { // 使用ref替代state
      toast.warning("请选中要运动的图片");
      return;
    }

    // 获取路径点
    const pathData = (customPathObj || pathObj)!.path;
    if (!pathData || pathData.length === 0) return;

    // 提取路径点
    const points: { x: number; y: number }[] = [];
    let currentX = 0,
      currentY = 0;

    pathData.forEach((cmd: any) => {
      if (cmd[0] === "M" || cmd[0] === "L") {
        currentX = cmd[1];
        currentY = cmd[2];
        points.push({ x: currentX, y: currentY });
      } else if (cmd[0] === "Q") {
        // 处理二次贝塞尔曲线，增加精度
        const startX = currentX;
        const startY = currentY;
        const ctrlX = cmd[1];
        const ctrlY = cmd[2];
        const endX = cmd[3];
        const endY = cmd[4];

        // 为贝塞尔曲线添加更多点
        for (let t = 0; t <= 1; t += 0.05) {
          const x =
            Math.pow(1 - t, 2) * startX +
            2 * (1 - t) * t * ctrlX +
            Math.pow(t, 2) * endX;
          const y =
            Math.pow(1 - t, 2) * startY +
            2 * (1 - t) * t * ctrlY +
            Math.pow(t, 2) * endY;
          points.push({ x, y });
        }

        currentX = endX;
        currentY = endY;
      } else if (cmd[0] === "C") {
        // 处理三次贝塞尔曲线，增加精度
        const startX = currentX;
        const startY = currentY;
        const ctrl1X = cmd[1];
        const ctrl1Y = cmd[2];
        const ctrl2X = cmd[3];
        const ctrl2Y = cmd[4];
        const endX = cmd[5];
        const endY = cmd[6];

        // 为贝塞尔曲线添加更多点
        for (let t = 0; t <= 1; t += 0.05) {
          const x =
            Math.pow(1 - t, 3) * startX +
            3 * Math.pow(1 - t, 2) * t * ctrl1X +
            3 * (1 - t) * Math.pow(t, 2) * ctrl2X +
            Math.pow(t, 3) * endX;
          const y =
            Math.pow(1 - t, 3) * startY +
            3 * Math.pow(1 - t, 2) * t * ctrl1Y +
            3 * (1 - t) * Math.pow(t, 2) * ctrl2Y +
            Math.pow(t, 3) * endY;
          points.push({ x, y });
        }

        currentX = endX;
        currentY = endY;
      }
    });

    // 如果点太少，增加插值点使动画更平滑
    if (points.length > 1) {
      const smoothPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const steps = 50; // 插值点数量
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          smoothPoints.push({
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t,
          });
        }
      }

      // === 新增：等距采样，保证动画点均匀分布且紧贴原线 ===
      function getDistance(
        a: { x: number; y: number },
        b: { x: number; y: number }
      ) {
        return Math.hypot(a.x - b.x, a.y - b.y);
      }
      const sampledPoints: { x: number; y: number }[] = [];
      const minStep = 3; // 每隔3像素采样一个点，可根据需要调整
      let last = smoothPoints[0];
      sampledPoints.push(last);
      let accDist = 0;
      for (let i = 1; i < smoothPoints.length; i++) {
        const dist = getDistance(last, smoothPoints[i]);
        accDist += dist;
        if (accDist >= minStep) {
          sampledPoints.push(smoothPoints[i]);
          last = smoothPoints[i];
          accDist = 0;
        }
      }
      // 保证最后一个点一定保留
      if (
        sampledPoints.length === 0 ||
        sampledPoints[sampledPoints.length - 1].x !==
          smoothPoints[smoothPoints.length - 1].x ||
        sampledPoints[sampledPoints.length - 1].y !==
          smoothPoints[smoothPoints.length - 1].y
      ) {
        sampledPoints.push(smoothPoints[smoothPoints.length - 1]);
      }
      // === 采样结束 ===

      // 开始动画
      let index = 0;
      setIsAnimating(true);

      const animate = () => {
        if (index >= sampledPoints.length) {
          stopAnimation();
          return;
        }

        const point = sampledPoints[index];
        // 让图片中心在线条上
        const animObj = animationObjRef.current!; // 使用ref获取动画对象
        const imgWidth = animObj.getScaledWidth
          ? animObj.getScaledWidth()
          : animObj.width || 0;
        const imgHeight = animObj.getScaledHeight
          ? animObj.getScaledHeight()
          : animObj.height || 0;
        animObj.set({
          left: point.x - imgWidth / 2,
          top: point.y - imgHeight / 2,
        });
        animObj.setCoords();
        canvas.renderAll();

        index += speedRef.current;
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    }
  };

  // 处理动画
  const handleModeChange = () => {
    if (!mounted || !fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    // 如果正在动画，停止动画
    if (isAnimating) {
      stopAnimation();
      return;
    }

    // 先检查并保存当前选中的对
    animationObjRef.current =  canvas.getActiveObject();
    if (pathObj && animationObjRef.current) {
      setDrawingMode("select");
      canvas.isDrawingMode = false;
      animateAlongPath();
      return;
    } 

    if (drawingMode === "draw") {
      setDrawingMode("select");
      canvas.isDrawingMode = false;
      stopAnimation();
      return;
    } else if (drawingMode === "select") {
      if (canvas.getObjects().length <= 0) {
        toast.warning("请先添加图片");
        return;
      }
     
      setDrawingMode("draw");
      canvas.isDrawingMode = true;
      toast.warning("请先绘制一条运动路径");
    }
  };

  // 处理背景图片上传
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;
      const dataUrl = event.target.result as string;
      setBackgroundUrl(dataUrl);
      toast.success("背景已更新");
    };

    reader.readAsDataURL(file);
    // 重置input，允许重复上传相同文件
    e.target.value = "";
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBar />
      <main>
        <div
          className={`overflow-hidden h-full w-full ${
            drawingMode === "draw"
              ? "backdrop-blur-md bg-background/60"
              : "transition-all"
          }`}
        >
          <canvas ref={canvasRef} className="w-full max-w-full h-full" />
        </div>

        <div className="absolute bottom-20 right-4 z-10 flex flex-col space-y-2 items-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className={`${
                    isAnimating || drawingMode === "draw"
                      ? "bg-gradient-to-r from-pink-500 via-orange-500 to-fuchsia-500"
                      : ""
                  }`}
                  onClick={() => handleModeChange()}
                >
                  <FerrisWheel />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isAnimating ? "停止动画" : drawingMode === "draw" ? "退出绘图模式" : "开始动画"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageUp />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>上传图片</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => bgFileInputRef.current?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <input
                    ref={bgFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBgUpload}
                    className="hidden"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>更换背景</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isAnimating && (
            <div className="pt-10">
              <Slider
                min={1}
                max={20}
                step={2}
                value={[speed]}
                onValueChange={([v]: number[]) => {
                  setSpeed(v);
                  speedRef.current = v;
                }}
                className="w-[200px]"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
