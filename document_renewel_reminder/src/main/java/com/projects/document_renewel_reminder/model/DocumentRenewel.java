package com.projects.document_renewel_reminder.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name="document_renewal")
@Setter
@Getter

public class DocumentRenewel {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message="Document Name is must required")
	@Size(max=100)
	@Column(nullable=false,length=100)
	private String documentName;
	
	@NotBlank(message="Document Type is must required")
	@Size(max=50)
	@Column(nullable=false,length=50)
	private String documentType;
	
	@NotBlank(message="Holder Name is required")
	@Size(max=100)
	@Column(nullable=false,length=100)
	private String holderName;
	
	@Size(max=100)
	private String referenceNumber;
	
	@Column(nullable=false)
	private LocalDate issueDate;
	
	@Column(nullable=false)
	private LocalDate expiryDate;
	
    @Min(value = 1, message = "Reminder must be at least 1 day")
	private Integer reminderDaysBefore=30;
    
    @Size(max=500)
	private String notes;
    
    @Column(nullable=false)
	private boolean renewed=false;
    
    @AssertTrue(message = "Expiry date must be after issue date")
    public boolean isDateRangeValid() {
        return issueDate == null || expiryDate == null
                || expiryDate.isAfter(issueDate);
    }
	
    @Transient
    public long getDaysRemaining() {
        if (expiryDate == null) return 0;
        return ChronoUnit.DAYS.between(
                LocalDate.now(), expiryDate);
    }

    @Transient
    public String getExpiryStatus() {
        if (renewed) return "RENEWED";
        if (expiryDate == null) return "UNKNOWN";

        long days = getDaysRemaining();

        if (days <= 0) return "EXPIRED";
        if (days <= reminderDaysBefore) return "RENEWAL_SOON";

        return "VALID";
    }
    
	
}
