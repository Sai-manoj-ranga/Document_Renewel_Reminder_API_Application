package com.projects.document_renewel_reminder.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projects.document_renewel_reminder.model.DocumentRenewel;

public interface DocRenewelRepo extends JpaRepository<DocumentRenewel,Long>{

}
