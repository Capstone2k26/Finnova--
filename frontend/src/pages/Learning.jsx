import React from 'react';
import { useQuery } from 'react-query';
import { learningService } from '../services';
import { AcademicCapIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const Learning = () => {
  const { data: modulesData } = useQuery('learning-modules', learningService.getModules);
  const { data: progressData } = useQuery('learning-progress', learningService.getUserProgress);

  const modules = modulesData?.data?.modules || [];
  const progress = progressData?.data?.progress || [];

  const categories = [
    { id: 'banking', name: 'Banking', color: 'blue' },
    { id: 'stocks', name: 'Stock Market', color: 'green' },
    { id: 'mutual_funds', name: 'Mutual Funds', color: 'purple' },
    { id: 'bonds', name: 'Bonds', color: 'yellow' },
    { id: 'accounting', name: 'Accounting', color: 'red' },
    { id: 'budgeting', name: 'Budgeting', color: 'pink' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Learning Hub</h1>
        <p className="text-gray-600 mt-1">Enhance your financial literacy through interactive modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => (
          <div key={category.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {modules.filter(m => m.category === category.id).length} modules
                </p>
              </div>
              <AcademicCapIcon className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">All Learning Modules</h3>
        <div className="space-y-4">
          {modules.map((module) => {
            const userProgress = progress.find(p => p.moduleId === module.id);
            const isCompleted = userProgress?.status === 'completed';
            const progressValue = userProgress?.progress || 0;

            return (
              <div key={module.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{module.title}</h4>
                      {isCompleted && (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {module.duration} min
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded capitalize text-xs">
                        {module.level}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize text-xs">
                        {module.category.replace('_', ' ')}
                      </span>
                    </div>

                    {progressValue > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{progressValue}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all" 
                            style={{ width: `${progressValue}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="ml-4 btn-primary">
                    {isCompleted ? 'Review' : progressValue > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            );
          })}
          {modules.length === 0 && (
            <p className="text-gray-500 text-center py-8">No modules available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;
