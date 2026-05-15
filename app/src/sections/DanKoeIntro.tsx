/**
 * Human3.0 框架介绍页面
 */
import { X, ArrowRight, Eye, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BG = '#FDF6E3';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';
const BORDER = '#E8DCC8';
const ACCENT = '#8C7E6A';

export default function DanKoeIntro({ onClose, onStartAssessment }: {
  onClose: () => void;
  onStartAssessment: (initialInput?: string) => void;
}) {
  return (
    <div className="relative w-full min-h-screen flex flex-col" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: TEXT }}>
          <span className="text-xs font-bold" style={{ color: BG }}>H</span>
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
              Human 3.0 思想框架
            </h1>
            <p className="text-lg" style={{ color: TEXT_MUTED }}>
              重塑你的思维模型
            </p>
          </div>

          {/* Three Pillars */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: TEXT }}>
              Human 3.0 的三大核心支柱
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${ACCENT}15` }}>
                  <Eye className="w-8 h-8" style={{ color: TEXT }} />
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
                  <Target className="w-8 h-8" style={{ color: TEXT }} />
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
                  <User className="w-8 h-8" style={{ color: TEXT }} />
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
              这个评估系统基于 Human 3.0 核心理念设计而来。它不仅仅是一个评估工具，更是一个帮助你发现自我、明确方向、真实生活的系统。
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
              通过评估你的<strong>心智（Mind）</strong>、<strong>身体（Body）</strong>、<strong>灵性（Spirit）</strong>和<strong>职业（Vocation）</strong>四个维度，我们帮你：
            </p>
            <ul className="space-y-3 ml-6" style={{ color: '#6B5F50' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: ACCENT }}>•</span>
                <span>理解你的思维模式</span>
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

          {/* CTA */}
          <div className="text-center pb-8">
            <Button
              onClick={() => onStartAssessment?.()}
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