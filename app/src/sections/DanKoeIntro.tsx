/**
 * Human3.0 框架介绍页面
 */
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BG = '#FDF6E3';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';
const BORDER = '#E8DCC8';
const ACCENT = '#8C7E6A';

export default function DanKoeIntro({ onClose, onStartAssessment }: {
  onClose: () => void;
  onStartAssessment: () => void;
}) {
  return (
    <div className="relative w-full min-h-screen flex flex-col" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: TEXT }}>
            <span className="text-xs font-bold" style={{ color: BG }}>H</span>
          </div>
          <span className="text-sm font-medium" style={{ color: TEXT }}>Human 3.0</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: TEXT }}>
              认识 Dan Koe
            </h1>
            <p className="text-lg" style={{ color: TEXT_MUTED }}>
              重塑你的思维模型
            </p>
          </div>

          {/* Introduction */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-xl font-semibold mb-3" style={{ color: TEXT }}>
                谁是 Dan Koe？
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                Dan Koe 是一位成功的创作者、思维模型和创业导师。他的核心思想是帮助人们从"员工思维模式"（Employee Mindset）中解放出来，过上更自主、更有意义的生活。
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                通过他的内容、播客和课程，他影响了数以百万计的人，帮助他们找到了自己的创作道路、建立了可持续的事业，并实现了真正的自由。
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3" style={{ color: TEXT }}>
                War Mode vs Monk Mode
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                Dan Koe 提出了两种人生发展模式：<strong>War Mode</strong>（战争模式）和<strong>Monk Mode</strong>（僧侣模式）。
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#6B5F50' }}>
                <li>• <strong>War Mode</strong>: 通过竞争、外验证、社交媒体来证明自己 - 最终精疲力竭</li>
                <li>• <strong>Monk Mode</strong>: 通过深度工作、创造价值、建立真实连接来实现自我 - 可持续成长</li>
              </ul>
              <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                Human 3.0 评估系统正是基于这种深刻的认知模式设计而来。
              </p>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: TEXT }}>
              Human 3.0 的三大核心支柱
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${ACCENT}15` }}>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth={1.5}>
                    <path d="M15 12a2 2 2 8v10H7m-4v2a-2-2h3c6.8 3.6 3.6a-2 2h-3c6.8-3.6c6.8-3a-2-2-5m0 0-3.6l2 3.6v2-2a-2 2.8v-2a-2 2h-12m0-1.6 3.6 3.6-3.6-3.6a-2 2h-3c6.8-3.6 3.6a-2 2-5" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: TEXT }}>Vision</h3>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>愿景</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                  清晰的方向感
                  <br />
                  知道你为什么而做
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${ACCENT}15` }}>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth={1.5}>
                    <path d="M2 12l4 4-4h12l-4 4h12l4-4M6 6l-4-4h12M10 12a4 4 4H4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: TEXT }}>Clarity</h3>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>清晰度</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                  明确的目标
                  <br />
                  消除噪音
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${ACCENT}15` }}>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth={1.5}>
                    <path d="M9 12l2 4 4h-4m4-4h4m6 12l-4 4h12l-4-4H18M12 4a4 4 4H4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: TEXT }}>Identity</h3>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>身份</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                  知道你是谁
                  <br />
                  真实不装
                </p>
              </div>
            </div>
          </div>

          {/* Connection to Human 3.0 */}
          <div className="p-6 rounded-xl mb-8" style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT }}>
              这个评估系统基于 Dan Koe 的核心理念设计而来。它不仅仅是一个评估工具，更是一个帮助你发现自我、明确方向、真实生活的系统。
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
              通过评估你的<strong>心智（Mind）</strong>、<strong>身体（Body）</strong>、<strong>灵性（Spirit）</strong>和<strong>职业（Vocation）</strong>四个维度，我们帮你：
            </p>
            <ul className="space-y-3 ml-6" style={{ color: '#6B5F50' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: ACCENT }}>•</span>
                <span>理解你的思维模式（War Mode vs Monk Mode）</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: ACCENT }}>•</span>
                <span>发现你的核心支柱（Vision, Clarity, Identity）</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: ACCENT }}>•</span>
                <span>生成个性化的转型策略和行动计划</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: ACCENT }}>•</span>
                <span>提供持续的改进反馈和成长追踪</span>
              </li>
            </ul>
          </div>

          {/* Quote */}
          <div className="p-6 text-center">
            <blockquote className="max-w-2xl mx-auto">
              <p className="text-lg italic mb-4" style={{ color: TEXT }}>
                "最好的投资是投资自己——培养你的思维方式，构建你的技能，建立你的事业。"
              </p>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                —— Dan Koe
              </p>
            </blockquote>
          </div>

          {/* CTA */}
          <div className="text-center pb-8">
            <Button
              onClick={onStartAssessment}
              size="lg"
              className="px-8"
              style={{ background: ACCENT }}
            >
              <span className="flex items-center gap-2">
                开始你的 Human 3.0 评估
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
