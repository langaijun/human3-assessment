/**
 * Human3.0 系统版本选择器组件
 */
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { VERSION_FEATURES } from '@/constants';
import type { AppVersion } from '@/types';

interface VersionSelectorProps {
  selectedVersion: AppVersion;
  onVersionSelect: (version: AppVersion) => void;
}

export default function VersionSelector({
  selectedVersion,
  onVersionSelect,
}: VersionSelectorProps) {
  const [isSwitching, setIsSwitching] = useState(false);

  const handleVersionChange = (newVersion: AppVersion) => {
    setIsSwitching(true);

    setTimeout(() => {
      onVersionSelect(newVersion);
      setIsSwitching(false);
    }, 300);
  };

  const versions = [
    VERSION_FEATURES.simple,
    VERSION_FEATURES.complete,
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {versions.map((version) => (
          <Card
            key={version.id}
            className={`relative cursor-pointer transition-all duration-300 ${
              selectedVersion === version.id
                ? 'ring-2 ring-blue-500 scale-105 shadow-lg'
                : 'opacity-70 hover:opacity-90 hover:scale-[1.02] hover:shadow-md'
            }`}
            onClick={() => handleVersionChange(version.id)}
          >
            {version.recommended && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  推荐
                </span>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{version.title}</h3>
                {version.price && version.price > 0 && (
                  <span className="text-2xl font-bold text-blue-600">
                    ${version.price}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4 text-sm">
                {version.description}
              </p>

              <ul className="space-y-2 mb-6">
                {version.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedVersion === version.id && (
                <Button className="w-full" size="lg">
                  {version.id === 'simple' ? '开始评估' : '重新开始'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {isSwitching && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>切换中...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
