import React, { useState, useEffect, useCallback } from 'react';
import DashboardStats from '../components/admin/DashboardStats';
import LeadFilters from '../components/admin/LeadFilters';
import LeadTable from '../components/admin/LeadTable';
import LeadDetailModal from '../components/admin/LeadDetailModal';
import AddFollowUpModal from '../components/admin/AddFollowUpModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { leadService } from '../services/leadService';
import { useToast } from '../context/ToastContext';
import { RefreshCw, Download, Plus, LayoutDashboard, Sparkles } from 'lucide-react';


export default function AdminDashboardPage() {
  const { success, error: toastError } = useToast();

  const [summary, setSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const [leads, setLeads] = useState([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedService, setSelectedService] = useState('All Services');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [viewingLead, setViewingLead] = useState(null);
  const [followUpLead, setFollowUpLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0); // Reset to first page on search
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const data = await leadService.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Fetch summary error:', err);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    setIsLeadsLoading(true);
    try {
      const isFiltered =
        debouncedSearch.trim() !== '' ||
        (selectedService !== 'All Services' && selectedService !== '') ||
        selectedStatus !== 'ALL';

      let data;
      if (isFiltered) {
        data = await leadService.searchLeads({
          name: debouncedSearch.trim() || null,
          service: selectedService === 'All Services' ? null : selectedService,
          status: selectedStatus === 'ALL' ? null : selectedStatus,
          page,
          size,
          sortBy,
          sortDir,
        });
      } else {
        data = await leadService.getLeads({
          page,
          size,
          sortBy,
          sortDir,
        });
      }

      setLeads(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Fetch leads error:', err);
      toastError(err.response?.data?.message || 'Failed to fetch enquiries.');
    } finally {
      setIsLeadsLoading(false);
    }
  }, [debouncedSearch, selectedService, selectedStatus, page, size, sortBy, sortDir, toastError]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handlers
  const handleRefresh = () => {
    fetchSummary();
    fetchLeads();
    success('Dashboard refreshed');
  };

  const handleStatusSelectFromCard = (status) => {
    setSelectedStatus(status);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedService('All Services');
    setSelectedStatus('ALL');
    setPage(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setPage(0);
  };

  const handleQuickStatusChange = async (leadId, newStatus) => {
    // FOLLOW_UP requires a follow-up date — redirect to the AddFollowUp modal
    if (newStatus === 'FOLLOW_UP') {
      const lead = leads.find((l) => l.id === leadId);
      if (lead) {
        setFollowUpLead(lead);
      }
      return;
    }
    try {
      await leadService.updateLeadStatus(leadId, newStatus);
      success(`Lead status updated to ${newStatus}`);
      fetchSummary();
      fetchLeads();
      if (viewingLead && viewingLead.id === leadId) {
        setViewingLead((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleFollowUpAdded = (updatedLead) => {
    fetchSummary();
    fetchLeads();
    if (viewingLead && viewingLead.id === updatedLead.id) {
      setViewingLead(updatedLead);
    }
  };

  const handleDeleteLeadConfirm = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await leadService.deleteLead(deletingLead.id);
      success('Enquiry deleted successfully');
      setDeletingLead(null);
      fetchSummary();
      fetchLeads();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete enquiry');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Enquiry & Lead Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review visitor enquiries, track sales pipeline stages, and manage customer follow-ups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
              title="Refresh leads and metrics"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <DashboardStats
          summary={summary}
          selectedStatus={selectedStatus}
          onSelectStatus={handleStatusSelectFromCard}
          isLoading={isSummaryLoading}
        />

        <LeadFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedService={selectedService}
          onServiceChange={(val) => {
            setSelectedService(val);
            setPage(0);
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(val) => {
            setSelectedStatus(val);
            setPage(0);
          }}
          onResetFilters={handleResetFilters}
          totalResults={totalElements}
        />

        <LeadTable
          leads={leads}
          isLoading={isLeadsLoading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
          onViewLead={(lead) => setViewingLead(lead)}
          onAddFollowUp={(lead) => setFollowUpLead(lead)}
          onQuickStatusChange={handleQuickStatusChange}
          onDeleteLead={(lead) => setDeletingLead(lead)}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />

        <LeadDetailModal
          isOpen={!!viewingLead}
          onClose={() => setViewingLead(null)}
          lead={viewingLead}
          onStatusUpdated={(updated) => {
            setViewingLead(updated);
            fetchSummary();
            fetchLeads();
          }}
          onOpenAddFollowUp={(lead) => setFollowUpLead(lead)}
        />

        <AddFollowUpModal
          isOpen={!!followUpLead}
          onClose={() => setFollowUpLead(null)}
          lead={followUpLead}
          onFollowUpAdded={handleFollowUpAdded}
        />

        <ConfirmModal
          isOpen={!!deletingLead}
          onClose={() => setDeletingLead(null)}
          onConfirm={handleDeleteLeadConfirm}
          title="Delete Enquiry Record?"
          message={`Are you sure you want to delete the enquiry from ${deletingLead?.name}? All associated follow-up notes will be permanently removed.`}
          confirmText="Yes, Delete Enquiry"
          isDestructive={true}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
