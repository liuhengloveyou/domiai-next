"use client";

// 添加这一行来启用动态渲染
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CalendarIcon, UsersIcon, CreditCardIcon, ActivityIcon } from "lucide-react";

const data = [
  { name: '1月', 用户: 400, 收入: 2400 },
  { name: '2月', 用户: 300, 收入: 1398 },
  { name: '3月', 用户: 500, 收入: 3800 },
  { name: '4月', 用户: 780, 收入: 4908 },
  { name: '5月', 用户: 890, 收入: 5800 },
  { name: '6月', 用户: 1390, 收入: 7800 },
  { name: '7月', 用户: 1490, 收入: 8300 },
];

const recentActivities = [
  { id: 1, user: '张三', action: '完成了任务', time: '10分钟前', status: 'success' },
  { id: 2, user: '李四', action: '上传了文件', time: '30分钟前', status: 'info' },
  { id: 3, user: '王五', action: '评论了项目', time: '1小时前', status: 'warning' },
  { id: 4, user: '赵六', action: '创建了新项目', time: '2小时前', status: 'success' },
  { id: 5, user: '钱七', action: '更新了设置', time: '3小时前', status: 'info' },
];

export default function Dashboard() {
  const [, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">今天: {new Date().toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">报告</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总收入</CardTitle>
                <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  较上月 <span className="text-green-500">+20.1%</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">新用户</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground">
                  较上月 <span className="text-green-500">+18.2%</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                <ActivityIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  较上月 <span className="text-green-500">+4.3%</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">转化率</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <p className="text-xs text-muted-foreground">
                  较上月 <span className="text-red-500">-2.5%</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>概览</CardTitle>
                <CardDescription>
                  过去7个月的用户增长和收入趋势
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {/* <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="用户" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="收入" stroke="#82ca9d" /> */}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
                <CardDescription>
                  用户最近的操作记录
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.user}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据分析</CardTitle>
              <CardDescription>
                按类别查看数据分布
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="用户" fill="#8884d8" />
                  <Bar dataKey="收入" fill="#82ca9d" /> */}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>报告中心</CardTitle>
              <CardDescription>
                查看和下载各类报告
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>报告内容将在这里显示...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知中心</CardTitle>
              <CardDescription>
                查看所有系统通知
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>通知内容将在这里显示...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}