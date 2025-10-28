import { useState, useEffect, useRef, useCallback } from "react";
import api from "~/config/api";
import { Button } from "~/components/ui/Button";
import { ConfirmDialog } from "~/components/ui/ConfirmDialog";
import Navbar from "~/components/Navbar";
import { uploadImageEndpoint } from "~/config/endpoints";
import Dialog from "~/components/ui/Dialog";

interface Entry {
  id: number;
  title: string;
  type: string;
  director: string;
  budget?: number;
  location: string;
  duration: string;
  year: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; entryId: number | null }>({
    isOpen: false,
    entryId: null,
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "Movie" as "Movie" | "TV Show",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
    imageUrl: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastEntryElementRef = useRef<HTMLDivElement | null>(null);

  // Build query parameters for API calls
  const buildQueryParams = useCallback((page: number) => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: pagination.limit.toString(),
    };
    return new URLSearchParams(params);
  }, [pagination.limit]);

  const loadEntries = useCallback(async (page: number, reset: boolean = false) => {
    if (isLoading || (page > pagination.totalPages && pagination.totalPages > 0 && !reset)) {
      return;
    }

    setIsLoading(true);
    try {
      const params = buildQueryParams(page);
      const response = await api.get(`/movies?${params}`);

      if (reset || page === 1) {
        setEntries(response.data.entries);
      } else {
        setEntries(prev => [...prev, ...response.data.entries]);
      }

      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to load entries:", error);
      // Reset entries on error when resetting
      if (reset) {
        setEntries([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, pagination.totalPages, buildQueryParams]);

  // Initial load
  useEffect(() => {
    loadEntries(1, true);
  }, []);

  // Load more entries when page changes (for infinite scroll)
  useEffect(() => {
    if (pagination.page > 1) {
      loadEntries(pagination.page, false);
    }
  }, [pagination.page]);

  // Intersection Observer for infinite scrolling
  const lastEntryRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node && !isLoading && pagination.page < pagination.totalPages) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting && !isLoading) {
          setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
      });

      observerRef.current.observe(node);
      lastEntryElementRef.current = node;
    }
  }, [isLoading, pagination.page, pagination.totalPages]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploadingImage || isSubmitting) {
      console.warn("Please wait for operation to complete");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/movies", {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        year: parseInt(formData.year),
        imageUrl: formData.imageUrl || undefined,
      });
      resetForm();
      setIsModalOpen(false);
      
      // Reload data to ensure consistency
      setEntries([]);
      setPagination(prev => ({ ...prev, page: 1, total: 0, totalPages: 0 }));
      await loadEntries(1, true);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to add entry:", error);
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const handleEdit = (entry: Entry) => {
    setFormData({
      title: entry.title,
      type: entry.type as "Movie" | "TV Show",
      director: entry.director,
      budget: entry.budget?.toString() || "",
      location: entry.location,
      duration: entry.duration,
      year: entry.year.toString(),
      imageUrl: entry.imageUrl || "",
    });
    setIsEditing(entry.id);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploadingImage || isSubmitting) {
      console.warn("Please wait for operation to complete");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/movies/${isEditing}`, {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        year: parseInt(formData.year),
        imageUrl: formData.imageUrl || undefined,
      });
      resetForm();
      setIsEditing(null);
      setIsModalOpen(false);
      
      // Reload data to ensure consistency
      setEntries([]);
      setPagination(prev => ({ ...prev, page: 1, total: 0, totalPages: 0 }));
      await loadEntries(1, true);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to update entry:", error);
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteConfirm({ isOpen: true, entryId: id });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.entryId) {
      try {
        await api.delete(`/movies/${deleteConfirm.entryId}`);
        // Reload data to ensure consistency
        setEntries([]);
        setPagination(prev => ({ ...prev, page: 1, total: 0, totalPages: 0 }));
        await loadEntries(1, true);
      } catch (error) {
        console.error("Failed to delete entry:", error);
      } finally {
        setDeleteConfirm({ isOpen: false, entryId: null });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "Movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year: "",
      imageUrl: "",
    });
    setIsEditing(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api.post(`/` + uploadImageEndpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
      }
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Collection
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {pagination.total} {pagination.total === 1 ? 'entry' : 'entries'} in your collection
            </p>
          </div>
          <Button onClick={openAddModal}>
            + Add Entry
          </Button>
        </div>

        {/* Search and Filter removed */}

        {/* Entries Grid */}
        {entries.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {"No entries found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {entries.map((entry, index) => {
              const isLastElement = index === entries.length - 1;
              const shouldAttachRef = isLastElement && pagination.page < pagination.totalPages;

              return (
                <div
                  key={`${entry.id}-${index}`} // Add index to key for better re-rendering
                  ref={shouldAttachRef ? lastEntryRef : null}
                  className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Card Image */}
                  {entry.imageUrl ? (
                    <img
                      src={entry.imageUrl}
                      alt={entry.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[2/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[2/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {entry.type === "Movie" ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          )}
                        </svg>
                        <p className="text-xs text-muted-foreground mt-2">{entry.type}</p>
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-2">
                      {entry.title}
                    </h3>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="truncate">{entry.director}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{entry.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{entry.duration}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{entry.year}</span>
                        {entry.budget && <span className="ml-auto">${entry.budget}M</span>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        )}

        {/* End of results message */}
        {entries.length > 0 && pagination.page >= pagination.totalPages && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {pagination.total === entries.length 
                ? `You've reached the end of your collection (${pagination.total} entries)`
                : `You've reached the end of filtered results (${entries.length} of ${pagination.total} entries)`
              }
            </p>
          </div>
        )}
      </div>

      {/* Rest of your modal and dialog code remains the same */}
      <Dialog
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit Entry" : "Add New Entry"} 
        children={
          <form
            onSubmit={isEditing ? handleUpdate : handleAdd}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onKeyDown={(e) => {
              if ((e.key === 'Enter' && (uploadingImage || isSubmitting))) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            {/* Form content remains the same */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={uploadingImage || isSubmitting}
                className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "Movie" | "TV Show" })}
              disabled={uploadingImage || isSubmitting}
              className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Director *
            </label>
            <input
              type="text"
              required
              value={formData.director}
              onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              disabled={uploadingImage || isSubmitting}
              className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Budget (in millions)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              disabled={uploadingImage || isSubmitting}
              className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={uploadingImage || isSubmitting}
              className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Duration *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 148 min"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              disabled={uploadingImage || isSubmitting}
              className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div> 

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Year *
            </label>
            <input
              type="number"
              required
              min="1888"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              disabled={uploadingImage || isSubmitting}
              className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-card-foreground mb-2 space-x-5">
              Poster Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploadingImage || isSubmitting}
              className="w-full px-4 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting || uploadingImage}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || uploadingImage}>
                {uploadingImage ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  `${isEditing ? "Update" : "Add"} Entry`
                )}
              </Button>
            </div>
          </form>
        } 
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, entryId: null })}
        onConfirm={confirmDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </div>
  );
};