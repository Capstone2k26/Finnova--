import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { AcademicCapIcon, CheckCircleIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { learningService } from '../services';

const categories = [
  { id: 'all', name: 'All topics' },
  { id: 'banking', name: 'Banking' },
  { id: 'stocks', name: 'Stock Market' },
  { id: 'mutual_funds', name: 'Mutual Funds' },
  { id: 'bonds', name: 'Bonds' },
  { id: 'accounting', name: 'Accounting' },
  { id: 'budgeting', name: 'Budgeting' }
];

const Learning = () => {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const { data: modulesData, isLoading: modulesLoading, isError: modulesError } = useQuery('learning-modules', learningService.getModules);
  const { data: progressData, isLoading: progressLoading, isError: progressError } = useQuery('learning-progress', learningService.getUserProgress);

  const modules = modulesData?.data?.modules || [];
  const progress = progressData?.data?.progress || [];
  const progressByModule = new Map(progress.map((entry) => [entry.moduleId, entry]));
  const completedCount = progress.filter((entry) => entry.status === 'completed').length;
  const filteredModules = useMemo(() => modules.filter((module) => {
    const matchesCategory = category === 'all' || module.category === category;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${module.title} ${module.description || ''} ${module.category}`.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  }), [modules, category, search]);

  const refreshProgress = () => queryClient.invalidateQueries('learning-progress');
  const startMutation = useMutation(
    (moduleId) => learningService.updateProgress(moduleId, { progress: 25, status: 'in_progress' }),
    {
      onSuccess: () => {
        refreshProgress();
        toast.success('Lesson started — your progress is saved.');
      },
      onError: () => toast.error('Could not save lesson progress. Please try again.')
    }
  );
  const completeMutation = useMutation(
    (moduleId) => learningService.completeModule(moduleId, { score: 100 }),
    {
      onSuccess: () => {
        refreshProgress();
        toast.success('Lesson completed. Great work!');
      },
      onError: () => toast.error('Could not complete this lesson. Please try again.')
    }
  );

  const selectedProgress = selectedModule ? progressByModule.get(selectedModule.id) : null;
  const sections = Array.isArray(selectedModule?.content?.sections) ? selectedModule.content.sections : [];
  const isLoading = modulesLoading || progressLoading;
  const hasError = modulesError || progressError;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Learning Hub</h1>
        <p className="text-gray-600 mt-1">Learn practical financial concepts and track your progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500">Available lessons</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{modules.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Lessons completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completedCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Overall completion</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {modules.length ? Math.round((completedCount / modules.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === item.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="lesson-search">Search lessons</label>
          <input
            id="lesson-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search lessons..."
            className="input-field lg:max-w-xs"
          />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Lessons</h2>
        {isLoading && <p className="text-gray-500 py-6 text-center">Loading lessons...</p>}
        {hasError && <p role="alert" className="text-red-600 py-4">Could not load lessons. Check that the backend is running, then refresh.</p>}
        {!isLoading && !hasError && (
          <div className="space-y-4">
            {filteredModules.map((module) => {
              const userProgress = progressByModule.get(module.id);
              const completed = userProgress?.status === 'completed';
              const value = userProgress?.progress || 0;
              return (
                <article key={module.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{module.title}</h3>
                        {completed && <CheckCircleIcon aria-label="Completed" className="w-5 h-5 text-green-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1" />{module.duration || 5} min</span>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded capitalize text-xs">{module.level}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize text-xs">{module.category.replaceAll('_', ' ')}</span>
                      </div>
                      {value > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1"><span>{completed ? 'Completed' : 'In progress'}</span><span>{value}%</span></div>
                          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${value}%` }} /></div>
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => setSelectedModule(module)} className="btn-primary whitespace-nowrap">
                      {completed ? 'Review lesson' : value > 0 ? 'Continue lesson' : 'Start lesson'}
                    </button>
                  </div>
                </article>
              );
            })}
            {filteredModules.length === 0 && <p className="text-gray-500 text-center py-8">No lessons match your search. Try another topic or search term.</p>}
          </div>
        )}
      </div>

      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedModule(null);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="lesson-title" className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-indigo-600 font-medium capitalize">{selectedModule.category.replaceAll('_', ' ')} · {selectedModule.duration || 5} min</p>
                <h2 id="lesson-title" className="text-2xl font-bold text-gray-800 mt-1">{selectedModule.title}</h2>
              </div>
              <button type="button" className="p-2 rounded hover:bg-gray-100" onClick={() => setSelectedModule(null)} aria-label="Close lesson"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <p className="text-gray-600 mb-5">{selectedModule.description}</p>
            <div className="space-y-4">
              {sections.map((section, index) => (
                <article key={`${section.heading}-${index}`} className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{section.heading}</h3>
                  <p className="text-gray-700 leading-relaxed">{section.text}</p>
                </article>
              ))}
              {sections.length === 0 && <p className="text-gray-500">Lesson content will be added soon.</p>}
            </div>
            {selectedProgress?.status === 'completed' && (
              <p className="mt-5 flex items-center gap-2 text-green-700"><CheckCircleIcon className="w-5 h-5" /> You completed this lesson.</p>
            )}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              {selectedProgress?.status !== 'completed' && (
                <>
                  {(!selectedProgress || selectedProgress.progress === 0) && (
                    <button type="button" className="btn-secondary" disabled={startMutation.isLoading} onClick={() => startMutation.mutate(selectedModule.id)}>
                      {startMutation.isLoading ? 'Saving...' : 'Save as in progress'}
                    </button>
                  )}
                  <button type="button" className="btn-primary" disabled={completeMutation.isLoading} onClick={() => completeMutation.mutate(selectedModule.id)}>
                    {completeMutation.isLoading ? 'Saving...' : 'Mark as complete'}
                  </button>
                </>
              )}
              {selectedProgress?.status === 'completed' && <button type="button" className="btn-primary" onClick={() => setSelectedModule(null)}>Done</button>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Learning;
