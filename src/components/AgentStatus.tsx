import React from 'react';
import { Card, CardBody, Chip } from '@nextui-org/react';
import { Bot, Brain, Target, TrendingUp, Users, Zap, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface AgentStatusProps {
  selectedAgent: string;
  isSearching: boolean;
  databaseStatus: {
    status: string;
    total_resumes: number;
    database_ready: boolean;
  };
}

export const AgentStatus: React.FC<AgentStatusProps> = ({ 
  selectedAgent, 
  isSearching, 
  databaseStatus 
}) => {
  const agents = {
    skill_matcher: {
      name: 'Skill Matcher',
      icon: Target,
      description: 'Analyzes technical skills and competencies',
      color: 'success'
    },
    experience_analyzer: {
      name: 'Experience Analyzer', 
      icon: TrendingUp,
      description: 'Evaluates work history and career progression',
      color: 'warning'
    },
    relevancy_scorer: {
      name: 'Relevancy Scorer',
      icon: Brain,
      description: 'Scores and ranks candidate relevance',
      color: 'secondary'
    },
    seniority_detector: {
      name: 'Seniority Detector',
      icon: Users,
      description: 'Identifies leadership and seniority levels',
      color: 'primary'
    },
    general_analyzer: {
      name: 'General Analyzer',
      icon: Bot,
      description: 'Comprehensive resume analysis',
      color: 'default'
    }
  };

  const currentAgent = agents[selectedAgent as keyof typeof agents] || agents.general_analyzer;
  const IconComponent = currentAgent.icon;

  return (
    <Card className="shadow-md border border-gray-200">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isSearching ? 'animate-pulse' : ''}`}>
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">AI Agent System</h3>
                <p className="text-sm text-gray-600">Multi-agent recruitment analysis</p>
              </div>
            </div>
            
            {isSearching && (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-sm text-yellow-600 font-medium">Processing...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Database Status */}
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gray-500" />
              <div className="flex items-center gap-1">
                {databaseStatus.database_ready ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                )}
                <span className="text-xs text-gray-600">
                  {databaseStatus.total_resumes} resumes
                </span>
              </div>
            </div>

            {/* Active Agent */}
            <Chip 
              color={currentAgent.color as any}
              variant="flat"
              startContent={<IconComponent className="w-3 h-3" />}
            >
              {currentAgent.name}
            </Chip>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">{currentAgent.description}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};