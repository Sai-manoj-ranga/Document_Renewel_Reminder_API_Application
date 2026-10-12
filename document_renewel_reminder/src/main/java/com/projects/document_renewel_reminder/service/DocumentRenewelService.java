package com.projects.document_renewel_reminder.service;

import java.util.List;

import com.projects.document_renewel_reminder.model.DocumentRenewel;

public interface DocumentRenewelService {
	
	List<DocumentRenewel> getallDocuments();
	DocumentRenewel getDocumentById(Long id);
	DocumentRenewel createDocument(DocumentRenewel dr);
	String deleteDocumentById(Long id);
	DocumentRenewel updateDocument(DocumentRenewel dr,Long id);

}
