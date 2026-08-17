import { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check, Eye, EyeOff } from 'lucide-react';
import { loadApiKey, saveApiKey } from '@/lib/storage';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function SettingsModal({ open, onClose, onSaved }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setApiKey(loadApiKey());
      setSaved(false);
    }
  }, [open]);

  if (!open) return null;

  function handleSave() {
    saveApiKey(apiKey.trim());
    setSaved(true);
    onSaved?.();
    window.setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="card animate-scale-in w-full max-w-md overflow-hidden rounded-b-none sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary-700" />
            <h2 className="font-serif text-base font-semibold text-ink-900">Gemini API Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-ink-600">
            Enter your Google Gemini API key to generate project report chapters. The key is stored
            only on this device and is never sent anywhere except directly to Google's API.
          </p>

          <div className="mt-4">
            <label htmlFor="apiKey" className="input-label">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="input-field pr-10 font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-600"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800"
          >
            Get a free API key from Google AI Studio
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-6 py-4">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={!apiKey.trim()}>
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              'Save Key'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
