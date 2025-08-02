"use client";

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, HardDrive } from 'lucide-react';

interface StorageToggleProps {
  onStorageChange: (useDatabase: boolean) => void;
  currentStorage: 'indexeddb' | 'sqlite';
}

export function StorageToggle({ onStorageChange, currentStorage }: StorageToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');

  const useDatabase = currentStorage === 'sqlite';

  useEffect(() => {
    checkDatabaseHealth();
  }, []);

  const checkDatabaseHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus(data.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (error) {
      setHealthStatus('unhealthy');
    }
  };

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (!useDatabase) {
        // Switching to database - check health first
        await checkDatabaseHealth();
        if (healthStatus === 'unhealthy') {
          alert('Database is not available. Please ensure the server is running.');
          return;
        }
      }
      
      onStorageChange(!useDatabase);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusText = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'Connected';
      case 'unhealthy':
        return 'Disconnected';
      default:
        return 'Checking...';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage Mode
        </CardTitle>
        <CardDescription>
          Choose between local browser storage and shared SQLite database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="storage-toggle" className="text-sm font-medium">
              {useDatabase ? 'SQLite Database' : 'IndexedDB (Browser)'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {useDatabase 
                ? 'Shared across all browsers on this device'
                : 'Stored in current browser only'
              }
            </p>
          </div>
          <Switch
            id="storage-toggle"
            checked={useDatabase}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>

        {useDatabase && (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Database Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                healthStatus === 'healthy' ? 'bg-green-500' : 
                healthStatus === 'unhealthy' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className={`text-xs ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        )}

        {useDatabase && healthStatus === 'unhealthy' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs text-red-700">
              Database connection failed. Please ensure the server is running and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={checkDatabaseHealth}
            >
              Retry Connection
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>IndexedDB:</strong> Fast, browser-specific storage</p>
          <p><strong>SQLite:</strong> Cross-browser shared storage</p>
        </div>
      </CardContent>
    </Card>
  );
} 