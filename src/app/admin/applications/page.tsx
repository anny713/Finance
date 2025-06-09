'use client';

import { useEffect, useState } from 'react';
import type { Application } from '@/types';
import { getApplicationsAction } from '@/actions/plans'; // Assuming this action is created
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      setIsLoading(true);
      // Mocked action, will use localStorage
      const fetchedApplications = await getApplicationsAction();
      // Sort by date, newest first
      fetchedApplications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
      setApplications(fetchedApplications);
      setIsLoading(false);
    }
    fetchApplications();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 font-headline">User Applications</h1>
      {applications.length === 0 ? (
        <p className="text-muted-foreground">No applications found.</p>
      ) : (
        <Table>
          <TableCaption>A list of user applications for financial plans.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Income</TableHead>
              <TableHead>Plan Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(app => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.userName}</TableCell>
                <TableCell>{app.userMobile}</TableCell>
                <TableCell>${app.userIncome.toLocaleString()}</TableCell>
                <TableCell>{app.planTitle}</TableCell>
                <TableCell>{app.planCategory}</TableCell>
                <TableCell>{format(new Date(app.appliedAt), 'PPpp')}</TableCell>
                <TableCell>
                  <Badge variant={app.status === 'PENDING' ? 'secondary' : app.status === 'APPROVED' ? 'default' : 'destructive'}>
                    {app.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
