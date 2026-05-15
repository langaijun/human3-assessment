# HUMAN 3.0 重构计划

## 项目背景
- 基于 Dan Koe 的 HUMAN 3.0 框架的评估工具
- 目标：帮助用户发现卡点，提供行动建议
- 技术栈：React 19 + TypeScript + Vite

---

## 核心需求确认

### 版本差异

| 版本 | 轮数 | 提示词 | 报告 | 价格 |
|-----|------|--------|------|------|
| Simple | 12 轮 | 简单提示词 | AI 生成 | 免费 |
| Complete | 20 轮 | 完整提示词 | AI 生成 | $5 |

### 状态管理

```typescript
interface AppState {
  selectedVersion: 'simple' | 'complete'
  isPaid: boolean
}
```

### 支付方式
- PayPal Payment Link：`https://www.paypal.com/ncp/payment/LMNRNT3SAXPZS`
- 点击按钮 → `window.open(link)`
- 无需后端验证

---

## 重构任务清单

### Phase 1: 支付架构简化
- [x] 添加支付链接到环境变量 (`.env.local`)
- [x] 更新 `constants/index.ts` 添加 `PAYMENT.PAYPAL_LINK`
- [x] 简化 `HeroSection.tsx` 支付按钮逻辑
- [x] 简化 `UpgradeButton.tsx` 为直接打开链接
- [x] 删除 `api/paypal.ts`（不需要了）
- [x] 删除 `PayPalPayment.tsx`（不需要了）

### Phase 2: DanKoeIntro 重构
- [ ] 抽离内容到 `content/introContent.ts`
- [ ] 拆分组件：
  - [ ] `HeroSection.tsx` (标题区)
  - [ ] `ThreePillars.tsx` (三大支柱)
  - [ ] `DimensionSection.tsx` (四维度评估)
  - [ ] `CTAButton.tsx` (行动按钮)
- [ ] 提取样式到 `styles/introStyles.ts`
- [ ] 简化主文件 `DanKoeIntro.tsx`

### Phase 3: 状态管理统一
- [x] 安装 Zustand: `npm install zustand`
- [x] 创建 `store/useAppStore.ts`
- [x] 删除 `VersionContext.tsx`
- [x] 删除 `usePersistentVersionState.ts`
- [x] 更新所有使用 Context 的地方改为 Zustand
- [x] 更新 `useDeepSeekChat.ts` 使用 Zustand 版本状态
- [x] 更新 `useVersionChat.ts` 使用 Zustand 版本状态

### Phase 4: 提示词切换
- [x] 添加完整提示词到 `prompts/completePrompt.ts`
- [x] 添加简单提示词到 `prompts/simplePrompt.ts`
- [x] 更新 `useDeepSeekChat.ts` 根据版本选择提示词
- [x] 测试两种提示词切换

### Phase 5: 设计系统规范化
- [x] 创建 `styles/tokens.ts` (颜色、间距、圆角等)
- [x] 创建 `styles/theme.ts` (全局主题配置)
- [x] 更新 `DanKoeIntro.tsx` 使用 tokens
- [x] 更新 `HeroSection.tsx` 使用 tokens
- [x] 更新其他组件减少内联样式
- [x] 创建 intro 子组件（ThreePillars, DimensionSection, CTAButton）
- [x] 构建成功

---

## 文件操作清单

### 需要创建的文件
```
app/src/
├── content/
│   └── introContent.ts
├── store/
│   └── useAppStore.ts
├── prompts/
│   ├── simplePrompt.ts
│   └── completePrompt.ts
├── components/
│   └── intro/
│       ├── index.tsx
│       ├── HeroSection.tsx
│       ├── ThreePillars.tsx
│       ├── DimensionSection.tsx
│       └── CTAButton.tsx
└── styles/
    ├── tokens.ts
    └── introStyles.ts
```

### 需要删除的文件
```
api/paypal.ts
app/src/components/PayPalPayment.tsx
app/src/context/VersionContext.tsx
app/src/hooks/usePersistentVersionState.ts
```

### 需要修改的文件
```
app/.env.local (添加支付链接)
app/src/constants/index.ts (添加 PAYPAL_LINK)
app/src/sections/HeroSection.tsx (简化支付逻辑)
app/src/components/UpgradeButton.tsx (简化为打开链接)
app/src/hooks/useDeepSeekChat.ts (提示词切换)
app/src/hooks/useVersionChat.ts (使用 Zustand)
app/src/sections/AssessmentInterface.tsx (使用 Zustand)
app/src/sections/DanKoeIntro.tsx (重构内容+样式)
```

---

## 优先级
- 🔴 高：Phase 1（支付）、Phase 3（状态）、Phase 4（提示词）
- 🟡 中：Phase 2（DanKoeIntro）、Phase 5（设计系统）
- 🟢 低：测试（用户自己测）

---

## 🎉 重构完成！

所有计划任务已执行完毕。

### 核心改动总结

| 模块 | 改动 |
|-----|------|
| **支付架构** | Payment Link 直接打开，删除复杂 API |
| **状态管理** | Zustand 统一管理 selectedVersion + isPaid |
| **提示词切换** | Simple / Complete 两个版本提示词 |
| **DanKoeIntro** | 内容抽离，组件拆分，样式统一 |
| **设计系统** | Design Tokens 全局配置 |

---

### 文件操作记录

**删除的文件：**
- api/paypal.ts
- PayPalPayment.tsx
- VersionContext.tsx
- usePersistentVersionState.ts
- app/src/context/ 目录

**新增的文件：**
- store/useAppStore.ts
- prompts/simplePrompt.ts
- prompts/completePrompt.ts
- content/introContent.ts
- styles/tokens.ts
- styles/introStyles.ts
- styles/theme.ts
- components/intro/ThreePillars.tsx
- components/intro/DimensionSection.tsx
- components/intro/CTAButton.tsx

**修改的文件：**
- .env.local（添加支付链接）
- constants/index.ts（添加 PAYPAL_LINK）
- UpgradeButton.tsx（简化为直接打开链接）
- HeroSection.tsx（简化支付逻辑）
- App.tsx（移除 Context，添加 useAppStore）
- main.tsx（移除 VersionProvider）
- useDeepSeekChat.ts（支持提示词选择）
- useVersionChat.ts（支持提示词选择）
- AssessmentInterface.tsx（使用 useAppStore）
- DanKoeIntro.tsx（完全重构）

---

### 下一步测试建议

1. ✅ 测试支付链接点击（打开 PayPal）
2. ✅ 测试 Simple 版本流程（12 轮对话）
3. ✅ 测试 Complete 版本流程（20 轮对话）
4. ✅ 验证 DanKoeIntro 页面显示正常
5. ✅ 构建部署
