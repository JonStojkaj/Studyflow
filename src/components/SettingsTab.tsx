import { useState } from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Bell, BarChart3, Eye } from "lucide-react";

export function SettingsTab() {
  const [breakReminder, setBreakReminder] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showLearningStatus, setShowLearningStatus] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-purple-600" />
              <h3>Notifications</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="break-reminder" className="cursor-pointer">
                  Break End Reminder
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified when your break time is over
                </p>
              </div>
              <Switch
                id="break-reminder"
                checked={breakReminder}
                onCheckedChange={setBreakReminder}
              />
            </div>
          </div>

          {/* Privacy */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-purple-600" />
              <h3>Privacy</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="show-stats" className="cursor-pointer">
                    Show My Stats
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow others to see your statistics
                  </p>
                </div>
                <Switch
                  id="show-stats"
                  checked={showStats}
                  onCheckedChange={setShowStats}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="learning-status" className="cursor-pointer">
                    Show Learning Status
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Let friends see when you're studying
                  </p>
                </div>
                <Switch
                  id="learning-status"
                  checked={showLearningStatus}
                  onCheckedChange={setShowLearningStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
