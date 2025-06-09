
'use client';

import { useEffect, useState } from 'react';
import type { Application } from '@/types';
import { getApplicationsAction, updateApplicationStatusAction } from '@/actions/plans';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchApplications() {
      setIsLoading(true);
      const fetchedApplications = await getApplicationsAction();
      setApplications(fetchedApplications);
      setIsLoading(false);
    }
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (applicationId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setUpdatingStatusId(applicationId);
    const result = await updateApplicationStatusAction(applicationId, newStatus);
    setUpdatingStatusId(null);

    if ('error' in result) {
      toast({
        title: "Update Failed",
        description: result.error,
        variant: "destructive",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    } else {
      toast({
        title: `Application ${newStatus.toLowerCase()}`,
        description: `Application ID ${applicationId} has been ${newStatus.toLowerCase()}. User would be notified.`,
        className: newStatus === 'APPROVED' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground",
        icon: newStatus === 'APPROVED' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />,
      });
      setApplications(prevApps =>
        prevApps.map(app => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
    }
  };

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
              <TableHead>Applicant Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Income</TableHead>
              <TableHead>Plan Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
              <TableHead>User ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(app => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.applicantName}</TableCell>
                <TableCell>{app.applicantMobile}</TableCell>
                <TableCell>${app.applicantIncome.toLocaleString()}</TableCell>
                <TableCell>{app.planTitle}</TableCell>
                <TableCell>{app.planCategory}</TableCell>
                <TableCell>{format(new Date(app.appliedAt), 'PPpp')}</TableCell>
                <TableCell>
                  <Badge 
                    variant={app.status === 'PENDING' ? 'secondary' : app.status === 'APPROVED' ? 'default' : 'destructive'}
                    className={app.status === 'APPROVED' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}
                  >
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  {app.status === 'PENDING' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:bg-green-100 hover:text-green-700"
                        onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                        disabled={updatingStatusId === app.id}
                      >
                        {updatingStatusId === app.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-100 hover:text-red-700"
                        onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                        disabled={updatingStatusId === app.id}
                      >
                        {updatingStatusId === app.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <XCircle className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  {app.status !== 'PENDING' && <span className="text-xs text-muted-foreground">Actioned</span>}
                </TableCell>
                <TableCell>{app.userId || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

    