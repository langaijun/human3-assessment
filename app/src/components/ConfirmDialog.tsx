/**
 * Human3.0 系统确认对话框组件
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { VERSION_FEATURES } from '@/constants';
import type { AppVersion } from '@/types';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  icon?: React.ReactNode;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  isLoading = false,
  icon,
  destructive = false
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {icon || <AlertTriangle className="w-5 h-5 text-yellow-500" />}
            <span>{title || '确认操作'}</span>
          </DialogTitle>
          <DialogDescription>
            {description || '您确定要执行此操作吗？'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={destructive ? 'destructive' : 'default'}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface VersionSwitchConfirmProps {
  targetVersion: AppVersion;
  currentVersion: AppVersion;
  requiresPayment?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VersionSwitchConfirm({
  targetVersion,
  currentVersion,
  requiresPayment = false,
  onConfirm,
  onCancel,
  isLoading = false
}: VersionSwitchConfirmProps) {
  const currentFeatures = VERSION_FEATURES[currentVersion];
  const targetFeatures = VERSION_FEATURES[targetVersion];

  const isUpgrade = targetVersion === 'complete' && currentVersion === 'simple';
  const isDowngrade = targetVersion === 'simple' && currentVersion === 'complete';

  const title = isUpgrade
    ? '升级到完整版'
    : isDowngrade
    ? '降级到基础版'
    : '切换版本';

  const priceText = requiresPayment
    ? `需要支付 $${targetFeatures.price}`
    : '';

  const description = isUpgrade
    ? `您即将从「${currentFeatures.title}」升级到「${targetFeatures.title}」。${priceText}切换版本将丢失当前评估进度，确定要继续吗？`
    : isDowngrade
    ? `您即将从「${currentFeatures.title}」降级到「${targetFeatures.title}」。切换版本将丢失完整版功能，确定要继续吗？`
    : `您确定要切换到「${targetFeatures.title}」吗？切换后将重新开始评估。`;

  return (
    <ConfirmDialog
      open={true}
      title={title}
      description={description}
      confirmText={isUpgrade ? '立即支付' : '确认切换'}
      cancelText="取消"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      destructive={isDowngrade}
    />
  );
}
