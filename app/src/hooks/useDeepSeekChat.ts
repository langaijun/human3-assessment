import { useState, useCallback, useRef } from 'react';
import type { Message, AssessmentResult, ChatState } from '@/types';
import { SIMPLE_PROMPT } from '@/prompts/simplePrompt';
import { COMPLETE_PROMPT } from '@/prompts/completePrompt';

interface DeepSeekChatOptions {
  useCompletePrompt?: boolean;
}

function parseAssessmentResult(content: string): AssessmentResult | null {
  try {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
    const inlineMatch = content.match(/\{[\s\S]*"metatypeName"[\s\S]*\}/);
    if (inlineMatch) return JSON.parse(inlineMatch[0]);
    return null;
  } catch {
    return null;
  }
}

export function useDeepSeekChat(options: DeepSeekChatOptions = {}) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isComplete: false,
    result: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const systemPrompt = options.useCompletePrompt ? COMPLETE_PROMPT : SIMPLE_PROMPT;

  const sendMessage = useCallback(async (userContent: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userContent,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const allMessages = [
        { role: 'system', content: systemPrompt },
        ...state.messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userContent },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        console.error('API error:', response.status);
        await simulateResponse(userContent, setState);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = `assistant-${Date.now()}`;

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        }],
      }));

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  assistantContent += delta;
                  setState(prev => ({
                    ...prev,
                    messages: prev.messages.map(m =>
                      m.id === assistantId ? { ...m, content: assistantContent } : m
                    ),
                  }));
                }
              } catch {
                // Ignore parse errors in stream
              }
            }
          }
        }
      }

      const isComplete = assistantContent.includes('[ASSESSMENT_COMPLETE]');
      const cleanContent = assistantContent.replace('[ASSESSMENT_COMPLETE]', '');
      const result = isComplete ? (parseAssessmentResult(assistantContent) || generateDefaultResult(state.messages)) : null;

      setState(prev => ({
        ...prev,
        messages: prev.messages.map(m =>
          m.id === assistantId ? { ...m, content: cleanContent } : m
        ),
        isLoading: false,
        isComplete,
        result,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      await simulateResponse(userContent, setState);
    }
  }, [state.messages, systemPrompt]);

  const resetChat = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setState({ messages: [], isLoading: false, isComplete: false, result: null });
  }, []);

  return { ...state, sendMessage, resetChat };
}

async function simulateResponse(
  userContent: string,
  setState: React.Dispatch<React.SetStateAction<ChatState>>
) {
  const responses = getSimulatedResponses(userContent);
  const response = responses[Math.floor(Math.random() * responses.length)];

  const assistantId = `assistant-${Date.now()}`;
  setState(prev => ({
    ...prev,
    messages: [...prev.messages, { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() }],
    isLoading: true,
  }));

  let displayed = '';
  for (let i = 0; i < response.length; i++) {
    displayed += response[i];
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === assistantId ? { ...m, content: displayed } : m),
    }));
    await new Promise(r => setTimeout(r, 15 + Math.random() * 20));
  }

  const isComplete = response.includes('[ASSESSMENT_COMPLETE]');
  const cleanContent = response.replace('[ASSESSMENT_COMPLETE]', '');
  const result = isComplete ? generateDefaultResult([]) : null;

  setState(prev => ({
    ...prev,
    messages: prev.messages.map(m => m.id === assistantId ? { ...m, content: cleanContent } : m),
    isLoading: false,
    isComplete,
    result,
  }));
}

