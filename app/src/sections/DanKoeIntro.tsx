/**
 * Human3.0 框架介绍页面
 */
import { X, ArrowRight, Eye, Target, User, CheckCircle } from 'lucide-react';
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
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-10 pb-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: TEXT }}>
              思想框架
            </h1>
            <p className="text-lg" style={{ color: TEXT_MUTED }}>
              重塑你的思维模型
            </p>
          </div>

          {/* Three Pillars */}
          <div>
            <h2 className="text-2xl font-semibold mb-8 text-center" style={{ color: TEXT }}>
              三大核心支柱
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg cursor-pointer" style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${ACCENT}15` }}>
                  <Eye className="w-8 h-8" style={{ color: TEXT }} />
                </div>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: TEXT }}>Vision</h3>
                <p className="text-sm mb-3" style={{ color: TEXT_MUTED }}>愿景</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                  清晰的方向感 · 知道你为什么而做
                </p>
              </div>

              <div className="text-center p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg cursor-pointer" style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${ACCENT}15` }}>
                  <Target className="w-8 h-8" style={{ color: TEXT }} />
                </div>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: TEXT }}>Clarity</h3>
                <p className="text-sm mb-3" style={{ color: TEXT_MUTED }}>清晰度</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                  明确的目标 · 消除噪音
                </p>
              </div>

              <div className="text-center p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg cursor-pointer" style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${ACCENT}15` }}>
                  <User className="w-8 h-8" style={{ color: TEXT }} />
                </div>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: TEXT }}>Identity</h3>
                <p className="text-sm mb-3" style={{ color: TEXT_MUTED }}>身份</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5F50' }}>
                  知道你是谁 · 真实不装
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Dimensions */}
          <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: TEXT }}>
              四维度评估
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B5F50' }}>
              通过评估 <strong>心智（Mind）</strong>、<strong>身体（Body）</strong>、<strong>灵性（Spirit）</strong> 和 <strong>职业（Vocation）</strong> 四个维度，我们帮你：
            </p>
            <ul className="space-y-4 ml-0" style={{ color: '#6B5F50' }}>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <span>理解你的思维模式</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <span>发现你的核心支柱（Vision, Clarity, Identity）</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <span>生成个性化的转型策略和行动计划</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <span>提供持续的改进反馈和成长追踪</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={() => onStartAssessment?.()}
              size="lg"
              className="px-8 py-4"
              style={{ background: ACCENT }}
            >
              <span className="flex items-center gap-2 text-base">
                开始评估
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}