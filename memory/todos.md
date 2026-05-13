---
name: Human3.0 版本管理任务列表
description: 精简版的 Human3.0 系统版本管理待办事项，去掉 3D 可视化功能，专注于评估深度和报告质量差异
type: project
---

# Human3.0 系统版本管理待办事项（精简版）

## 项目概述
为 Human3.0 思维模型评估系统实现基础版（免费）和完整版（$5付费）的版本管理系统。去掉 3D 可视化功能，专注于评估深度和报告质量的差异。

---

## 📋 任务清单

### 阶段一：基础架构搭建

#### ✅ 任务 1: Human3.0 版本管理 - 类型系统设计
- [ ] 创建 `app/types/version.ts`
  - [ ] 定义 `AppVersion` 类型：'simple' | 'complete'
  - [ ] 定义 `VersionState` 接口（selectedVersion, isPaid, paymentStatus）
  - [ ] 定义 `PaymentStatus` 类型
- [ ] 更新现有类型定义以支持版本管理

#### ✅ 任务 2: Human3.0 版本管理 - 状态管理层
- [ ] 创建 `app/src/context/VersionContext.tsx`
  - [ ] 实现 Context Provider
  - [ ] 创建 `useVersion` 自定义钩子
- [ ] 创建 `app/src/hooks/usePersistentVersionState.ts`
  - [ ] 实现 localStorage 持久化
  - [ ] 状态同步机制
- [ ] 创建 `app/src/hooks/useOnlineStatus.ts`
  - [ ] 网络状态检测

### 阶段二：支付和界面功能

#### ✅ 任务 3: Human3.0 版本管理 - 版本选择界面
- [ ] 创建 `app/src/components/VersionSelector.tsx`
  - [ ] 实现版本卡片展示
  - [ ] 基础版和完整版功能对比
    - 基础版：基本评估、标准报告、基础建议
    - 完整版：完整评估、个性化分析、详细建议、完整报告
  - [ ] 价格显示（$5）
  - [ ] 选择动画效果
- [ ] 设计响应式布局
- [ ] 添加交互动画

#### ✅ 任务 4: Human3.0 版本管理 - PayPal 支付集成
- [ ] 创建 `app/api/paypal.ts`
  - [ ] 实现 PayPal SDK 集成
  - [ ] 创建订单 API
  - [ ] 捕获支付 API
  - [ ] 金额验证（$5）
  - [ ] CSRF 保护
- [ ] 更新 `.env.local` 添加 PayPal 配置
- [ ] 实现支付错误处理和重试机制（最多3次）

#### ✅ 任务 5: Human3.0 版本管理 - 确认对话框系统
- [ ] 创建 `app/src/components/ConfirmDialog.tsx`
  - [ ] 自定义确认对话框
  - [ ] 版本切换警告信息："切换版本将丢失当前评估进度"
  - [ ] 确认和取消按钮
- [ ] 实现确认回调机制

#### ✅ 任务 6: Human3.0 版本管理 - Hero 阶段集成
- [ ] 更新 `app/src/components/HeroSection.tsx`
  - [ ] 集成版本选择器
  - [ ] 添加版本切换逻辑
  - [ ] 显示当前版本状态
  - [ ] 实现版本切换动画

### 阶段三：评估和报告差异化

#### ✅ 任务 7: Human3.0 版本管理 - 评估流程版本控制
- [ ] 更新 `app/src/components/ChatInterface.tsx`
  - [ ] 根据版本控制问题深度
    - 基础版：基础问题选项
    - 完整版：深度问题选项
  - [ ] 限制高级评估功能
  - [ ] 显示版本提示信息
- [ ] 实现功能开关逻辑
- [ ] 优化用户体验

#### ✅ 任务 8: Human3.0 版本管理 - 报告内容差异化
- [ ] 更新 `app/src/components/ReportPage.tsx`
  - [ ] 基础版报告：标准格式，基础建议
  - [ ] 完整版报告：深度分析，个性化建议
  - [ ] 添加升级提示卡片（仅基础版显示）
    - [ ] "升级到完整版"按钮
    - [ ] "获得深度分析"说明
- [ ] 实现重新开始功能
  - [ ] 清除当前评估进度
  - [ ] 重新开始评估流程

#### ✅ 任务 9: Human3.0 版本管理 - 支付成功处理
- [ ] 创建 `app/src/components/PaymentSuccess.tsx`
  - [ ] 支付成功提示
  - [ ] 显示"升级成功"信息
  - [ ] 自动开始新评估（延迟2秒）
  - [ ] 版本状态更新（isPaid: true）
- [ ] 实现成功后的状态管理
- [ ] 添加成功动画效果

### 阶段四：完善和测试

#### ✅ 任务 10: Human3.0 版本管理 - 状态持久化和恢复
- [ ] 测试 localStorage 持久化
  - [ ] 页面刷新后版本状态保持
  - [ ] 多标签页状态同步
- [ ] 实现状态恢复逻辑
- [ ] 处理异常状态情况

#### ✅ 任务 11: Human3.0 版本管理 - 测试和优化
- [ ] 版本切换测试
  - [ ] 基础版 → 完整版流程（支付流程）
  - [ ] 完整版 → 基础版流程
  - [ ] 已支付用户直接切换测试
- [ ] 支付流程测试
  - [ ] PayPal 支付完整流程
  - [ ] 支付取消处理
  - [ ] 支付失败重试（3次）
- [ ] 用户体验优化
  - [ ] 加载状态优化
  - [ ] 错误提示优化（使用 sonner toast）
  - [ ] 移动端适配

---

## 🔧 技术要点

### 版本差异设计
- **基础版（免费）**：基础评估、标准报告、基础建议
- **完整版（$5）**：深度评估、个性化分析、详细建议、完整报告

### 核心功能
1. **版本管理**：使用 Context API + localStorage 持久化
2. **支付流程**：PayPal 集成，$5 定价
3. **版本切换**：确认对话框，提示进度丢失
4. **功能控制**：评估深度和报告质量差异化

### 关键文件
- 类型定义：`types/version.ts`
- 状态管理：`context/VersionContext.tsx`
- 支付 API：`api/paypal.ts`
- 核心组件：`VersionSelector`, `PaymentModal`, `ConfirmDialog`

---

## 📅 时间规划
- 阶段一：1 天
- 阶段二：2 天
- 阶段三：2 天
- 阶段四：1-2 天
- **总计：6-7 天**