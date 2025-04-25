"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUp, RefreshCw } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";

interface StoreImg {
  id: number;
  name: string;
  use: string; // 用途
  path: string;
  create_time: string;
  update_time: string;
  status: number;
}
export function FunStore({
  onAddToCanvas,
  onChangeBackground,
}: {
  onAddToCanvas?: (imagePath: string) => void;
  onChangeBackground?: (imagePath: string) => void;
}) {
  // 上传图片
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 上传背景图片
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  // 图片列表状态
  const [imageList, setImageList] = useState<StoreImg[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 抽屉打开状态
  const [isOpen, setIsOpen] = useState(false);

  // 页面加载时获取图片列表
  useEffect(() => {
    if (isOpen) {
      fetchImageList();
    }
  }, [isOpen]);

  const fetchImageList = async () => {
    console.log("fetchImageList 被调用");

    try {
      setLoading(true);
      const response = await fetch("/api/draw/img/list");

      if (!response.ok) {
        throw new Error("获取图片列表失败");
      }

      const data = await response.json();

      setImageList(data.data);
      console.log("图片列表:", data, imageList);
    } catch (error) {
      console.error("获取图片列表出错:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "img" | "bg" = "img"
  ) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target?.result) return;

      try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append("method", `drawgame/${type}`);
        formData.append("file", file);

        // 发送请求到服务器
        const response = await fetch("/upimg", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("上传失败");
          return;
        }

        const result = await response.json();
        if (result.code !== 0) {
          toast.error(result.msg);
          return;
        }

        toast.success(type === "img" ? "图片上传成功" : "背景图上传成功");
        // 刷新图片列表
        await fetchImageList();
      } catch (error) {
        console.error("上传出错:", error);
        // 这里可以添加错误处理逻辑，比如显示错误提示
      }
    };

    reader.readAsDataURL(file);
    // 重置input，允许重复上传相同文件
    e.target.value = "";
  };

  // 添加到画板功能
  const handleAddToCanvas = (image: StoreImg) => {
    try {
      // 获取图片路径
      const imagePath = "/tmpimgs" + image.path;

      // 如果提供了回调函数，则调用它
      if (onAddToCanvas) {
        onAddToCanvas(imagePath);
      } else {
        toast.error("无法添加到画板");
      }
    } catch (error) {
      console.error("添加到画板出错:", error);
      toast.error("添加到画板失败");
    }
  };

  // 切换背景图功能
  const handleChangeBackground = (image: StoreImg) => {
    try {
      // 获取图片路径
      const imagePath = "/imgs" + image.path;

      // 如果提供了回调函数，则调用它
      if (onChangeBackground) {
        onChangeBackground(imagePath);
      } else {
        toast.error("无法切换背景图");
      }
    } catch (error) {
      console.error("切换背景图出错:", error);
      toast.error("切换背景图失败");
    }
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="default">
          <ImageUp />
          图库
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[500px] max-w-[90vw]">
        <div className="mx-auto w-full">
          <DrawerHeader className="relative">
            <DrawerTitle>图库</DrawerTitle>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-0"
              onClick={fetchImageList}
              title="刷新"
            >
              <RefreshCw />
            </Button>
          </DrawerHeader>

          <Tabs defaultValue="pic" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pic">动画图</TabsTrigger>
              <TabsTrigger value="bg">背景图</TabsTrigger>
            </TabsList>
            <TabsContent value="pic">
              <Card className="border-0 shadow-none rounded-none">
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">加载中...</div>
                  ) : imageList.filter((img) => img.use === "img").length >
                    0 ? (
                    <div className="grid grid-cols-3 gap-0">
                      {imageList
                        .filter((img) => img.use === "img")
                        .map((image, index) => (
                          <ContextMenu key={index}>
                            <ContextMenuTrigger>
                              <div className="border rounded-md p-1 hover:border-primary cursor-pointer">
                                <img
                                  src={"/tmpimgs" + image.path}
                                  alt={image.name || `图片${index}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem
                                onClick={() => handleAddToCanvas(image)}
                              >
                                添加到画板
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">暂无图片</div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageUp />
                    添加图片
                  </Button>
                  {/* 隐藏的input用于上传图片 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "img")}
                    className="hidden"
                  />
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="bg">
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-2">
                  {loading ? (
                    <div className="text-center py-4">加载中...</div>
                  ) : imageList.filter((img) => img.use === "bg").length > 0 ? (
                    <div className="grid grid-cols-2 gap-0">
                      {imageList
                        .filter((img) => img.use === "bg")
                        .map((image, index) => (
                          <ContextMenu key={index}>
                            <ContextMenuTrigger>
                              <div className="border rounded-md p-1 hover:border-primary cursor-pointer">
                                <img
                                  src={"/imgs" + image.path}
                                  alt={image.name || `图片${index}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem
                                onClick={() => handleChangeBackground(image)}
                              >
                                切换背景图
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">暂无背景图</div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => bgFileInputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageUp />
                    添加背景图
                  </Button>
                  {/* 隐藏的input用于上传背景图 */}
                  <input
                    ref={bgFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "bg")}
                    className="hidden"
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
