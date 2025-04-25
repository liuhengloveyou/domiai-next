/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// 添加这一行来启用动态渲染
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/nav-bar";
import * as fabric from "fabric";
import { FerrisWheel, Move } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FunStore } from "@/components/fun-store";

export default function FunPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [mounted, setMounted] = useState(false);
  // 背景图片URL
  const [backgroundUrl, setBackgroundUrl] = useState(
    "/images/583-1920x1080.jpg"
  );
  // 动画
  const [drawingMode, setDrawingMode] = useState<string>("select");
  // const [setPathObjs] = useState<fabric.Path[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationObjsRef = useRef<Map<fabric.Path, fabric.FabricObject>>(
    new Map()
  );
  const animationRefsMap = useRef<Map<fabric.FabricObject, number | null>>(
    new Map()
  );
  const currentSelectedObjRef = useRef<fabric.FabricObject | null>(null);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);

  // 添加随机运动状态
  const [isRandomMoving, setIsRandomMoving] = useState(false);
  const randomMovingRefsMap = useRef<Map<fabric.FabricObject, number | null>>(
    new Map()
  );

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

      // 添加对象移动事件监听
      canvas.on("object:moving", function (e) {
        const movingObj = e.target;
        if (!movingObj) return;

        // 检查该对象是否正在动画中
        // let isAnimating = false;
        animationRefsMap.current.forEach((animRef, obj) => {
          if (obj === movingObj) {
            // isAnimating = true;
            // 取消该对象的动画
            if (animRef !== null) {
              cancelAnimationFrame(animRef);
              animationRefsMap.current.delete(obj);
            }

            // 从动画对象映射中移除
            animationObjsRef.current.forEach((animObj, path) => {
              if (animObj === movingObj) {
                animationObjsRef.current.delete(path);
              }
            });

            // 如果所有动画都结束了，更新状态
            if (animationRefsMap.current.size === 0) {
              setIsAnimating(false);
            }
          }
        });

        // 检查该对象是否正在随机运动中
        if (randomMovingRefsMap.current.has(movingObj)) {
          const animRef = randomMovingRefsMap.current.get(movingObj);
          if (animRef !== null) {
            cancelAnimationFrame(animRef as number);
          }
          randomMovingRefsMap.current.delete(movingObj);

          // 如果所有随机运动都结束了，更新状态
          if (randomMovingRefsMap.current.size === 0) {
            setIsRandomMoving(false);
          }
        }
      });

      // 只注册一次路径创建事件
      canvas.on("path:created", function (e: any) {
        e.path.set({
          selectable: false,
          evented: false,
        });

        // 修改：将新路径添加到数组中
        // setPathObjs(prev => [...prev, e.path]);
        setDrawingMode("select");
        canvas.isDrawingMode = false;

        // 使用之前保存的选中对象
        const savedObj = currentSelectedObjRef.current;

        if (savedObj) {
          // 将选中的对象与新路径关联
          animationObjsRef.current.set(e.path, savedObj);

          // 立即开始动画
          animateAlongPath(e.path, savedObj);
          console.log("使用保存的选中对象开始动画");

          // 清除保存的对象引用
          currentSelectedObjRef.current = null;
        } else {
          // 尝试获取当前选中的对象（备用方案）
          const activeObj = canvas.getActiveObject();
          if (activeObj) {
            // 将选中的对象与新路径关联
            animationObjsRef.current.set(e.path, activeObj);
            // 立即开始动画
            animateAlongPath(e.path, activeObj);
          } else {
            toast.warning("请先选中一个图片");
          }
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
  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files || !e.target.files[0] || !fabricCanvasRef.current)
  //     return;

  //   const file = e.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     if (!event.target?.result || !fabricCanvasRef.current) return;
  //     const dataUrl = event.target.result as string;

  //     // 加载图片并设置为可移动和可缩放
  //     fabric.FabricImage.fromURL(dataUrl)
  //       .then((img) => {
  //         // 调整图片大小
  //         const maxSize = 200;
  //         if (img.width && img.height) {
  //           if (img.width > img.height) {
  //             if (img.width > maxSize) {
  //               img.scaleToWidth(maxSize);
  //             }
  //           } else {
  //             if (img.height > maxSize) {
  //               img.scaleToHeight(maxSize);
  //             }
  //           }
  //         }

  //         // 随机位置
  //         const canvas = fabricCanvasRef.current!;
  //         const randomLeft =
  //           Math.random() * (canvas.width! - img.getScaledWidth());
  //         const randomTop =
  //           Math.random() * (canvas.height! - img.getScaledHeight());

  //         img.set({
  //           left: randomLeft,
  //           top: randomTop,
  //           selectable: true, // 使图片可选择
  //           evented: true, // 使图片可以接收事件
  //           hasBorders: true, // 显示边框
  //           hasControls: true, // 显示控制点
  //           data: {
  //             isJumping: true,
  //             originalTop: randomTop,
  //           },
  //         });

  //         // 添加到画布
  //         canvas.add(img);
  //       })
  //       .catch((error) => {
  //         console.error("Error loading image:", error);
  //       });
  //   };

  //   reader.readAsDataURL(file);
  //   // 重置input，允许重复上传相同文件
  //   e.target.value = "";
  // };

  // 停止动画
  const stopAnimation = () => {
    animationRefsMap.current.forEach((animationRef) => {
      if (animationRef !== null) {
        cancelAnimationFrame(animationRef);
      }
    });

    animationRefsMap.current.clear();
    animationObjsRef.current.clear();
    // 如果所有动画都结束了，更新状态
    if (animationRefsMap.current.size === 0) {
      setIsAnimating(false);
    }

    // 动画结束后清除所有路径线条和点
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      canvas.getObjects("path").forEach((obj) => canvas.remove(obj));
      // setPathObjs([]);
      canvas.renderAll();
    }
  };

  // 图片沿路径运动
  const animateAlongPath = (
    pathObj: fabric.Path,
    animObj?: fabric.FabricObject
  ) => {
    if (!fabricCanvasRef.current || !pathObj) return;
    const canvas = fabricCanvasRef.current;

    // 使用传入的动画对象或从Map中获取
    const animationObj = animObj || animationObjsRef.current.get(pathObj);

    if (!animationObj) {
      toast.warning("请选中要运动的图片");
      return;
    }

    // 获取路径点
    const pathData = pathObj.path;
    if (!pathData || pathData.length === 0) return;

    // 隐藏路径线条，但不删除它
    pathObj.set({ opacity: 0 });
    canvas.renderAll();

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

      // 开始动画
      let index = 0;
      setIsAnimating(true);

      const animate = () => {
        if (index >= sampledPoints.length) {
          // 单个动画结束，但不停止所有动画
          if (animationRefsMap.current.has(animationObj)) {
            animationRefsMap.current.delete(animationObj);
          }

          // 如果所有动画都结束了，才调用stopAnimation
          if (animationRefsMap.current.size === 0) {
            stopAnimation();
          }
          return;
        }

        const point = sampledPoints[index];
        // 让图片中心在线条上
        const imgWidth = animationObj.getScaledWidth
          ? animationObj.getScaledWidth()
          : animationObj.width || 0;
        const imgHeight = animationObj.getScaledHeight
          ? animationObj.getScaledHeight()
          : animationObj.height || 0;
        animationObj.set({
          left: point.x - imgWidth / 2,
          top: point.y - imgHeight / 2,
        });
        animationObj.setCoords();
        canvas.renderAll();

        index += speedRef.current;
        const animRef = requestAnimationFrame(animate);
        animationRefsMap.current.set(animationObj, animRef);
      };

      animate();
    }
  };

  // 处理动画
  const handleModeChange = () => {
    if (!mounted || !fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    // 获取当前选中的对象
    const activeObj = canvas.getActiveObject();

    // 如果没有选中对象且正在动画，则停止所有动画
    // if (!activeObj && isAnimating) {
    //   stopAnimation();
    //   return;
    // }

    // 如果当前是绘图模式，切换回选择模式
    if (drawingMode === "draw") {
      setDrawingMode("select");
      canvas.isDrawingMode = false;
      return;
    }

    // 如果当前是选择模式，检查是否可以进入绘图模式
    if (drawingMode === "select") {
      if (canvas.getObjects().length <= 0) {
        toast.warning("请先添加图片");
        return;
      }

      if (!activeObj) {
        toast.warning("请先选择一个图片");
        return;
      }

      // 检查当前选中的对象是否已经在动画中
      let isObjAnimating = false;
      animationRefsMap.current.forEach((_, obj) => {
        if (obj === activeObj) {
          isObjAnimating = true;
        }
      });

      if (isObjAnimating) {
        toast.warning("该图片已经在动画中");
        return;
      }

      // 保存当前选中的对象，以便在路径创建后使用
      currentSelectedObjRef.current = activeObj;

      setDrawingMode("draw");
      canvas.isDrawingMode = true;
      toast.warning("请为选中的图片绘制一条运动路径");
    }
  };



  // 添加随机运动函数
  const startRandomMovement = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    // 获取所有图片对象
    const imgObjects = canvas
      .getObjects()
      .filter(
        (obj: any) => obj.type === "image" && !animationRefsMap.current.has(obj)
      );

    if (imgObjects.length === 0) {
      toast.warning("没有可用的图片进行随机运动");
      return;
    }

    setIsRandomMoving(true);
    toast.success(`${imgObjects.length}张图片开始随机游荡`);

    // 为每个图片设置随机参数
    imgObjects.forEach((obj: any) => {
      const speedX = (1 + Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1);
      const speedY = (1 + Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1);

      obj.vx = speedX;
      obj.vy = speedY;

      const randomMove = () => {
        // 检查对象是否仍在画布中
        if (!canvas.contains(obj)) {
          if (randomMovingRefsMap.current.has(obj)) {
            randomMovingRefsMap.current.delete(obj);
          }
          return;
        }

        // 当前位置
        const currentX = obj.left || 0;
        const currentY = obj.top || 0;

        // 计算新位置
        let newX = currentX + obj.vx;
        let newY = currentY + obj.vy;

        // 边界检查，如果到达边界则反弹
        const width = obj.getScaledWidth
          ? obj.getScaledWidth()
          : obj.width || 0;
        const height = obj.getScaledHeight
          ? obj.getScaledHeight()
          : obj.height || 0;

        if (newX < 0) {
          newX = 0;
          obj.vx = Math.abs(obj.vx);
        } else if (newX + width > canvas.width!) {
          newX = canvas.width! - width;
          obj.vx = -Math.abs(obj.vx);
        }

        if (newY < 0) {
          newY = 0;
          obj.vy = Math.abs(obj.vy);
        } else if (newY + height > canvas.height!) {
          newY = canvas.height! - height;
          obj.vy = -Math.abs(obj.vy);
        }

        // 随机改变方向（小概率）
        if (Math.random() < 0.01) {
          // 确保新的随机方向也有明显的x和y分量
          obj.vx = (1 + Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1);
          obj.vy = (1 + Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1);
        }

        // 更新对象位置
        obj.set({
          left: newX,
          top: newY,
        });
        obj.setCoords();

        // 继续动画
        const animRef = requestAnimationFrame(randomMove);
        randomMovingRefsMap.current.set(obj, animRef);
      };

      // 开始随机移动
      const animRef = requestAnimationFrame(randomMove);
      randomMovingRefsMap.current.set(obj, animRef);
    });
  };

  // 停止随机运动
  const stopRandomMovement = () => {
    randomMovingRefsMap.current.forEach((animRef) => {
      if (animRef !== null) {
        cancelAnimationFrame(animRef);
      }
    });

    randomMovingRefsMap.current.clear();
    setIsRandomMoving(false);
    toast.info("随机运动已停止");
  };

  // 处理随机运动按钮点击
  const handleRandomMovement = () => {
    if (isRandomMoving) {
      stopRandomMovement();
    } else {
      startRandomMovement();
    }
  };

  const handleChangeBackground = (imagePath: string) => {
    setBackgroundUrl(imagePath);
  };

  // 用于从FunStore添加图片到画布
  const handleAddImageFromStore = (imagePath: string) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    // 使用Fabric.js加载图片
    fabric.FabricImage.fromURL(imagePath)
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
        canvas.setActiveObject(img);
        saveCanvasState(canvas);
      })
      .catch((error) => {
        console.error("加载图片失败:", error);
        toast.error("加载图片失败");
      });
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

        <div className="absolute bottom-10 left-4 z-10 flex flex-col space-y-2 items-end">
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

        <div className="absolute bottom-10 right-4 z-10 flex flex-col space-y-2 items-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="bg-gradient-to-r from-pink-500 via-orange-500 to-fuchsia-500"
                  onClick={() => handleModeChange()}
                >
                  <FerrisWheel />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{drawingMode === "draw" ? "退出绘图模式" : "开始动画"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className={isRandomMoving ? "bg-red-500" : "bg-blue-500"}
                  onClick={handleRandomMovement}
                >
                  <Move />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRandomMoving ? "停止随机运动" : "开始随机运动"}</p>
              </TooltipContent>
            </Tooltip>

            {/* <Tooltip>
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
            </Tooltip> */}

            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => bgFileInputRef.current?.click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
            </Tooltip> */}
          </TooltipProvider>

          <FunStore
            onAddToCanvas={handleAddImageFromStore}
            onChangeBackground={handleChangeBackground}
          />
        </div>
      </main>
    </div>
  );
}
