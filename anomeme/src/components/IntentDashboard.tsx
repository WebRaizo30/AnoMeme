"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Eye,
  Pause,
  Play,
  X,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap
} from 'lucide-react';
import { useIntents } from '@/hooks/useIntents';
import { IntentRequest } from '@/services/anomaService';
import { IntentCreationModal } from './IntentCreationModal';
import { Intent } from '@/services/anomaService';
import { Tooltip } from '@/components/ui/tooltip';

export function IntentDashboard() {
  const { 
    intents, 
    activeIntents, 
    completedIntents, 
    failedIntents, 
    intentStats, 
    createIntent, 
    creating, 
    loading, 
    error, 
    formatIntent,
    cancelIntent 
  } = useIntents();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'completed' | 'failed'>('active');

  const handleCreateIntent = async (intentData: Omit<IntentRequest, 'user_address'>) => {
    const result = await createIntent(intentData);
    if (result) {
      console.log('✅ Intent created successfully:', result);
    }
  };

  const getIntentsToShow = () => {
    switch (selectedTab) {
      case 'active': return activeIntents;
      case 'completed': return completedIntents;
      case 'failed': return failedIntents;
      default: return intents;
    }
  };

  const getStatusIcon = (status: Intent['status']) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <X className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Intent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-red-500/20 text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Terminal Header */}
      <div className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-black p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/30 border border-blue-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-400 font-mono">&gt; INTENT_DASHBOARD</h2>
              <p className="text-xs text-gray-400 font-mono">AUTOMATED_TRADING_MANAGEMENT</p>
            </div>
          </div>
          <Tooltip content="Create a new automated trading intent based on social signals" position="bottom">
            <Button
              onClick={() => setShowCreateModal(true)}
              data-tutorial="create-intent"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-2 border-blue-500 text-white font-bold font-mono px-6 py-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              disabled={creating}
            >
              <Plus className="w-4 h-4 mr-2" />
              CREATE_INTENT
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Terminal Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Tooltip content="Total number of intents created across all statuses" position="top">
          <Card className="p-4 bg-black border-2 border-gray-600 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-mono">TOTAL_INTENTS</p>
                <p className="text-2xl font-bold text-white font-mono">{intentStats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
        </Tooltip>
        
        <Tooltip content="Currently active intents monitoring social signals" position="top">
          <Card className="p-4 bg-black border-2 border-gray-600 hover:border-green-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-mono">ACTIVE</p>
                <p className="text-2xl font-bold text-green-400 font-mono">{intentStats.active}</p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </Card>
        </Tooltip>
        
        <Tooltip content="Successfully executed intents that completed their trading actions" position="top">
          <Card className="p-4 bg-black border-2 border-gray-600 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-mono">COMPLETED</p>
                <p className="text-2xl font-bold text-blue-400 font-mono">{intentStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
        </Tooltip>
        
        <Tooltip content="Intents that failed due to errors or invalid conditions" position="top">
          <Card className="p-4 bg-black border-2 border-gray-600 hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-mono">FAILED</p>
                <p className="text-2xl font-bold text-red-400 font-mono">{intentStats.failed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </Card>
        </Tooltip>
      </div>

      {/* Terminal Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'active', label: 'ACTIVE', count: intentStats.active, tooltip: 'Currently monitoring social signals and ready to execute trades' },
          { id: 'all', label: 'ALL', count: intentStats.total, tooltip: 'View all intents regardless of status' },
          { id: 'completed', label: 'COMPLETED', count: intentStats.completed, tooltip: 'Successfully executed intents that completed their trading actions' },
          { id: 'failed', label: 'FAILED', count: intentStats.failed, tooltip: 'Intents that encountered errors or failed validation' }
        ].map(tab => (
          <Tooltip key={tab.id} content={tab.tooltip} position="bottom">
            <button
              onClick={() => setSelectedTab(tab.id as 'all' | 'active' | 'completed' | 'failed')}
              className={`px-4 py-2 border-2 text-xs font-mono font-bold transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-black border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-500/20 border-red-500/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card className="p-8 bg-gray-800/50 border-gray-700">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Loading intents...</p>
          </div>
        </Card>
      )}

      {/* Intent List */}
      {!loading && (
        <div className="space-y-4">
          {getIntentsToShow().length === 0 ? (
            <Card className="p-8 bg-gray-800/50 border-gray-700">
              <div className="text-center">
                <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/80 mb-2">
                  {selectedTab === 'active' ? 'No Active Intents' : `No ${selectedTab} Intents`}
                </h3>
                <p className="text-white/50 text-sm mb-4">
                  {selectedTab === 'active' 
                    ? 'Create your first intent to start automated trading'
                    : `You don't have any ${selectedTab} intents yet`
                  }
                </p>
                {selectedTab === 'active' && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Intent
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            getIntentsToShow().map(intent => {
              const formatted = formatIntent(intent);
              return (
                <Card key={intent.id} className="p-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-white">{formatted.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(intent.status)}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(intent.status)}
                            {intent.status.toUpperCase()}
                          </div>
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={getRiskColor(formatted.risk)}
                        >
                          {formatted.risk.toUpperCase()} RISK
                        </Badge>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-3">{formatted.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-white/50">Amount:</span>
                          <div className="text-white font-medium">{intent.trading_action.amount} {intent.trading_action.from_token}</div>
                        </div>
                        <div>
                          <span className="text-white/50">Stop Loss:</span>
                          <div className="text-red-400 font-medium">{intent.risk_parameters.stop_loss}</div>
                        </div>
                        <div>
                          <span className="text-white/50">Take Profit:</span>
                          <div className="text-green-400 font-medium">{intent.risk_parameters.take_profit}</div>
                        </div>
                      </div>

                      {intent.executions && intent.executions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-white/80">Recent Executions</span>
                          </div>
                          <div className="space-y-1">
                            {intent.executions.slice(0, 2).map((execution, index) => (
                              <div key={index} className="text-xs text-white/60 flex items-center justify-between">
                                <span>Block {execution.block_number}</span>
                                <span className="text-green-400">{execution.execution_price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Tooltip content="View detailed information about this intent" position="top">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white/60 border-gray-600 hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                      
                      {intent.status === 'active' && (
                        <>
                          <Tooltip content="Pause this intent temporarily (it will stop monitoring signals)" position="top">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-yellow-400 border-yellow-600 hover:bg-yellow-600/20"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Cancel this intent permanently (cannot be undone)" position="top">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelIntent(intent.id)}
                              className="text-red-400 border-red-600 hover:bg-red-600/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Create Intent Modal */}
      <IntentCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateIntent={handleCreateIntent}
        isCreating={creating}
      />
    </div>
  );
}
