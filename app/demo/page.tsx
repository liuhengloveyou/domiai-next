"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { NavBar } from "@/components/nav-bar";
import {
  Square,
  Circle,
  Type,
  Pencil,
  Trash2,
  Download,
  Undo,
  Redo,
  Move,
  ImageIcon,
} from "lucide-react";
import * as fabric from "fabric";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";
// import { Image } from "fabric/fabric-impl";

export default function FunPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [drawingMode, setDrawingMode] = useState<string>("select");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const historyRef = useRef<{
    states: string[];
    currentStateIndex: number;
  }>({
    states: [],
    currentStateIndex: -1,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化 Canvas
  useEffect(() => {
    console.log("mounted>>>>>>>>>>>>", mounted);
    setMounted(true);

    if (mounted && canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#ffffff",
        isDrawingMode: false,
      });

      // 初始化绘图笔刷
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.width = brushSize;
      fabricCanvas.freeDrawingBrush.color = brushColor;

      setCanvas(fabricCanvas);

      // 保存初始状态
      saveCanvasState(fabricCanvas);

      // 监听对象修改事件
      fabricCanvas.on("object:modified", () => {
        saveCanvasState(fabricCanvas);
      });

      fabricCanvas.on("object:added", () => {
        saveCanvasState(fabricCanvas);
      });

      fabricCanvas.on("object:removed", () => {
        saveCanvasState(fabricCanvas);
      });

      return () => {
        fabricCanvas.dispose();
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

    setCanUndo(history.currentStateIndex > 0);
    setCanRedo(false);
  };

  // 撤销
  const handleUndo = () => {
    if (!canvas) return;

    const history = historyRef.current;
    if (history.currentStateIndex > 0) {
      history.currentStateIndex--;
      canvas.loadFromJSON(
        history.states[history.currentStateIndex],
        canvas.renderAll.bind(canvas)
      );

      setCanUndo(history.currentStateIndex > 0);
      setCanRedo(history.currentStateIndex < history.states.length - 1);
    }
  };

  // 重做
  const handleRedo = () => {
    if (!canvas) return;

    const history = historyRef.current;
    if (history.currentStateIndex < history.states.length - 1) {
      history.currentStateIndex++;
      canvas.loadFromJSON(
        history.states[history.currentStateIndex],
        canvas.renderAll.bind(canvas)
      );

      setCanUndo(history.currentStateIndex > 0);
      setCanRedo(history.currentStateIndex < history.states.length - 1);
    }
  };

  // 切换绘图模式
  const handleModeChange = (mode: string) => {
    if (!canvas) return;

    setDrawingMode(mode);

    if (mode === "draw") {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = brushSize;
      }
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = brushColor;
      }
    } else {
      canvas.isDrawingMode = false;
    }
  };

  // 添加矩形
  const addRectangle = () => {
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: brushColor,
      width: 100,
      height: 100,
      objectCaching: false,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  // 添加圆形
  const addCircle = () => {
    if (!canvas) return;

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      fill: brushColor,
      radius: 50,
      objectCaching: false,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  // 添加文本
  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText("双击编辑文本", {
      left: 100,
      top: 100,
      fontFamily: "sans-serif",
      fill: brushColor,
      fontSize: 20,
      objectCaching: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  };

  // 画布自适应窗口
  useEffect(() => {
    if (!canvas) return;
    const handleResize = () => {
      const width = Math.min(window.innerWidth - 40, 1000);
      const height = Math.min(window.innerHeight - 180, 700);
      canvas.setDimensions({ width, height }, { backstoreOnly: false });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvas]);

  // 画笔参数变化时同步
  useEffect(() => {
    if (canvas && canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = brushColor;
    }
  }, [brushSize, brushColor, canvas, drawingMode]);

  // 上传图片
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target) return;
      fabric.FabricImage.fromURL(event.target.result as string).then((img) => {
        // 缩放图片以适应画布
        const maxWidth = canvas.getWidth() * 0.8;
        const maxHeight = canvas.getHeight() * 0.8;
        if (img.width! > maxWidth || img.height! > maxHeight) {
          const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
          img.scale(scale);
        }
        img.set({
          left: 100,
          top: 100,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        saveCanvasState(canvas);
      });
    };

    reader.readAsDataURL(file);
    e.target.value = ""; // 重置文件输入
  };

  // 删除选中对象
  const deleteSelected = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      saveCanvasState(canvas);
    }
  };

  // 下载画布
  const downloadCanvas = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1, // 修改为 1，确保导出图像有正确的尺寸
    });

    const link = document.createElement("a");
    link.download = `fabric-drawing-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 更新画笔大小
  const updateBrushSize = (value: number[]) => {
    if (!canvas) return;

    const size = value[0];
    setBrushSize(size);

    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = size;
    }
  };

  // 更新画笔颜色
  const updateBrushColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;

    const color = e.target.value;
    setBrushColor(color);

    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen"
    >
      <NavBar />
      <main>
        <Card className="backdrop-blur-sm bg-background/60 rounded-none border-none h-screen">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={drawingMode === "select" ? "default" : "outline"}
                  onClick={() => handleModeChange("select")}
                  className="flex items-center gap-2"
                >
                  <Move size={16} />
                  {t("select") || "选择"}
                </Button>
                <Button
                  variant={drawingMode === "draw" ? "default" : "outline"}
                  onClick={() => handleModeChange("draw")}
                  className="flex items-center gap-2"
                >
                  <Pencil size={16} />
                  {t("draw") || "绘制"}
                </Button>
                <Button
                  variant="outline"
                  onClick={addRectangle}
                  className="flex items-center gap-2"
                >
                  <Square size={16} />
                  {t("rectangle") || "矩形"}
                </Button>
                <Button
                  variant="outline"
                  onClick={addCircle}
                  className="flex items-center gap-2"
                >
                  <Circle size={16} />
                  {t("circle") || "圆形"}
                </Button>
                <Button
                  variant="outline"
                  onClick={addText}
                  className="flex items-center gap-2"
                >
                  <Type size={16} />
                  {t("text") || "文本"}
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={16} />
                  {t("image") || "图片"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Button>
                <Button
                  variant="outline"
                  onClick={deleteSelected}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                  {t("delete") || "删除"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className={cn(
                    "flex items-center gap-2",
                    !canUndo && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Undo size={16} />
                  {t("undo") || "撤销"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className={cn(
                    "flex items-center gap-2",
                    !canRedo && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Redo size={16} />
                  {t("redo") || "重做"}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadCanvas}
                  className="flex items-center gap-2 ml-auto"
                >
                  <Download size={16} />
                  {t("download") || "下载"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brush-size">
                    {t("brushSize") || "画笔大小"}
                  </Label>
                  <Slider
                    id="brush-size"
                    min={1}
                    max={50}
                    step={1}
                    value={[brushSize]}
                    onValueChange={updateBrushSize}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="brush-color">
                    {t("brushColor") || "画笔颜色"}
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="brush-color"
                      type="color"
                      value={brushColor}
                      onChange={updateBrushColor}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <span className="text-sm">{brushColor}</span>
                  </div>
                </div>
              </div>

              <div className="border border-primary/10 rounded-lg overflow-hidden">
                <canvas ref={canvasRef} className="w-full max-w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
