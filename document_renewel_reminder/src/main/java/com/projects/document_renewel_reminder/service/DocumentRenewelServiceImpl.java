
package com.projects.document_renewel_reminder.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.projects.document_renewel_reminder.model.DocumentRenewel;
import com.projects.document_renewel_reminder.repo.DocRenewelRepo;

@Service
public class DocumentRenewelServiceImpl implements DocumentRenewelService {

	@Autowired
    private final DocRenewelRepo drRepo;

    // Constructor injection
    public DocumentRenewelServiceImpl(DocRenewelRepo drRepo) {
        this.drRepo = drRepo;
    }

    @Override
    public List<DocumentRenewel> getallDocuments() {
        return drRepo.findAll(Sort.by(Sort.Direction.ASC, "expiryDate"));
    }

    @Override
    public DocumentRenewel getDocumentById(Long id) {
        return drRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Document not found with ID: " + id));
    }

    @Override
    public DocumentRenewel createDocument(DocumentRenewel dr) {
        return drRepo.save(dr);
    }

    @Override
    public String deleteDocumentById(Long id) {
        DocumentRenewel drDB = getDocumentById(id);
        drRepo.delete(drDB);

        return "Document " + id + " deleted successfully";
    }

    @Override
    public DocumentRenewel updateDocument(
            DocumentRenewel dr, Long id) {

        DocumentRenewel drDB = getDocumentById(id);

        drDB.setDocumentName(dr.getDocumentName());
        drDB.setDocumentType(dr.getDocumentType());
        drDB.setHolderName(dr.getHolderName());
        drDB.setReferenceNumber(dr.getReferenceNumber());
        drDB.setIssueDate(dr.getIssueDate());
        drDB.setExpiryDate(dr.getExpiryDate());
        drDB.setReminderDaysBefore(dr.getReminderDaysBefore());
        drDB.setNotes(dr.getNotes());
        drDB.setRenewed(dr.isRenewed());

        return drRepo.save(drDB);
    }
}
