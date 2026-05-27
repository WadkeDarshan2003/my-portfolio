import React, { useState, useEffect } from 'react';
import { migrateProjectsToFirebase, getMigrationStatus } from '../services/migrationService';
import { Project } from '../../types';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface MigrationModalProps {
  projects: Project[];
  onMigrationComplete: () => void;
  isOpen: boolean;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({
  projects,
  onMigrationComplete,
  isOpen,
}) => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'migrating' | 'complete' | 'error' | 'firebase_error'>(
    'idle'
  );
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: boolean;
    migrated: number;
    failed: number;
    errors: Array<{ projectId: string | number; error: string }>;
  } | null>(null);
  const [databaseEmpty, setDatabaseEmpty] = useState(false);

  useEffect(() => {
    if (isOpen && status === 'idle') {
      checkDatabaseStatus();
    }
  }, [isOpen]);

  const checkDatabaseStatus = async () => {
    setStatus('checking');
    try {
      const migrationStatus = await getMigrationStatus();
      setDatabaseEmpty(migrationStatus.isDatabaseEmpty);
      setStatus(migrationStatus.isDatabaseEmpty ? 'idle' : 'complete');
    } catch (error) {
      console.error('Error checking database:', error);
      setStatus('firebase_error');
    }
  };

  const handleMigrate = async () => {
    setStatus('migrating');
    setProgress(0);

    try {
      let currentIndex = 0;
      
      // More intelligent progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 85) return prev + Math.random() * 15;
          return prev;
        });
      }, 500);

      const migrationResults = await migrateProjectsToFirebase(projects);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(migrationResults);
      
      if (migrationResults.success) {
        setStatus('complete');
        // Auto close on success after 2 seconds
        setTimeout(() => {
          onMigrationComplete();
        }, 2000);
      } else if (migrationResults.failed > 0) {
        // Show partial success
        setStatus('complete');
      }
    } catch (error) {
      console.error('Migration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Migration error details:', errorMessage);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Database Migration
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-sm">
            Migrate your projects to Firebase
          </p>
        </div>

        {/* Content */}
        {status === 'checking' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader className="animate-spin text-blue-500" size={32} />
            </div>
            <p className="text-center text-slate-600 dark:text-neutral-400">
              Checking database status...
            </p>
          </div>
        )}

        {status === 'idle' && databaseEmpty && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-900 dark:text-blue-200 text-sm">
                Your Firestore database is empty. Ready to migrate {projects.length} projects.
              </p>
            </div>
            <button
              onClick={handleMigrate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Start Migration
            </button>
          </div>
        )}

        {status === 'idle' && !databaseEmpty && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-900 dark:text-yellow-200 text-sm">
                Your database already has projects. Migration may create duplicates. Continue?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStatus('idle')}
                className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-slate-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMigrate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {status === 'migrating' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader className="animate-spin text-blue-500" size={32} />
            </div>
            <div className="w-full bg-slate-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-slate-600 dark:text-neutral-400 text-sm">
              Migrating {progress}%...
            </p>
          </div>
        )}

        {status === 'complete' && results && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-900 dark:text-green-200 font-semibold mb-2">
                Migration {results.success ? 'Completed Successfully!' : 'Completed with Errors'}
              </p>
              <p className="text-green-800 dark:text-green-300 text-sm">
                ✓ {results.migrated} projects migrated
              </p>
              {results.failed > 0 && (
                <p className="text-red-800 dark:text-red-300 text-sm">
                  ✗ {results.failed} projects failed
                </p>
              )}
            </div>
            {results.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto bg-slate-50 dark:bg-neutral-800 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-2">
                  Errors:
                </p>
                {results.errors.map((err, idx) => (
                  <p key={idx} className="text-xs text-red-600 dark:text-red-400 mb-1">
                    • Project {err.projectId}: {err.error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="text-red-600" size={48} />
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-900 dark:text-red-200 text-sm">
                An error occurred during migration. Please check your Firebase configuration and
                try again.
              </p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {status === 'firebase_error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="text-orange-600" size={48} />
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <p className="text-orange-900 dark:text-orange-200 font-semibold mb-2">
                Firebase Connection Failed
              </p>
              <p className="text-orange-900 dark:text-orange-200 text-sm mb-3">
                Unable to connect to Firebase. This might be a network issue or Firebase isn't properly configured.
              </p>
              <div className="bg-orange-100 dark:bg-orange-950 rounded p-3 text-xs text-orange-900 dark:text-orange-200 space-y-1">
                <p><strong>Troubleshooting steps:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your internet connection</li>
                  <li>Verify Firebase credentials in .env file</li>
                  <li>Ensure Firestore database is created in Firebase Console</li>
                  <li>Check Firestore security rules allow access</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => {
                setStatus('checking');
                checkDatabaseStatus();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
