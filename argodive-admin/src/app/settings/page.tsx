'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Webhook,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Navigation</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {[
              { icon: User, label: 'Profile' },
              { icon: Bell, label: 'Notifications' },
              { icon: Shield, label: 'Permissions' },
              { icon: Database, label: 'Data Management' },
              { icon: Palette, label: 'Appearance' },
              { icon: Webhook, label: 'Integrations' },
            ].map((item) => (
              <Button key={item.label} variant="ghost" className="w-full justify-start gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue="admin@argodive.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input defaultValue="System Administrator" disabled />
                </div>
              </div>
              <Button><Save className="mr-1 h-4 w-4" /> Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Critical Alerts', desc: 'Receive push notifications for critical alerts', enabled: true },
                { label: 'Daily Summary', desc: 'End-of-day operational summary email', enabled: true },
                { label: 'Weekly Report', desc: 'Weekly production and health report', enabled: false },
                { label: 'Maintenance Reminders', desc: 'Scheduled maintenance notifications', enabled: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Badge variant={n.enabled ? 'success' : 'secondary'}>
                    {n.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Database Connection</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Connection String</label>
                <Input
                  type="password"
                  defaultValue="postgresql://****:****@ep-****.neon.tech/argodive?sslmode=require"
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Connected</Badge>
                <span className="text-xs text-muted-foreground">Last sync: 2 minutes ago</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Test Connection</Button>
                <Button variant="outline" size="sm">Sync Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
