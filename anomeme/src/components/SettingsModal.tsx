"use client";

import React, { useState } from 'react';
import { X, Monitor, Eye, EyeOff, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    language: 'en',
    showTutorial: true,
    showTooltips: true,
    compactMode: false
  });

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-red-500/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/20 to-black p-4 border-b-2 border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white font-mono">TERMINAL_SETTINGS</h2>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse animation-delay-500"></div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-gray-600 hover:border-white/40 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Interface Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Monitor className="w-5 h-5 text-red-500" />
              INTERFACE_SETTINGS
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-mono">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full p-2 bg-black border border-gray-600 text-white rounded font-mono text-sm focus:border-red-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="tr">Türkçe</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-300 font-mono">Show Tutorial</span>
                  <p className="text-xs text-gray-500 font-mono">Display tutorial on first visit</p>
                </div>
                <button
                  onClick={() => handleSettingChange('showTutorial', !settings.showTutorial)}
                  className={`p-2 rounded border transition-all ${
                    settings.showTutorial
                      ? 'bg-green-500/20 border-green-500/40 text-green-400'
                      : 'bg-gray-500/20 border-gray-500/40 text-gray-400'
                  }`}
                >
                  {settings.showTutorial ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-300 font-mono">Show Tooltips</span>
                  <p className="text-xs text-gray-500 font-mono">Display helpful tooltips on hover</p>
                </div>
                <button
                  onClick={() => handleSettingChange('showTooltips', !settings.showTooltips)}
                  className={`p-2 rounded border transition-all ${
                    settings.showTooltips
                      ? 'bg-green-500/20 border-green-500/40 text-green-400'
                      : 'bg-gray-500/20 border-gray-500/40 text-gray-400'
                  }`}
                >
                  {settings.showTooltips ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-300 font-mono">Compact Mode</span>
                  <p className="text-xs text-gray-500 font-mono">Reduce spacing for smaller screens</p>
                </div>
                <button
                  onClick={() => handleSettingChange('compactMode', !settings.compactMode)}
                  className={`p-2 rounded border transition-all ${
                    settings.compactMode
                      ? 'bg-green-500/20 border-green-500/40 text-green-400'
                      : 'bg-gray-500/20 border-gray-500/40 text-gray-400'
                  }`}
                >
                  {settings.compactMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>


          {/* Info Section */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-bold text-white font-mono mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              IMPORTANT_NOTES
            </h4>
            <div className="text-xs text-gray-400 font-mono space-y-1">
              <p>• Risk tolerance is set per intent, not globally</p>
              <p>• Social signals are currently mock data</p>
              <p>• Portfolio data is simulated for demo</p>
              <p>• Settings are saved in browser storage</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-black to-red-900/20 p-4 border-t-2 border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400 font-mono">
              Settings are saved automatically
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-white hover:bg-red-500/30 transition-all font-mono text-sm rounded"
              >
                SAVE_SETTINGS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
