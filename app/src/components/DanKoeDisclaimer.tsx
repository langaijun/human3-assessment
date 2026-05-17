/**
 * Dan Koe Human 3.0 框架声明弹窗
 */
import { X } from 'lucide-react';

interface DanKoeDisclaimerProps {
  onClose: () => void;
}

export default function DanKoeDisclaimer({ onClose }: DanKoeDisclaimerProps) {
  const TEXT = '#3D3229';
  const TEXT_MUTED = '#8C7E6A';
  const BORDER = '#E8DCC8';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto" style={{ background: '#FDF6E3' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h3 className="text-base font-medium" style={{ color: TEXT }}>关于 Human 3.0</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors hover:bg-gray-100"
          >
            <X className="w-5 h-5" style={{ color: TEXT_MUTED }} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* 中文版 */}
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: TEXT }}>中文版</h4>
            <div className="space-y-2 text-sm" style={{ color: '#5C5245', lineHeight: '1.8' }}>
              <p>灵感来源于 Dan Koe 的 Human 3.0 框架</p>
              <p>本测评是独立开发的工具，受 Dan Koe Human 3.0 模型启发。</p>
              <p>我们与 Dan Koe 或 thedankoe.com 无任何从属、授权或合作关系。</p>
              <p>所有原创理念的功劳归于他。我们希望通过这个工具让更多人受益。</p>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}` }}></div>

          {/* 英文版 */}
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: TEXT }}>英文版</h4>
            <div className="space-y-2 text-sm" style={{ color: '#5C5245', lineHeight: '1.8' }}>
              <p>Inspired by Dan Koe's Human 3.0 Framework</p>
              <p>This assessment is an independent tool inspired by Dan Koe's Human 3.0 model.</p>
              <p>We are not affiliated with, endorsed by, or connected to Dan Koe or thedankoe.com.</p>
              <p>All credit for the original concepts goes to him. We built this to help more people apply these powerful ideas in their daily lives.</p>
            </div>
          </div>

          {/* 链接 */}
          <div style={{ borderTop: `1px solid ${BORDER}` }}></div>
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: TEXT }}>原文链接</h4>
            <div className="space-y-2">
              <a
                href="https://thedankoe.com/letters/a-complete-knowledge-base-of-human-3-0/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm hover:underline transition-colors"
                style={{ color: '#8C7E6A' }}
              >
                A Complete Knowledge Base Of HUMAN 3.0
              </a>
              <a
                href="https://letters.thedankoe.com/p/prompt-human-30-self-discovery-and"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm hover:underline transition-colors"
                style={{ color: '#8C7E6A' }}
              >
                HUMAN 3.0 Self-Discovery & Metatype Test
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg text-sm font-medium transition-all"
            style={{ background: '#8C7E6A', color: '#FFFFFF' }}
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}