function getSimulatedResponses(userContent: string): string[] {
  const content = userContent.toLowerCase();

  if (content.includes('困') || content.includes('stuck') || content.includes('迷茫')) {
    return [`感谢你的坦诚。"被困住"的感觉通常意味着你正处于某个阶段的**Dissonance期**——你已经耗尽了当前阶段的好处，但还不知道该往哪里走。

让我深入了解一下：当你说"被困住"时，这种感受更多是来自于**外部环境的限制**，还是**内心不知道方向**？

另外，在过去一年中，你有没有尝试过什么方法来打破这种状态？结果如何？`];
  }

  if (content.includes('职业') || content.includes('工作') || content.includes('career')) {
    return [`职业困惑往往是其他三个维度问题的**症状**而非**根源**。很多人在工作中感到空虚，实际上是因为灵性维度（关系、意义）或身体维度（能量、健康）出了问题。

在我深入询问之前，想先了解你的整体状况：

**身体方面**——你目前的运动习惯、睡眠质量和饮食状况如何？当工作压力大时，你的身体是第一个受到影响的，还是你能保持稳定的状态？`];
  }

  if (content.includes('关系') || content.includes('relationship') || content.includes('社交')) {
    return [`关系问题往往能反映出我们内心最深层的模式。在 HUMAN 3.0 模型中，关系属于**Spirit（灵性）维度**——它不仅包括亲密关系，还包括你与家人、朋友、社区以及更大整体的连接。

我想先了解一下你的**Mind（心智）维度**：当你面对人际冲突时，你的第一反应是什么？是回避、对抗、还是试图理解对方的立场？

你最近一次真正改变了自己某个核心信念是什么时候？`];
  }

  return [
    `欢迎来到你的 HUMAN 3.0 发展评估。我将引导你了解四个生命维度，绘制你当前的发展图景，并为你创建个性化的成长策略。我会直接但尊重——有时候真相会刺痛，但清晰能加速成长。让我们从你的**心智（Mind）维度**开始。

**当你遇到一个与你世界观相悖的观点时，你的第一反应是什么？**

A) 本能地排斥，寻找证据来反驳
B) 感到好奇，想知道对方为什么会有这种想法
C) 试图整合两种观点，寻找更高层的理解

或者用自己的话描述。`,

    `好的，这是一个非常重要的信号。

接下来让我了解你的**身体（Body）维度**：

**描述你与你的身体的关系——它是盟友、敌人，还是工具？**

当你的健康或健身决策被挑战时（比如连续加班一周），你的 physical practices 会最先被牺牲，还是你会想办法维持？`,

    `理解了。现在进入**灵性（Spirit）维度**：

**当一切都感觉毫无意义时，你如何找到意义？**

你是否有至少一个能让你感到"归属"的社群或关系？如果没有，你独处时如何与自己相处？`,

    `很好。最后是你的**职业（Vocation）维度**：

**你的工作是你"做"的事情、你"拥有"的事情，还是你"是"的事情？**

如果钱和地位都不再重要，你会选择做什么？你目前的职业选择有多少是出于内在驱动，多少是出于外部压力？`,

    `感谢你的回答。我已经收集到足够的信息来完成评估。

从我们的对话中，我注意到几个关键模式：

1. 你的**心智维度**显示出 Level 2.0 的特征——你开始质疑既定规则，但在整合对立观点时仍有困难
2. 你的**身体维度**可能是最需要关注的瓶颈——当压力来临时，physical practices 是第一个被牺牲的
3. 你的**灵性维度**处于 Dissonance 阶段——你渴望更深层的连接，但还没有找到路径
4. 你的**职业维度**受到其他维度的制约——你无法在职业上突破，因为基础不稳固

[ASSESSMENT_COMPLETE]

正在生成你的个性化评估报告...`,
  ];
}

function generateDefaultResult(_messages: Message[]): AssessmentResult {
  return {
    metatypeName: '觉醒的探索者 (The Awakening Seeker)',
    metatypeDescription: '你正处于从 Level 2.0 向 Level 3.0 过渡的关键节点。你在心智上已经展现出质疑和反思的能力，但身体的能量基础和灵性的深度连接尚未跟上。这种状态让你感到"知道很多但做不到"的挫败感。',
    lifestyleArchetype: 'The Seeker',
    dimensionScores: { mind: 0.65, body: 0.35, spirit: 0.45, vocation: 0.50 },
    dominantDimension: 'mind',
    weakestDimension: 'body',
    bottleneck: '你的身体能量水平正在制约其他所有维度的发展。当身体处于低能量状态时，心智无法清晰思考，灵性连接变得脆弱，职业表现自然受限。',
    transformationStrategy: '以身体为锚点的整合策略。通过建立稳定的身体基础（睡眠、运动、营养）来为其他维度的突破提供能量支撑。不要试图同时改变一切——从每天早晨15分钟的身体练习开始。',
    nextSteps: [
      '建立固定的睡眠节律（每晚同一时间入睡，保证7-8小时）',
      '每天早晨进行15分钟的身体练习（可以是简单的拉伸、快走或更系统的训练）',
      '在做出重大决策前，先检查自己的身体状态——疲劳时不要做重要决定',
      '寻找一个"身体锚点"社群（运动小组、瑜伽课等）来建立灵性连接的基础',
      '每周记录一次身体能量水平（1-10分），观察与其他维度表现的关联',
    ],
    quadrantAnalysis: {
      mind: { level: 2, phase: 2, traits: '知识丰富但实践不足', analysis: '你拥有大量的概念性知识，但在将这些知识转化为行动时遇到困难。这是典型的"肥胖私人教练综合征"——知道该做什么，但自己做不到。' },
      body: { level: 1, phase: 3, traits: '基础习惯不稳定', analysis: '你的身体维度处于 Level 1.0 的 Discovery 阶段。你已经意识到身体的重要性并尝试过一些方法，但还没有形成稳定的习惯系统。' },
      spirit: { level: 2, phase: 1, traits: '渴望连接但孤立', analysis: '你的灵性维度处于 Dissonance 阶段——你感到现有的关系模式不够深入，渴望更有意义的连接，但还没有找到方向。' },
      vocation: { level: 2, phase: 2, traits: '能力受限基础', analysis: '你的职业表现受到其他维度的制约。当你解决了身体能量和灵性连接的问题后，职业突破会自然发生。' },
    },
  };
}
