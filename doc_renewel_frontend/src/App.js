
import React, { useEffect, useState } from "react";
import "./App.css";
import documentApi from "./api/documentApi";

const initialForm = {
  documentName: "",
  documentType: "",
  holderName: "",
  referenceNumber: "",
  issueDate: "",
  expiryDate: "",
  reminderDaysBefore: 30,
  notes: "",
  renewed: false,
};

function App() {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({ ...initialForm });
  const [editingId, setEditingId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load documents when the component first opens.
  useEffect(() => {
    loadDocuments();
  }, []);

  // GET: Fetch all documents from Spring Boot.
  async function loadDocuments() {
    setLoading(true);
    setError("");

    try {
      const response = await documentApi.get("/getDocuments");
      setDocuments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError(
        "Unable to load documents. Check whether Spring Boot and MySQL are running and the API URL is correct."
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle all form inputs.
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Reset the form and exit edit mode.
  function resetForm() {
    setForm({ ...initialForm });
    setEditingId(null);
  }

  // POST: Create a document or PUT: Update an existing document.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.documentName.trim() ||
      !form.documentType.trim() ||
      !form.holderName.trim() ||
      !form.referenceNumber.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!form.issueDate || !form.expiryDate) {
      setError("Please select both the issue date and expiry date.");
      return;
    }

    if (form.expiryDate <= form.issueDate) {
      setError("Expiry date must be later than issue date.");
      return;
    }

    const reminderDays = Number(form.reminderDaysBefore);

    if (
      !Number.isInteger(reminderDays) ||
      reminderDays < 1 ||
      reminderDays > 3650
    ) {
      setError("Reminder days must be a whole number between 1 and 3650.");
      return;
    }

    const payload = {
      ...form,
      documentName: form.documentName.trim(),
      documentType: form.documentType.trim(),
      holderName: form.holderName.trim(),
      referenceNumber: form.referenceNumber.trim(),
      notes: form.notes.trim(),
      reminderDaysBefore: reminderDays,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await documentApi.put(`/updateDoc/${editingId}`, payload);
        setSuccess("Document updated successfully!");
      } else {
        await documentApi.post("/createDoc", payload);
        setSuccess("Document created successfully!");
      }

      resetForm();
      await loadDocuments();
    } catch (err) {
      console.error("Error saving document:", err);

      const responseData = err.response?.data;
      const message =
        responseData?.message ||
        responseData?.error ||
        (typeof responseData === "string" ? responseData : null);

      setError(
        message ||
          "Unable to save the document. Check your input and Spring Boot validation errors."
      );
    } finally {
      setSaving(false);
    }
  }

  // Load an existing document into the form.
  function handleEdit(doc) {
    setForm({
      documentName: doc.documentName ?? "",
      documentType: doc.documentType ?? "",
      holderName: doc.holderName ?? "",
      referenceNumber: doc.referenceNumber ?? "",
      issueDate: doc.issueDate ?? "",
      expiryDate: doc.expiryDate ?? "",
      reminderDaysBefore: doc.reminderDaysBefore ?? 30,
      notes: doc.notes ?? "",
      renewed: doc.renewed ?? false,
    });

    setEditingId(doc.id);
    setSelectedDocument(null);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // DELETE: Remove a document.
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await documentApi.delete(`/deleteDoc/${id}`);

      if (editingId === id) {
        resetForm();
      }

      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }

      setSuccess("Document deleted successfully!");
      await loadDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Unable to delete the document. Please try again.");
    }
  }

  // Calculate days remaining if the API has not supplied the property.
  function getDaysRemaining(doc) {
    if (typeof doc.daysRemaining === "number") {
      return doc.daysRemaining;
    }

    if (!doc.expiryDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(`${doc.expiryDate}T00:00:00`);
    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  }

  // Determine the status if the API has not supplied expiryStatus.
  function getExpiryStatus(doc) {
    if (doc.expiryStatus) return doc.expiryStatus;
    if (doc.renewed) return "RENEWED";

    const days = getDaysRemaining(doc);

    if (days === null) return "UNKNOWN";
    if (days <= 0) return "EXPIRED";
    if (days <= (doc.reminderDaysBefore ?? 30)) return "RENEWAL_SOON";

    return "VALID";
  }

  function getStatusClass(status) {
    switch (status) {
      case "VALID":
        return "text-bg-success";
      case "RENEWAL_SOON":
        return "text-bg-warning";
      case "EXPIRED":
        return "text-bg-danger";
      case "RENEWED":
        return "text-bg-primary";
      default:
        return "text-bg-secondary";
    }
  }

  function formatStatus(status) {
    if (status === "RENEWAL_SOON") return "Renewal Soon";
    if (!status) return "Unknown";

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  // Dashboard summary values.
  const totalCount = documents.length;

  const validCount = documents.filter(
    (doc) => getExpiryStatus(doc) === "VALID"
  ).length;

  const soonCount = documents.filter(
    (doc) => getExpiryStatus(doc) === "RENEWAL_SOON"
  ).length;

  const expiredCount = documents.filter(
    (doc) => getExpiryStatus(doc) === "EXPIRED"
  ).length;

  const renewedCount = documents.filter(
    (doc) => getExpiryStatus(doc) === "RENEWED"
  ).length;

  // Apply search and status filtering.
  const filteredDocuments = documents.filter((doc) => {
    const keyword = search.trim().toLowerCase();

    const matchesSearch = [
      doc.documentName,
      doc.documentType,
      doc.holderName,
      doc.referenceNumber,
    ].some((value) => (value ?? "").toLowerCase().includes(keyword));

    const matchesStatus =
      statusFilter === "ALL" || getExpiryStatus(doc) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-container">
      <div className="container py-4">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-2">Document Renewal Reminder</h1>
            <p className="text-secondary mb-0">
              Manage documents and track expiry dates in one place.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={loadDocuments}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Documents"}
          </button>
        </header>

        {/* Error and success messages */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="status">
            {success}
          </div>
        )}

        {/* Dashboard summary cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card summary-card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-2">Total Documents</p>
                <h2 className="fw-bold mb-0">{totalCount}</h2>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card summary-card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-2">Valid</p>
                <h2 className="fw-bold text-success mb-0">{validCount}</h2>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card summary-card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-2">Renewal Soon</p>
                <h2 className="fw-bold text-warning mb-0">{soonCount}</h2>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card summary-card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-2">Expired</p>
                <h2 className="fw-bold text-danger mb-0">{expiredCount}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Add or edit document form */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h2 className="h5 mb-0">
              {editingId !== null ? "Edit Document" : "Add New Document"}
            </h2>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6 col-lg-4">
                  <label htmlFor="documentName" className="form-label">
                    Document Name *
                  </label>
                  <input
                    id="documentName"
                    name="documentName"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Passport"
                    value={form.documentName}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label htmlFor="documentType" className="form-label">
                    Document Type *
                  </label>
                  <select
                    id="documentType"
                    name="documentType"
                    className="form-select"
                    value={form.documentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select document type</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Visa">Visa</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6 col-lg-4">
                  <label htmlFor="holderName" className="form-label">
                    Holder Name *
                  </label>
                  <input
                    id="holderName"
                    name="holderName"
                    type="text"
                    className="form-control"
                    placeholder="Enter holder name"
                    value={form.holderName}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label htmlFor="referenceNumber" className="form-label">
                    Reference Number *
                  </label>
                  <input
                    id="referenceNumber"
                    name="referenceNumber"
                    type="text"
                    className="form-control"
                    placeholder="Enter reference number"
                    value={form.referenceNumber}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label htmlFor="issueDate" className="form-label">
                    Issue Date *
                  </label>
                  <input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    className="form-control"
                    value={form.issueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date *
                  </label>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    className="form-control"
                    min={form.issueDate || undefined}
                    value={form.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label
                    htmlFor="reminderDaysBefore"
                    className="form-label"
                  >
                    Remind Before (Days) *
                  </label>
                  <input
                    id="reminderDaysBefore"
                    name="reminderDaysBefore"
                    type="number"
                    className="form-control"
                    min="1"
                    max="3650"
                    step="1"
                    value={form.reminderDaysBefore}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-secondary">
                    Default reminder: 30 days before expiry.
                  </small>
                </div>

                <div className="col-md-6 col-lg-8">
                  <label htmlFor="notes" className="form-label">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="form-control"
                    rows="2"
                    placeholder="Optional notes about this document"
                    value={form.notes}
                    onChange={handleChange}
                    maxLength={500}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      id="renewed"
                      name="renewed"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.renewed}
                      onChange={handleChange}
                    />
                    <label htmlFor="renewed" className="form-check-label">
                      This document has been renewed
                    </label>
                  </div>
                </div>

                <div className="col-12 d-flex flex-wrap gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId !== null
                      ? "Update Document"
                      : "Add Document"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      resetForm();
                      setError("");
                      setSuccess("");
                    }}
                  >
                    {editingId !== null ? "Cancel Edit" : "Clear Form"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Document list */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h2 className="h5 mb-1">Your Documents</h2>
                <small className="text-secondary">
                  {filteredDocuments.length} result(s) found
                </small>
              </div>

              <div className="d-flex flex-wrap gap-2 document-filters">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search documents..."
                  aria-label="Search documents"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <select
                  className="form-select"
                  aria-label="Filter by expiry status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="VALID">Valid</option>
                  <option value="RENEWAL_SOON">Renewal Soon</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="RENEWED">Renewed</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Holder</th>
                  <th>Expiry Date</th>
                  <th>Days Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-secondary mt-2 mb-0">
                        Loading documents...
                      </p>
                    </td>
                  </tr>
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <h3 className="h6">No documents found</h3>
                      <p className="text-secondary mb-0">
                        Add a document or change your search and filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => {
                    const status = getExpiryStatus(doc);
                    const days = getDaysRemaining(doc);

                    return (
                      <tr key={doc.id}>
                        <td>{doc.id}</td>

                        <td className="fw-semibold">
                          {doc.documentName}
                        </td>

                        <td>{doc.documentType}</td>

                        <td>{doc.holderName}</td>

                        <td>{doc.expiryDate || "—"}</td>

                        <td>
                          {days === null
                            ? "—"
                            : days <= 0 && status === "EXPIRED"
                            ? `${days} days`
                            : `${days} days`}
                        </td>

                        <td>
                          <span className={`badge ${getStatusClass(status)}`}>
                            {formatStatus(status)}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(doc)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(doc.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="card-footer bg-white text-secondary small">
            Total: {totalCount} | Valid: {validCount} | Renewal Soon:{" "}
            {soonCount} | Expired: {expiredCount} | Renewed: {renewedCount}
          </div>
        </div>

        {/* Document details modal */}
        {selectedDocument && (
          <div
            className="details-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedDocument(null);
              }
            }}
          >
            <div
              className="card details-modal shadow-lg"
              role="dialog"
              aria-modal="true"
              aria-labelledby="detailsTitle"
            >
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h2 id="detailsTitle" className="h5 mb-0">
                  Document Details
                </h2>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close details"
                  onClick={() => setSelectedDocument(null)}
                />
              </div>

              <div className="card-body">
                <div className="details-row">
                  <strong>Document ID</strong>
                  <span>{selectedDocument.id}</span>
                </div>

                <div className="details-row">
                  <strong>Document Name</strong>
                  <span>{selectedDocument.documentName || "—"}</span>
                </div>

                <div className="details-row">
                  <strong>Document Type</strong>
                  <span>{selectedDocument.documentType || "—"}</span>
                </div>

                <div className="details-row">
                  <strong>Holder Name</strong>
                  <span>{selectedDocument.holderName || "—"}</span>
                </div>

                <div className="details-row">
                  <strong>Reference Number</strong>
                  <span>{selectedDocument.referenceNumber || "—"}</span>
                </div>

                <div className="details-row">
                  <strong>Issue Date</strong>
                  <span>{selectedDocument.issueDate || "—"}</span>
                </div>

                <div className="details-row">
                  <strong>Expiry Date</strong>
                  <span>{selectedDocument.expiryDate || "—"}</span>
                </div>

                <div className="details-row">
                  <strong>Days Remaining</strong>
                  <span>
                    {getDaysRemaining(selectedDocument) ?? "Unknown"}
                  </span>
                </div>

                <div className="details-row">
                  <strong>Expiry Status</strong>
                  <span
                    className={`badge ${getStatusClass(
                      getExpiryStatus(selectedDocument)
                    )}`}
                  >
                    {formatStatus(getExpiryStatus(selectedDocument))}
                  </span>
                </div>

                <div className="details-row">
                  <strong>Reminder Days</strong>
                  <span>{selectedDocument.reminderDaysBefore ?? 30}</span>
                </div>

                <div className="details-row">
                  <strong>Renewed</strong>
                  <span>{selectedDocument.renewed ? "Yes" : "No"}</span>
                </div>

                <div className="details-notes mt-3">
                  <strong>Notes</strong>
                  <p className="mb-0 mt-2">
                    {selectedDocument.notes || "No notes added."}
                  </p>
                </div>
              </div>

              <div className="card-footer bg-white d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedDocument(null)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEdit(selectedDocument)}
                >
                  Edit Document
                </button>
              </div>
            </div>
          </div>
        )}
        <h5 style={{ fontSize: '0.9rem', color: '#aa0389' }}>
          <marquee behavior="scroll" direction="left" scrollamount="5">
            Developed by : Ranga Sai Manoj
          </marquee>
        </h5>
        {/* Footer */}
        <footer className="text-center text-secondary small py-3">
          Document Renewal Reminder | React + Spring Boot + MySQL<br/>
          @Ranga Sai Manoj | mail_to: <a href="mailto:rangasaimanoj1919@gmail.com">rangasaimanoj1919@gmail.com</a>
        </footer>
      </div>
    </div>
  );
}

export default App;
