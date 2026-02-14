import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export const metadata: Metadata = {
  title: 'Calendar - TodoApp',
  description: 'View your todos in calendar view',
};

export default function CalendarPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View your todos by due date
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Due Dates</CardTitle>
            <CardDescription>
              Select a date to view todos due on that day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today&apos;s Todos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming soon</div>
              <p className="text-xs text-muted-foreground">
                Calendar integration in development
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
