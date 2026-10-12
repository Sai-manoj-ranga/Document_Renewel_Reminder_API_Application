package com.projects.document_renewel_reminder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projects.document_renewel_reminder.model.DocumentRenewel;
import com.projects.document_renewel_reminder.service.DocumentRenewelService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentRenewelController {
	
	@Autowired
	DocumentRenewelService drService;
	
	@GetMapping("/getDocuments")
	List<DocumentRenewel> getallDocuments(){
		return drService.getallDocuments();
	}
	
	@GetMapping("/getDocumentById/{id}")
	DocumentRenewel getDocumentById(@PathVariable Long id) {
		return drService.getDocumentById(id);
	}
	
	@PostMapping("/createDoc")
	DocumentRenewel createDocument(@Valid @RequestBody DocumentRenewel dr) {
		return drService.createDocument(dr);
	}
	
	@DeleteMapping("/deleteDoc/{id}")
	String deleteDocumentById(@PathVariable Long id) {
		return drService.deleteDocumentById(id);
	}
	
	@PutMapping("/updateDoc/{id}")
	DocumentRenewel updateDocument(@RequestBody DocumentRenewel dr,@PathVariable Long id) {
		return drService.updateDocument(dr, id);
	}
}
